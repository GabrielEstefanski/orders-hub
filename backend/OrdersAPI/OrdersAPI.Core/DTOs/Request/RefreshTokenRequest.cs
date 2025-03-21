namespace OrdersAPI.Core.DTOs.Request
{
    public class RefreshTokenRequestDTO
    {
        public Guid UserId { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
    }
}