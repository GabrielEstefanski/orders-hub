using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OrdersAPI.Core.Enums;
using Microsoft.Extensions.DependencyInjection;
using OrdersAPI.Core.Interfaces;
using OrdersAPI.Application.Interfaces;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

namespace OrdersAPI.Application.Services
{
    public class OrderProcessingWorker : BackgroundService
    {
        private readonly ILogger<OrderProcessingWorker> _logger;
        private readonly IOrderService _orderService;
        private IConnection? _connection;
        private IChannel? _channel;
        private readonly string _queueName = "order_queue";
        private readonly Random _random = new();

        public OrderProcessingWorker(
            ILogger<OrderProcessingWorker> logger,
            IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            _orderService = scopeFactory.CreateScope().ServiceProvider.GetRequiredService<IOrderService>();
            InitializeRabbitMQ();
        }

        private void InitializeRabbitMQ()
        {
            try
            {
                var factory = new ConnectionFactory() { HostName = "rabbitmq" };
                _connection = factory.CreateConnectionAsync().Result;
                _channel = _connection.CreateChannelAsync().Result;
                _channel.QueueDeclareAsync(queue: _queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);
                _channel.BasicQosAsync(prefetchSize: 0, prefetchCount: 1, global: false);

                _logger.LogInformation("RabbitMQ inicializado com sucesso");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao inicializar RabbitMQ");
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (_channel == null)
            {
                _logger.LogError("Canal RabbitMQ não inicializado");
                return;
            }

            var consumer = new AsyncEventingBasicConsumer(_channel);
            consumer.ReceivedAsync += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                try
                {
                    _logger.LogInformation("Mensagem recebida: {Message}", message);
                    await ProcessMessage(message);
                    await _channel.BasicAckAsync(deliveryTag: ea.DeliveryTag, multiple: false);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro ao processar mensagem: {Message}", message);
                    await _channel.BasicNackAsync(deliveryTag: ea.DeliveryTag, multiple: false, requeue: true);
                }
            };

            await _channel.BasicConsumeAsync(queue: _queueName, autoAck: false, consumer: consumer);

            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken);
            }
        }

        private async Task ProcessMessage(string message)
        {
            try
            {
                if (Guid.TryParse(message, out Guid orderId))
                {
                    _logger.LogInformation("Atualizando pedido {OrderId} para 'Processando'...", orderId);
                    await _orderService.UpdateOrderStatusAsync(orderId, OrderStatusEnum.Processando);

                    int processTime = _random.Next(5000, 15000);
                    await Task.Delay(processTime);

                    _logger.LogInformation("Atualizando pedido {OrderId} para 'Finalizado' após {ProcessTime}ms", orderId, processTime);
                    await _orderService.UpdateOrderStatusAsync(orderId, OrderStatusEnum.Finalizado);
                }
                else
                {
                    _logger.LogInformation("Mensagem processada: {Message}", message);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar pedido: {Message}", message);
                throw;
            }
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            if (_channel != null)
            {
                await _channel.CloseAsync(200, "Goodbye", false, cancellationToken);
            }
            if (_connection != null)
            {
                await _connection.CloseAsync(200, "Goodbye", TimeSpan.FromSeconds(10), false, cancellationToken);
            }
            await base.StopAsync(cancellationToken);
        }
    }
}