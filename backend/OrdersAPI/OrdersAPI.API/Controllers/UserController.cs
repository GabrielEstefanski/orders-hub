using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrdersAPI.Core.Interfaces;
using OrdersAPI.Core.DTOs.Response;
using System.Security.Claims;

namespace OrdersAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController(
        IUserRepository userRepository,
        ILogger<UserController> logger) : ControllerBase
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly ILogger<UserController> _logger = logger;

        [HttpGet("{id}")]
        [ApiExplorerSettings(GroupName = "v1")]
        [ProducesResponseType(200, Type = typeof(UserResponseDto))]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<UserResponseDto>> GetUser(Guid id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId != id.ToString())
                {
                    return Unauthorized(new { message = "Você não tem permissão para acessar estes dados" });
                }

                var user = await _userRepository.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "Usuário não encontrado" });
                }

                return Ok(new UserResponseDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    ProfilePhoto = user.ProfilePhoto
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar usuário com ID: {UserId}", id);
                return StatusCode(500, new { message = "Erro ao processar a solicitação" });
            }
        }
    }
} 