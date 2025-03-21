using OrdersAPI.Core.DTOs.Response;

namespace OrdersAPI.Application.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardSummaryDto> GetDashboardSummaryAsync(string filter);
    }

}
