using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OrdersAPI.Core.Entities;
using OrdersAPI.Core.Enums;
using OrdersAPI.Infrastructure.Data;
using Npgsql;
namespace OrdersAPI.Seeder.Generator
{
    public class MockDataGenerator
    {
        private readonly ILogger<MockDataGenerator> _logger;

        public MockDataGenerator(ILogger<MockDataGenerator> logger = null)
        {
            _logger = logger;
        }

        public static List<Order> GenerateOrders(int quantity)
        {
            var faker = new Faker<Order>()
                .RuleFor(o => o.Id, f => Guid.NewGuid())
                .RuleFor(o => o.Cliente, f => f.Name.FullName())
                .RuleFor(o => o.Produto, f => f.Commerce.ProductName())
                .RuleFor(o => o.Valor, f => f.Finance.Amount(10, 1000))
                .RuleFor(o => o.Status, f => f.PickRandom<OrderStatusEnum>())
                .RuleFor(o => o.DataCriacao, f => f.Date.Past(1, DateTime.UtcNow));

            return faker.Generate(quantity);
        }

        public static IEnumerable<Order> GenerateOrdersInBatches(int totalQuantity, int batchSize = 10000)
        {

            var productNames = new Faker().Commerce.Categories(50).ToArray();
            var customerNames = new Faker().Name.FullName();
            var random = new Random();
            var statusValues = Enum.GetValues(typeof(OrderStatusEnum));

            var batches = totalQuantity / batchSize;
            if (totalQuantity % batchSize != 0) batches++;

            for (int i = 0; i < batches; i++)
            {
                var currentBatchSize = Math.Min(batchSize, totalQuantity - (i * batchSize));
                var batchOrders = new List<Order>(currentBatchSize);

                for (int j = 0; j < currentBatchSize; j++)
                {
                    var order = new Order
                    {
                        Id = Guid.NewGuid(),
                        Cliente = customerNames,
                        Produto = productNames[random.Next(productNames.Length)],
                        Valor = (decimal)Math.Round(random.NextDouble() * 990 + 10, 2),
                        Status = (OrderStatusEnum)statusValues.GetValue(random.Next(statusValues.Length))!,
                        DataCriacao = DateTime.SpecifyKind(DateTime.UtcNow.AddDays(-random.Next(365)), DateTimeKind.Unspecified)
                    };
                    batchOrders.Add(order);
                }

                foreach (var order in batchOrders)
                {
                    yield return order;
                }
            }
        }

        public static async Task<int> GenerateAndSaveOrdersInBatchesAsync(
            ApplicationDbContext context, 
            int totalQuantity, 
            int batchSize = 10000,
            ILogger? logger = null)
        {
            int totalInserted = 0;
            var batches = totalQuantity / batchSize;
            if (totalQuantity % batchSize != 0) batches++;

            logger?.LogInformation($"Iniciando geração de {totalQuantity} registros em {batches} lotes");

            foreach (var batch in Enumerable.Range(0, batches))
            {
                var start = DateTime.Now;
                var currentBatchSize = Math.Min(batchSize, totalQuantity - (batch * batchSize));
                
                var orders = GenerateOrdersInBatches(currentBatchSize, currentBatchSize).ToList();
                
                await BulkInsertOrdersAsync(context, orders);
                
                totalInserted += currentBatchSize;
                var elapsed = (DateTime.Now - start).TotalSeconds;
                
                logger?.LogInformation($"Lote {batch+1}/{batches} inserido: {currentBatchSize} registros em {elapsed:F2}s " +
                    $"({currentBatchSize / elapsed:F0} registros/s). Total: {totalInserted}/{totalQuantity}");
            }

            return totalInserted;
        }

        private static async Task BulkInsertOrdersAsync(ApplicationDbContext context, List<Order> orders)
        {
            var connectionString = context.Database.GetConnectionString();

            using var npgsqlConnection = new NpgsqlConnection(connectionString);

            await npgsqlConnection.OpenAsync();

            try
            {
                using var writer = npgsqlConnection.BeginBinaryImport(
                    "COPY \"Orders\" (\"Id\", \"Cliente\", \"Produto\", \"Valor\", \"Status\", \"DataCriacao\") FROM STDIN (FORMAT BINARY)");
                foreach (var order in orders)
                {
                    writer.StartRow();
                    writer.Write(order.Id, NpgsqlTypes.NpgsqlDbType.Uuid);
                    writer.Write(order.Cliente, NpgsqlTypes.NpgsqlDbType.Text);
                    writer.Write(order.Produto, NpgsqlTypes.NpgsqlDbType.Text);
                    writer.Write(order.Valor, NpgsqlTypes.NpgsqlDbType.Numeric);
                    writer.Write((int)order.Status, NpgsqlTypes.NpgsqlDbType.Integer);

                    var localDateTime = DateTime.SpecifyKind(order.DataCriacao, DateTimeKind.Unspecified);
                    writer.Write(localDateTime, NpgsqlTypes.NpgsqlDbType.Timestamp);
                }

                writer.Complete();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro durante o bulk insert: {ex.Message}");
                throw;
            }
        }
    }
}
