using Microsoft.EntityFrameworkCore;
using OrdersAPI.Core.Entities;
using OrdersAPI.Core.Interfaces;
using OrdersAPI.Infrastructure.Data;

namespace OrdersAPI.Infrastructure.Repositories
{
    public class OrderHistoryRepository(ApplicationDbContext context) : IOrderHistoryRepository
    {
        private readonly ApplicationDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

        public async Task<IEnumerable<OrderHistory>> GetOrderHistoryAsync(Guid orderId)
        {
            return await _context.OrderHistories
                .Where(h => h.OrderId == orderId)
                .OrderByDescending(h => h.ChangedAt)
                .ToListAsync();
        }

        public async Task AddOrderHistoryAsync(OrderHistory history)
        {
            try
            {
                _context.OrderHistories.Add(history);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Erro ao adicionar histórico de pedido: {ex.Message}", ex);
            }
        }
    }
} 