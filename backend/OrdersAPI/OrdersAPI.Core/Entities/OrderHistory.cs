namespace OrdersAPI.Core.Entities
{
    public class OrderHistory
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public required string Field { get; set; }
        public required string OldValue { get; set; }
        public required string NewValue { get; set; }
        public required string ChangedBy { get; set; }
        public required DateTime ChangedAt { get; set; }
        public Order? Order { get; set; }
    }
} 