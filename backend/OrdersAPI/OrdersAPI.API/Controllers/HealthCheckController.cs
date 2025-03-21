using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Text;
using OrdersAPI.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace OrdersAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthCheckController(
        HealthCheckService healthCheckService,
        ICacheService cacheService,
        ILogger<HealthCheckController> logger) : ControllerBase
    {
        private readonly HealthCheckService _healthCheckService = healthCheckService;
        private readonly ICacheService _cacheService = cacheService;
        private readonly ILogger<HealthCheckController> _logger = logger;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var report = await _healthCheckService.CheckHealthAsync();
            
            var response = new
            {
                Status = report.Status.ToString(),
                Duration = report.TotalDuration,
                Components = report.Entries.Select(e => new
                {
                    Key = e.Key,
                    Status = e.Value.Status.ToString(),
                    Description = e.Value.Description,
                    Duration = e.Value.Duration
                })
            };

            return report.Status == HealthStatus.Healthy 
                ? Ok(response) 
                : StatusCode(503, response);
        }

        [HttpGet("redis")]
        public async Task<IActionResult> GetRedisStatus()
        {
            try
            {
                var testKey = "health:test:" + Guid.NewGuid().ToString();
                await _cacheService.SetCacheDataAsync(testKey, "OK", TimeSpan.FromSeconds(5));
                var result = await _cacheService.GetCacheDataAsync<string>(testKey);
                
                return result == "OK" 
                    ? Ok(new { Status = "Healthy", Message = "Redis está funcionando corretamente" }) 
                    : StatusCode(503, new { Status = "Unhealthy", Message = "Redis não está respondendo corretamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao verificar status do Redis");
                return StatusCode(503, new { Status = "Unhealthy", Message = $"Erro ao verificar Redis: {ex.Message}" });
            }
        }

        [HttpGet("metrics")]
        public IActionResult GetMetrics()
        {
            var metrics = new StringBuilder();
            metrics.AppendLine("# HELP api_health API health status");
            metrics.AppendLine("# TYPE api_health gauge");
            metrics.AppendLine("api_health 1");
            
            return Content(metrics.ToString(), "text/plain");
        }
    }
} 