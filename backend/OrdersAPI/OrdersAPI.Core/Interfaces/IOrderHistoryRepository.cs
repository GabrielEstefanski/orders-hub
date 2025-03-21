using OrdersAPI.Core.Entities;

namespace OrdersAPI.Core.Interfaces
{
    public interface IOrderHistoryRepository
    {
        Task<IEnumerable<OrderHistory>> GetOrderHistoryAsync(Guid orderId);
        Task AddOrderHistoryAsync(OrderHistory history);
    }
} 