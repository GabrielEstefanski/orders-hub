using Microsoft.IdentityModel.Tokens;
using OrdersAPI.Core.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace OrdersAPI.API.Services
{
    public class AuthService(IConfiguration configuration) : IAuthService
    {
        private readonly IConfiguration _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        private static readonly Dictionary<string, string> _refreshTokens = new();

        public string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["Secret"] ?? 
                throw new InvalidOperationException("JWT Secret key is not configured.");
                
            var key = Encoding.ASCII.GetBytes(secretKey);
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            };

            var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
            var tokenDescriptor = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpirationInMinutes"])),
                signingCredentials: signingCredentials
            );

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.WriteToken(tokenDescriptor);

            return token;
        }

        public string GenerateRefreshToken(string userId)
        {
            var refreshToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            _refreshTokens[userId] = refreshToken;
            return refreshToken;
        }

        public bool ValidateRefreshToken(string userId, string refreshToken)
        {
            return _refreshTokens.ContainsKey(userId) && _refreshTokens[userId] == refreshToken;
        }
    }
} 