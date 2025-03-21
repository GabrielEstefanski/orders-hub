using Microsoft.AspNetCore.SignalR;
using OrdersAPI.Core.Interfaces;

namespace OrdersAPI.API.Hubs
{
    public class NotificationHub(IMetricsService metricsService) : Hub
    {
        private readonly IMetricsService _metricsService = metricsService;

        public override async Task OnConnectedAsync()
        {
            _metricsService.IncrementActiveUsers();
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _metricsService.DecrementActiveUsers();
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendNotification(Guid orderId, string orderName, int status)
        {
            var update = new { OrderId = orderId, OrderName = orderName, Status = status };

            await Clients.All.SendAsync("ReceiveNotification", update);
        }
    }
}
