using OrdersAPI.Core.Entities;

namespace OrdersAPI.Core.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByIdAsync(Guid userId);
        Task CreateUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task<User?> GetUserByRefreshTokenAsync(string refreshToken);
        Task UpdateRefreshTokenAsync(Guid userId, string refreshToken);
        Task UpdateUserPhotoAsync(Guid userId, string profilePhoto);
    }
}
