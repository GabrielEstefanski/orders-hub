using OrdersAPI.Core.Entities;
using OrdersAPI.Core.Enums;

namespace OrdersAPI.Application.Interfaces
{
    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetOrdersAsync(string? searchTerm, string? sortBy = "DataDeCriacao", bool descending = false);
        Task<Order?> GetOrderByIdAsync(Guid id);
        Task<Order> CreateOrderAsync(Order order, string createdBy);
        Task<Order> UpdateOrderAsync(Order order, string changedBy);
        Task UpdateOrderStatusAsync(Guid orderId, OrderStatusEnum status);
        Task DeleteOrderAsync(Guid orderId);
        Task<IEnumerable<OrderHistory>> GetOrderHistoryAsync(Guid orderId);
    }
}
