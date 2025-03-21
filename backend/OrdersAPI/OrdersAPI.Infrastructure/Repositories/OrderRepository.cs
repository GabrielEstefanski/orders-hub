using Microsoft.EntityFrameworkCore;
using OrdersAPI.Infrastructure.Data;
using OrdersAPI.Core.Entities;
using OrdersAPI.Core.Interfaces;

namespace OrdersAPI.Infrastructure.Repositories
{
    public class OrderRepository(ApplicationDbContext context) : IOrderRepository
    {
        private readonly ApplicationDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

        public async Task<IEnumerable<Order>> GetOrdersAsync(string? searchTerm)
        {
            IQueryable<Order> query = _context.Orders;

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(o =>
                    EF.Functions.ILike(o.Cliente, $"%{searchTerm}%") ||
                    EF.Functions.ILike(o.Produto, $"%{searchTerm}%"));
            }

            return await query.ToListAsync();
        }

        public async Task<Order> GetOrderByIdAsync(Guid id)
        {
            var order = await _context.Orders.FindAsync(id);
            return order ?? throw new KeyNotFoundException($"Produto com ID {id} não encontrado.");
        }

        public async Task AddOrderAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
        }

        public async Task<Order> UpdateOrderAsync(Order order)
        {
            try
            {
                var local = _context.Orders.Local.FirstOrDefault(e => e.Id == order.Id);
                if (local != null)
                {
                    _context.Entry(local).State = EntityState.Detached;
                }

                _context.Entry(order).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                _context.Entry(order).Reload();
                return order;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Orders.AnyAsync(e => e.Id == order.Id))
                {
                    throw new KeyNotFoundException($"Pedido com ID {order.Id} não encontrado.");
                }
                else
                {
                    throw;
                }
            }
        }

        public async Task DeleteOrderAsync(Order order)
        {
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
        }
    }
}
