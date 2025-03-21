using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrdersAPI.Application.Interfaces;
using OrdersAPI.Core.Entities;
using System.Diagnostics;

namespace OrdersAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController(IOrderService orderService) : ControllerBase
    {
        private readonly IOrderService _orderService = orderService;

        [HttpGet]
        [ApiExplorerSettings(GroupName = "v1")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Order>))]
        [ProducesResponseType(500)]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders(
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? sortBy = "dataCriacao",
            [FromQuery] bool descending = false)
        {
            var stopwatch = Stopwatch.StartNew();
            try 
            {
                var orders = await _orderService.GetOrdersAsync(searchTerm, sortBy, descending);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet("{id}")]
        [ApiExplorerSettings(GroupName = "v1")]
        [ProducesResponseType(200, Type = typeof(Order))]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<Order>> GetOrder(Guid id)
        {
            var stopwatch = Stopwatch.StartNew();
            try
            {
                var order = await _orderService.GetOrderByIdAsync(id);
                if (order == null)
                {
                    return NotFound();
                }

                return Ok(order);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        [ApiExplorerSettings(GroupName = "v1")]
        [ProducesResponseType(201, Type = typeof(Order))]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] Order order)
        {
            var stopwatch = Stopwatch.StartNew();
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdOrder = await _orderService.CreateOrderAsync(order, User.Identity?.Name ?? "System");

                return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.Id }, createdOrder);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPut("{id}")]
        [ApiExplorerSettings(GroupName = "v1")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<Order>> UpdateOrder([FromBody] Order order)
        {
            var updatedOrder = await _orderService.UpdateOrderAsync(order, User.Identity?.Name ?? "System");
            return updatedOrder!;
        }

        [HttpDelete("{id}")]
        [ApiExplorerSettings(GroupName = "v1")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<ActionResult> DeleteOrder(Guid id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            await _orderService.DeleteOrderAsync(id);
            return NoContent();
        }

        [HttpGet("{id}/history")]
        [ApiExplorerSettings(GroupName = "v1")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<OrderHistory>))]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<IEnumerable<OrderHistory>>> GetOrderHistory(Guid id)
        {
            try
            {
                var history = await _orderService.GetOrderHistoryAsync(id);
                return Ok(history);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro ao buscar histórico do pedido");
            }
        }
    }
}
