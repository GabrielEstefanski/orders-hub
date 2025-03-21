namespace OrdersAPI.Application.Interfaces
{
    public interface IRabbitMqService
    {
        Task SendMessageAsync(string queueName, string message);
        Task<string?> ReceiveMessageAsync(string queueName);
    }
}
