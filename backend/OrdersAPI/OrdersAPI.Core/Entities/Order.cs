using OrdersAPI.Core.Enums;

namespace OrdersAPI.Core.Entities
{
    public class Order
    {
        public Guid Id { get; set; }
        public required string Cliente { get; set; }
        public required string Produto { get; set; }
        public decimal Valor { get; set; }
        public OrderStatusEnum Status { get; set; } = OrderStatusEnum.Pendente;
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
