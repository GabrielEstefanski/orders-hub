using Microsoft.AspNetCore.SignalR;
using OrdersAPI.Application.Interfaces;
using OrdersAPI.Core.Enums;
using OrdersAPI.API.Hubs;
using OrdersAPI.Core.Entities;

namespace OrdersAPI.API.Services
{
    public class NotificationService(IHubContext<NotificationHub> hubContext) : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext = hubContext;

        public async Task SendOrderUpdateStatusNotificationAsync(Order order)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", new
            {
                Order = order,
                ActionType = "OrderUpdated"
            });
        }

        public async Task SendOrderUpdateNotificationAsync(Order order)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", new
            {
                Order = order,
                ActionType = "Updated"
            });
        }

        public async Task SendOrderCreatedNotificationAsync(Order order)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", new
            {
                Order = order,
                ActionType = "Created"
            });
        }

        public async Task SendOrderDeletedNotificationAsync(Guid orderId)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", new
            {
                OrderId = orderId,
                ActionType = "Deleted"
            });
        }

        public async Task SendOrderUpdatedNotificationAsync(Order order)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", new
            {
                Order = order,
                ActionType = "Updated"
            });
        }
    }
}
