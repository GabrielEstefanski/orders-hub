using System.ComponentModel.DataAnnotations;
using System.Reflection;
using OrdersAPI.Core.Entities;
using OrdersAPI.Core.Enums;
using OrdersAPI.Core.Interfaces;
using OrdersAPI.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace OrdersAPI.Application.Services
{
    public class OrderService(
        IOrderRepository orderRepository,
        IOrderHistoryRepository orderHistoryRepository,
        IRabbitMqService rabbitMqService,
        INotificationService notificationService,
        ICacheService cacheService,
        ILogger<OrderService> logger,
        IMetricsService metricsService) : IOrderService
    {
        private readonly IOrderRepository _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
        private readonly IOrderHistoryRepository _orderHistoryRepository = orderHistoryRepository ?? throw new ArgumentNullException(nameof(orderHistoryRepository));
        private readonly IRabbitMqService _rabbitMqService = rabbitMqService ?? throw new ArgumentNullException(nameof(rabbitMqService));
        private readonly string _queueName = "order_queue";
        private readonly INotificationService _notificationService = notificationService ?? throw new ArgumentNullException(nameof(notificationService));
        private readonly ICacheService _cacheService = cacheService ?? throw new ArgumentNullException(nameof(cacheService));
        private readonly ILogger<OrderService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        private readonly IMetricsService _metricsService = metricsService ?? throw new ArgumentNullException(nameof(metricsService));
        private const string ORDERS_CACHE_PREFIX = "orders:";
        private const string SEARCH_TERMS_KEY = "orders:search-terms";
        private const string ORDER_DETAIL_PREFIX = "order:detail:";
        private readonly TimeSpan CACHE_DURATION = TimeSpan.FromMinutes(10);

        public async Task<IEnumerable<Order>> GetOrdersAsync(string? searchTerm, string? sortBy = "DataDeCriacao", bool descending = false)
        {
            var startTime = DateTime.UtcNow;
            try
            {
                var normalizedSearch = searchTerm?.Trim().ToLower() ?? "all";
                var sortOrder = descending ? "desc" : "asc";
                var cacheKey = $"{ORDERS_CACHE_PREFIX}list:{normalizedSearch}:sort:{sortBy}:{sortOrder}";

                var cachedOrders = await _cacheService.GetCacheDataAsync<IEnumerable<Order>>(cacheKey);
                if (cachedOrders != null)
                {
                    _metricsService.RecordCacheHit("redis", "get");
                    return cachedOrders;
                }

                _metricsService.RecordCacheMiss("redis", "get");
                var orders = await _orderRepository.GetOrdersAsync(searchTerm);
                orders = SortOrders(orders, sortBy, descending);

                await _cacheService.SetCacheDataAsync(cacheKey, orders, CACHE_DURATION);
                _metricsService.RecordCacheMiss("redis", "set");

                await TrackSearchTermAsync(normalizedSearch);

                return orders;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar pedidos: {Message}", ex.Message);
                throw;
            }
            finally
            {
                var duration = (DateTime.UtcNow - startTime).TotalSeconds;
                _metricsService.RecordProcessingTime(duration);
            }
        }

        public async Task<Order?> GetOrderByIdAsync(Guid id)
        {
            var cacheKey = $"{ORDER_DETAIL_PREFIX}{id}";
            var cachedOrder = await _cacheService.GetCacheDataAsync<Order>(cacheKey);

            if (cachedOrder != null)
            {
                _metricsService.RecordCacheHit("redis", "get");
                return cachedOrder;
            }
            
            _metricsService.RecordCacheMiss("redis", "get");
            
            var order = await _orderRepository.GetOrderByIdAsync(id);
            if (order != null)
            {
                await _cacheService.SetCacheDataAsync(cacheKey, order, CACHE_DURATION);
                _metricsService.RecordCacheMiss("redis", "set");
            }
            
            return order;
        }

        public async Task<Order> CreateOrderAsync(Order order, string createdBy)
        {
            var startTime = DateTime.UtcNow;
            try
            {
                await _orderRepository.AddOrderAsync(order);
                
                await _orderHistoryRepository.AddOrderHistoryAsync(new OrderHistory
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    Field = "Criação",
                    OldValue = "N/A",
                    NewValue = $"Pedido criado - Cliente: {order.Cliente}, Produto: {order.Produto}, Valor: {order.Valor}, Status: {order.Status}",
                    ChangedBy = createdBy,
                    ChangedAt = DateTime.UtcNow
                });

                await _rabbitMqService.SendMessageAsync(_queueName, order.Id.ToString());
                
                var cacheKey = $"{ORDER_DETAIL_PREFIX}{order.Id}";
                await _cacheService.SetCacheDataAsync(cacheKey, order, CACHE_DURATION);
                
                await InvalidateListCaches();
                await _notificationService.SendOrderCreatedNotificationAsync(order);

                _metricsService.IncrementProcessedOrders("success", "standard");
                return order;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar pedido: {Message}", ex.Message);
                _metricsService.IncrementProcessedOrders("failed", "standard");
                throw;
            }
            finally
            {
                var duration = (DateTime.UtcNow - startTime).TotalSeconds;
                _metricsService.RecordProcessingTime(duration);
            }
        }

        public async Task<Order> UpdateOrderAsync(Order order, string changedBy)
        {
            var startTime = DateTime.UtcNow;
            try
            {
                var existingOrder = await _orderRepository.GetOrderByIdAsync(order.Id) ?? throw new KeyNotFoundException($"Pedido com ID {order.Id} não encontrado.");
                
                var orderCopy = new Order
                {
                    Id = order.Id,
                    Cliente = order.Cliente,
                    Produto = order.Produto,
                    Valor = order.Valor,
                    Status = order.Status,
                    DataCriacao = order.DataCriacao,
                    UpdatedAt = order.UpdatedAt
                };
                
                if (existingOrder.Cliente != order.Cliente)
                {
                    await _orderHistoryRepository.AddOrderHistoryAsync(new OrderHistory
                    {
                        Id = Guid.NewGuid(),
                        OrderId = order.Id,
                        Field = "Cliente",
                        OldValue = existingOrder.Cliente,
                        NewValue = order.Cliente,
                        ChangedBy = changedBy,
                        ChangedAt = DateTime.UtcNow
                    });
                }

                if (existingOrder.Produto != order.Produto)
                {
                    await _orderHistoryRepository.AddOrderHistoryAsync(new OrderHistory
                    {
                        Id = Guid.NewGuid(),
                        OrderId = order.Id,
                        Field = "Produto",
                        OldValue = existingOrder.Produto,
                        NewValue = order.Produto,
                        ChangedBy = changedBy,
                        ChangedAt = DateTime.UtcNow
                    });
                }

                if (existingOrder.Valor != order.Valor)
                {
                    await _orderHistoryRepository.AddOrderHistoryAsync(new OrderHistory
                    {
                        Id = Guid.NewGuid(),
                        OrderId = order.Id,
                        Field = "Valor",
                        OldValue = existingOrder.Valor.ToString(),
                        NewValue = order.Valor.ToString(),
                        ChangedBy = changedBy,
                        ChangedAt = DateTime.UtcNow
                    });
                }

                if (existingOrder.Status != order.Status)
                {
                    await _orderHistoryRepository.AddOrderHistoryAsync(new OrderHistory
                    {
                        Id = Guid.NewGuid(),
                        OrderId = order.Id,
                        Field = "Status",
                        OldValue = existingOrder.Status.ToString(),
                        NewValue = order.Status.ToString(),
                        ChangedBy = changedBy,
                        ChangedAt = DateTime.UtcNow
                    });
                }

                order.UpdatedAt = DateTime.UtcNow;
                var updatedOrder = await _orderRepository.UpdateOrderAsync(order);
                await _rabbitMqService.SendMessageAsync(_queueName, order.Id.ToString());
                
                var result = await _orderRepository.GetOrderByIdAsync(order.Id);
                
                await _notificationService.SendOrderUpdatedNotificationAsync(result);
                
                _metricsService.IncrementProcessedOrders("success", "update");
                
                return result;
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Pedido não encontrado: {Message}", ex.Message);
                _metricsService.IncrementProcessedOrders("failed", "not_found");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar pedido: {Message}", ex.Message);
                _metricsService.IncrementProcessedOrders("failed", "standard");
                throw;
            }
            finally
            {
                var duration = (DateTime.UtcNow - startTime).TotalSeconds;
                _metricsService.RecordProcessingTime(duration);
            }
        }

        public async Task UpdateOrderStatusAsync(Guid orderId, OrderStatusEnum status)
        {
            var startTime = DateTime.UtcNow;
            try
            {
                var order = await _orderRepository.GetOrderByIdAsync(orderId);
                if (order != null)
                {
                    var statusDisplayName = status.GetType()
                        .GetMember(status.ToString())
                        .FirstOrDefault()?
                        .GetCustomAttribute<DisplayAttribute>()
                        ?.Name ?? status.ToString();

                    var oldStatusDisplayName = order.Status.GetType()
                        .GetMember(order.Status.ToString())
                        .FirstOrDefault()?
                        .GetCustomAttribute<DisplayAttribute>()
                        ?.Name ?? order.Status.ToString();

                    _logger.LogInformation("Atualizando status do pedido {OrderId} de {OldStatus} para {NewStatus}", 
                        orderId, order.Status, status);

                    order.Status = status;
                    order.UpdatedAt = DateTime.UtcNow;
                    
                    await _orderRepository.UpdateOrderAsync(order);

                    await _orderHistoryRepository.AddOrderHistoryAsync(new OrderHistory
                    {
                        Id = Guid.NewGuid(),
                        OrderId = orderId,
                        Field = "Status",
                        OldValue = oldStatusDisplayName,
                        NewValue = $"{statusDisplayName} - {DateTime.UtcNow:dd/MM/yyyy HH:mm:ss}",
                        ChangedBy = "Sistema",
                        ChangedAt = DateTime.UtcNow
                    });

                    var cacheKey = $"{ORDER_DETAIL_PREFIX}{orderId}";
                    await _cacheService.SetCacheDataAsync(cacheKey, order, CACHE_DURATION);
                    await InvalidateListCaches();

                    await _rabbitMqService.SendMessageAsync(_queueName, $"Pedido {orderId} atualizado para {statusDisplayName}");
                    await _notificationService.SendOrderUpdateStatusNotificationAsync(order);
                    
                    _logger.LogInformation("Status do pedido {OrderId} atualizado com sucesso para {NewStatus}", 
                        orderId, status);

                    _metricsService.IncrementProcessedOrders("success", "standard");
                }
                else
                {
                    _logger.LogWarning("Tentativa de atualizar status de pedido inexistente: {OrderId}", orderId);
                    throw new KeyNotFoundException($"Pedido com ID {orderId} não encontrado.");
                }
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Pedido não encontrado: {Message}", ex.Message);
                _metricsService.IncrementProcessedOrders("failed", "not_found");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar status do pedido: {Message}", ex.Message);
                _metricsService.IncrementProcessedOrders("failed", "standard");
                throw;
            }
            finally
            {
                var duration = (DateTime.UtcNow - startTime).TotalSeconds;
                _metricsService.RecordProcessingTime(duration);
            }
        }

        public async Task DeleteOrderAsync(Guid orderId)
        {
            var startTime = DateTime.UtcNow;
            try
            {
                var order = await _orderRepository.GetOrderByIdAsync(orderId);
                if (order != null)
                {
                    await _orderRepository.DeleteOrderAsync(order);
                    
                    await _cacheService.RemoveCacheDataAsync($"{ORDER_DETAIL_PREFIX}{orderId}");
                    await InvalidateListCaches();

                    await _rabbitMqService.SendMessageAsync(_queueName, $"Pedido {orderId} deletado.");
                    await _notificationService.SendOrderDeletedNotificationAsync(orderId);

                    _metricsService.IncrementProcessedOrders("success", "standard");
                }
                else
                {
                    _logger.LogWarning("Tentativa de excluir pedido inexistente: {OrderId}", orderId);
                    throw new KeyNotFoundException($"Pedido com ID {orderId} não encontrado.");
                }
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Pedido não encontrado: {Message}", ex.Message);
                _metricsService.IncrementProcessedOrders("failed", "not_found");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao excluir pedido: {Message}", ex.Message);
                _metricsService.IncrementProcessedOrders("failed", "standard");
                throw;
            }
            finally
            {
                var duration = (DateTime.UtcNow - startTime).TotalSeconds;
                _metricsService.RecordProcessingTime(duration);
            }
        }

        private async Task TrackSearchTermAsync(string searchTerm)
        {
            var searchTerms = await _cacheService.GetCacheDataAsync<HashSet<string>>(SEARCH_TERMS_KEY) ?? new HashSet<string>();
            if (!searchTerms.Contains(searchTerm))
            {
                searchTerms.Add(searchTerm);
                await _cacheService.SetCacheDataAsync(SEARCH_TERMS_KEY, searchTerms, TimeSpan.FromDays(1));
                _metricsService.RecordCacheMiss("redis", "set");
            }
        }

        private async Task InvalidateListCaches()
        {
            await _cacheService.InvalidateByPatternAsync($"{ORDERS_CACHE_PREFIX}list:");
            await _cacheService.InvalidateByPatternAsync("dashboard:");
            _metricsService.RecordCacheMiss("redis", "invalidate");
        }

        private static IEnumerable<Order> SortOrders(IEnumerable<Order> orders, string sortBy, bool descending)
        {
            orders = sortBy.ToLower() switch
            {
                "cliente" => descending ? orders.OrderByDescending(o => o.Cliente) : orders.OrderBy(o => o.Cliente),
                "produto" => descending ? orders.OrderByDescending(o => o.Produto) : orders.OrderBy(o => o.Produto),
                "status" => descending ? orders.OrderByDescending(o => o.Status) : orders.OrderBy(o => o.Status),
                "valor" => descending ? orders.OrderByDescending(o => o.Valor) : orders.OrderBy(o => o.Valor),
                _ => descending ? orders.OrderByDescending(o => o.DataCriacao) : orders.OrderBy(o => o.DataCriacao),
            };
            return orders;
        }

        public async Task<IEnumerable<OrderHistory>> GetOrderHistoryAsync(Guid orderId)
        {
            return await _orderHistoryRepository.GetOrderHistoryAsync(orderId);
        }
    }
}
