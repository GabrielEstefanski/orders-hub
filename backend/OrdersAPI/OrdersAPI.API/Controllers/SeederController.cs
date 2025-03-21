using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace OrdersAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SeederController(DatabaseSeeder seeder) : ControllerBase
    {
        private readonly DatabaseSeeder _seeder = seeder;

        [HttpPost("seed-orders")]
        public async Task<IActionResult> SeedOrders([FromQuery] int quantity = 1000)
        {
            await _seeder.SeedMockDataAsync(quantity);
            return Ok(new { message = $"Foram inseridos {quantity} pedidos no banco." });
        }
    }

}
