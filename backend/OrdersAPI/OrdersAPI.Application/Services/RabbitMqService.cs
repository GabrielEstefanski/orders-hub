using OrdersAPI.Application.Interfaces;
using RabbitMQ.Client;
using System.Text;

namespace OrdersAPI.Application.Services
{
    public class RabbitMqService: IRabbitMqService, IAsyncDisposable
    {
        private readonly IConnection _connection;
        private readonly IChannel _channel;

        public RabbitMqService(IConnection connection)
        {
            _connection = connection ?? throw new ArgumentNullException(nameof(connection));
            _channel = _connection.CreateChannelAsync().GetAwaiter().GetResult();
        }

        public async Task SendMessageAsync(string queueName, string message)
        {
            if (string.IsNullOrEmpty(queueName))
                throw new ArgumentNullException(nameof(queueName));

            if (string.IsNullOrEmpty(message))
                throw new ArgumentNullException(nameof(message));

            await _channel.QueueDeclareAsync(
                queue: queueName, 
                durable: true, 
                exclusive: false, 
                autoDelete: false, 
                arguments: null);

            var body = Encoding.UTF8.GetBytes(message);
            await _channel.BasicPublishAsync(exchange: "", routingKey: queueName, body: body);
        }

        public async Task<string?> ReceiveMessageAsync(string queueName)
        {
            if (string.IsNullOrEmpty(queueName))
                throw new ArgumentNullException(nameof(queueName));

            await _channel.QueueDeclareAsync(
                queueName, 
                durable: true, 
                exclusive: false, 
                autoDelete: false, 
                arguments: null);

            var result = await _channel.BasicGetAsync(queueName, true);
            return result == null ? null : Encoding.UTF8.GetString(result.Body.ToArray());
        }

        public async ValueTask DisposeAsync()
        {
            await _channel.CloseAsync();
            await _connection.CloseAsync();
        }
    }
}
