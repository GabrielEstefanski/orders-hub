using OrdersAPI.Core.Entities;
using OrdersAPI.Core.Enums;

namespace OrdersAPI.Application.Interfaces
{
    public interface INotificationService
    {
        Task SendOrderUpdateStatusNotificationAsync(Order order);
        Task SendOrderUpdateNotificationAsync(Order order);
        Task SendOrderCreatedNotificationAsync(Order order);
        Task SendOrderDeletedNotificationAsync(Guid orderId);
        Task SendOrderUpdatedNotificationAsync(Order result);
    }
}
