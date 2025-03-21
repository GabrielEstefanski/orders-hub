using OrdersAPI.Core.Entities;

namespace OrdersAPI.Core.Interfaces
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetOrdersAsync(string? searchTerm);
        Task<Order> GetOrderByIdAsync(Guid id);
        Task AddOrderAsync(Order order);
        Task<Order> UpdateOrderAsync(Order order);
        Task DeleteOrderAsync(Order order);
    }
}
