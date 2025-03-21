namespace OrdersAPI.Core.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public string? Password { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public string? ProfilePhoto { get; set; }
    }
}
