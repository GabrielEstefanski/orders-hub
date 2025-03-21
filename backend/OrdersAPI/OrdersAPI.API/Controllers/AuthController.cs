using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OrdersAPI.API.Services;
using OrdersAPI.Core.DTOs.Request;
using OrdersAPI.Core.DTOs.Response;
using OrdersAPI.Core.Entities;
using OrdersAPI.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace OrdersAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(
        IUserRepository userRepository,
        IAuthService authService,
        ILogger<AuthController> logger,
        IFileService fileService) : ControllerBase
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IAuthService _authService = authService;
        private readonly ILogger<AuthController> _logger = logger;
        private readonly IFileService _fileService = fileService;

        [HttpPost("login")]
        [ApiExplorerSettings(GroupName = "v1")]
        [ProducesResponseType(200, Type = typeof(AuthResponseDto))]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto loginDto)
        {
            try
            {
                var user = await _userRepository.GetUserByEmailAsync(loginDto.Email);
                if (user == null || !VerifyPassword(loginDto.Password, user.Password))
                {
                    _logger.LogWarning("Tentativa de login inválida para o email: {Email}", loginDto.Email);
                    return Unauthorized(new { message = "Credenciais inválidas" });
                }

                _logger.LogInformation("Login bem-sucedido para o usuário: {UserId}", user.Id);
                var token = _authService.GenerateJwtToken(user);
                var refreshToken = _authService.GenerateRefreshToken(user.Id.ToString());

                Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(7)
                });

                return Ok(new AuthResponseDto
                {
                    Token = token,
                    UserId = user.Id,
                    Name = user.Name,
                    Email = user.Email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao fazer login para o email: {Email}", loginDto.Email);
                return StatusCode(500, new { message = "Erro ao processar a solicitação" });
            }
        }

        [HttpPost("register")]
        [ApiExplorerSettings(GroupName = "v1")]
        [ProducesResponseType(201, Type = typeof(User))]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<User>> Register([FromForm] RegisterRequestDTO registerDto)
        {
            try
            {
                var existingUser = await _userRepository.GetUserByEmailAsync(registerDto.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { success = false, message = "Este e-mail já está cadastrado" });
                }

                string photoUrl = null;
                if (registerDto.ProfilePhoto != null)
                {
                    try
                    {
                        photoUrl = await _fileService.SaveProfilePhotoAsync(registerDto.ProfilePhoto);
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(new { message = "Erro ao processar a foto de perfil", error = ex.Message });
                    }
                }

                var user = new User
                {
                    Name = registerDto.Name,
                    Email = registerDto.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                    ProfilePhoto = photoUrl
                };

                await _userRepository.CreateUserAsync(user);

                return Ok(new { 
                    success = true, 
                    message = "Usuário cadastrado com sucesso" 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao registrar usuário");
                return BadRequest(new { success = false, message = "Erro ao cadastrar usuário" });
            }
        }

        [HttpPost("refresh-token")]
        [ApiExplorerSettings(GroupName = "v1")]
        [ProducesResponseType(200, Type = typeof(AuthResponseDto))]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<AuthResponseDto>> RefreshToken([FromBody] RefreshTokenRequestDTO refreshTokenDto)
        {
            try
            {
                var refreshToken = Request.Cookies["refreshToken"];
                if (string.IsNullOrEmpty(refreshToken))
                {
                    return Unauthorized(new { message = "Refresh token não encontrado" });
                }

                var user = await _userRepository.GetUserByIdAsync(refreshTokenDto.UserId);
                if (user == null)
                {
                    return Unauthorized(new { message = "Usuário não encontrado" });
                }

                if (!_authService.ValidateRefreshToken(user.Id.ToString(), refreshToken))
                {
                    return Unauthorized(new { message = "Refresh token inválido" });
                }

                var newToken = _authService.GenerateJwtToken(user);
                var newRefreshToken = _authService.GenerateRefreshToken(user.Id.ToString());

                Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(7)
                });

                return Ok(new AuthResponseDto
                {
                    Token = newToken,
                    UserId = user.Id,
                    Name = user.Name,
                    Email = user.Email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao renovar token");
                return StatusCode(500, new { message = "Erro ao processar a solicitação" });
            }
        }

        [HttpGet("me")]
        [Authorize]
        [ApiExplorerSettings(GroupName = "v1")]
        [ProducesResponseType(200, Type = typeof(User))]
        [ProducesResponseType(401)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<User>> GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Usuário não autenticado" });
                }

                var user = await _userRepository.GetUserByIdAsync(Guid.Parse(userId));
                if (user == null)
                {
                    return NotFound(new { message = "Usuário não encontrado" });
                }

                user.Password = null;

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao obter usuário atual");
                return StatusCode(500, new { message = "Erro ao processar a solicitação" });
            }
        }

        private bool VerifyPassword(string password, string passwordHash)
        {
            try
            {
                return BCrypt.Net.BCrypt.Verify(password, passwordHash);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao verificar senha");
                return false;
            }
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private static bool IsStrongPassword(string password)
        {
            if (password.Length < 8)
                return false;

            if (!password.Any(char.IsUpper))
                return false;

            if (!password.Any(char.IsLower))
                return false;

            if (!password.Any(char.IsDigit))
                return false;

            if (!password.Any(c => !char.IsLetterOrDigit(c)))
                return false;

            return true;
        }
    }
}
