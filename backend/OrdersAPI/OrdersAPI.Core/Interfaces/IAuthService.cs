using OrdersAPI.Core.Entities;

namespace OrdersAPI.API.Services
{
    public interface IAuthService
    {
        string GenerateJwtToken(User user);
        string GenerateRefreshToken(string userId);
        bool ValidateRefreshToken(string userId, string refreshToken);
    }
} 