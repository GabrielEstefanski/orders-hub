using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrdersAPI.Application.Interfaces;
using OrdersAPI.Core.DTOs.Response;
using OrdersAPI.Core.Interfaces;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class DashboardController(
    IDashboardService dashboardService,
    ICacheService cacheService,
    ILogger<DashboardController> logger) : ControllerBase
{
    private readonly IDashboardService _dashboardService = dashboardService;
    private readonly ICacheService _cacheService = cacheService;
    private readonly ILogger<DashboardController> _logger = logger;
    private const string DASHBOARD_CACHE_PREFIX = "dashboard:summary:";
    private readonly TimeSpan CACHE_DURATION = TimeSpan.FromMinutes(30);

    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetDashboardSummary(string filter)
    {
        try
        {
            var cacheKey = $"{DASHBOARD_CACHE_PREFIX}{filter.ToLower()}";

            var cachedData = await _cacheService.GetCacheDataAsync<DashboardSummaryDto>(cacheKey);
            if (cachedData != null)
            {
                _logger.LogInformation("Retornando dados do dashboard do cache para o filtro: {Filter}", filter);
                return Ok(cachedData);
            }

            var dashboardSummary = await _dashboardService.GetDashboardSummaryAsync(filter);
            
            await _cacheService.SetCacheDataAsync(cacheKey, dashboardSummary, CACHE_DURATION);
            _logger.LogInformation("Dados do dashboard atualizados no cache para o filtro: {Filter}", filter);

            return Ok(dashboardSummary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao carregar os dados do dashboard para o filtro: {Filter}", filter);
            return StatusCode(500, new { error = "Erro ao carregar os dados do dashboard", details = ex.Message });
        }
    }

    [HttpPost("clear-cache")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ClearDashboardCache()
    {
        try
        {
            await _cacheService.InvalidateByPatternAsync(DASHBOARD_CACHE_PREFIX);
            _logger.LogInformation("Cache do dashboard limpo com sucesso");
            return Ok(new { message = "Cache do dashboard limpo com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao limpar o cache do dashboard");
            return StatusCode(500, new { error = "Erro ao limpar o cache do dashboard", details = ex.Message });
        }
    }
}
