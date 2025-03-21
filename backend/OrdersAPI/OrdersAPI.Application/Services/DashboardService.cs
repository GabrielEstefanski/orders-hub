using OrdersAPI.Application.Interfaces;
using OrdersAPI.Core.DTOs.Response;
using OrdersAPI.Core.Entities;
using OrdersAPI.Core.Enums;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

public class DashboardService(IOrderService orderService) : IDashboardService
{
    private readonly IOrderService _orderService = orderService;

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync(string filter)
    {
        var orders = await _orderService.GetOrdersAsync(null, "DataCriacao", false);
        
        if (!orders.Any())
        {
            return new DashboardSummaryDto
            {
                TotalOrders = 0,
                PreviousTotalOrders = 0,
                TotalRevenue = 0,
                PreviousTotalRevenue = 0,
                AverageOrderValue = 0,
                PreviousAverageOrderValue = 0,
                TotalCustomers = 0,
                PreviousTotalCustomers = 0,
                OrderCompletionRate = 0,
                PreviousOrderCompletionRate = 0,
                OrdersByStatus = [],
                OrdersByDate = [],
                RevenueByDate = [],
                TopProducts = [],
                CustomerDistribution = [],
                AverageOrderValueByDate = []
            };
        }

        DateTime minOrderDate = filter.Equals("TUDO", StringComparison.InvariantCultureIgnoreCase)
            ? orders.Min(o => o.DataCriacao) 
            : DateTime.UtcNow;

        var (currentStartDate, currentEndDate) = GetDateRange(filter, DateTime.UtcNow, minOrderDate);
        var filteredOrders = orders.Where(o => o.DataCriacao >= currentStartDate && o.DataCriacao <= currentEndDate).ToList();

        var previousReferenceDate = filter.ToUpperInvariant() switch
        {
            "DIA" => currentStartDate.AddDays(-1),
            "MES" => currentStartDate.AddMonths(-1),
            "ANO" => currentStartDate.AddYears(-1),
            _ => currentStartDate.AddYears(-1)
        };
        
        var (previousStartDate, previousEndDate) = GetDateRange(filter, previousReferenceDate, minOrderDate);
        var previousOrders = orders.Where(o => o.DataCriacao >= previousStartDate && o.DataCriacao <= previousEndDate).ToList();

        var previousOrdersByStatus = GetOrdersByStatus(previousOrders);
        var previousOrdersByDate = GetOrdersByDate(previousOrders, filter, filter);
        var previousRevenueByDate = GetRevenueByDate(previousOrders, filter, filter);
        var previousCustomerDistribution = GetCustomerDistribution(previousOrders);
        var previousTopProducts = GetTopProducts(previousOrders);
        var previousAverageOrderValueByDate = GetAverageOrderValueByDate(previousOrders, filter, filter);
        var previousOrderCompletionRate = GetOrderCompletionRate(previousOrders);

        string dateFormat = filter.ToUpperInvariant() switch
        {
            "DIA" => "HH:mm",
            "MES" => "yyyy-MM-dd",
            "ANO" => "yyyy-MM",
            _ => DetermineOptimalDateFormat(filteredOrders)
        };

        return new DashboardSummaryDto
        {
            TotalOrders = filteredOrders.Count,
            PreviousTotalOrders = previousOrders.Count,
            TotalRevenue = filteredOrders.Sum(o => o.Valor),
            PreviousTotalRevenue = previousOrders.Sum(o => o.Valor),
            AverageOrderValue = filteredOrders.Count != 0 ? filteredOrders.Average(o => o.Valor) : 0m,
            PreviousAverageOrderValue = previousOrders.Count != 0 ? previousOrders.Average(o => o.Valor) : 0m,
            TotalCustomers = filteredOrders.Select(o => o.Cliente).Distinct().Count(),
            PreviousTotalCustomers = previousOrders.Select(o => o.Cliente).Distinct().Count(),
            OrdersByStatus = GetOrdersByStatus(filteredOrders),
            OrdersByDate = GetOrdersByDate(filteredOrders, dateFormat, filter),
            RevenueByDate = GetRevenueByDate(filteredOrders, dateFormat, filter),
            TopProducts = GetTopProducts(filteredOrders),
            CustomerDistribution = GetCustomerDistribution(filteredOrders),
            AverageOrderValueByDate = GetAverageOrderValueByDate(filteredOrders, dateFormat, filter),
            OrderCompletionRate = GetOrderCompletionRate(filteredOrders),
            PreviousOrderCompletionRate = previousOrderCompletionRate
        };
    }

    private static (DateTime startDate, DateTime endDate) GetDateRange(string filter, DateTime referenceDate, DateTime minOrderDate)
    {
        var currentDateTime = DateTime.UtcNow;
        
        return filter.ToUpperInvariant() switch
        {
            "DIA" => (
                new DateTime(referenceDate.Year, referenceDate.Month, referenceDate.Day, 0, 0, 0, DateTimeKind.Utc),
                new DateTime(
                    referenceDate.Year,
                    referenceDate.Month,
                    referenceDate.Day,
                    Math.Min(23, currentDateTime.Hour),
                    currentDateTime.Hour == DateTime.UtcNow.Hour ? currentDateTime.Minute : 59,
                    currentDateTime.Hour == DateTime.UtcNow.Hour ? currentDateTime.Second : 59,
                    DateTimeKind.Utc
                )
            ),
            "MES" => (
                new DateTime(referenceDate.Year, referenceDate.Month, 1, 0, 0, 0, DateTimeKind.Utc),
                new DateTime(
                    referenceDate.Year,
                    referenceDate.Month,
                    Math.Min(
                        DateTime.DaysInMonth(referenceDate.Year, referenceDate.Month),
                        referenceDate.Month == currentDateTime.Month ? currentDateTime.Day : DateTime.DaysInMonth(referenceDate.Year, referenceDate.Month)
                    ),
                    23, 59, 59,
                    DateTimeKind.Utc
                )
            ),
            "ANO" => (
                new DateTime(referenceDate.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                new DateTime(
                    referenceDate.Year,
                    referenceDate.Year == currentDateTime.Year ? currentDateTime.Month : 12,
                    referenceDate.Year == currentDateTime.Year && referenceDate.Month == currentDateTime.Month ? currentDateTime.Day : DateTime.DaysInMonth(referenceDate.Year, currentDateTime.Month),
                    23, 59, 59,
                    DateTimeKind.Utc
                )
            ),
            _ => (
                minOrderDate,
                currentDateTime
            )
        };
    }

    private static List<OrdersByStatusDto> GetOrdersByStatus(IEnumerable<Order> orders)
    {
        if (!orders.Any()) return [];

        return [.. orders
            .GroupBy(o => o.Status)
            .Select(g => new OrdersByStatusDto
            {
                Status = GetStatusDisplayName(g.Key),
                Total = g.Count(),
            })
            .OrderByDescending(x => x.Total)];
    }

    private static string GetStatusDisplayName(OrderStatusEnum status)
    {
        return status.GetType()
            .GetMember(status.ToString())
            .FirstOrDefault()?
            .GetCustomAttribute<DisplayAttribute>()
            ?.Name ?? status.ToString();
    }

    private static List<OrdersByDateDto> GetOrdersByDate(IEnumerable<Order> orders, string dateFormat, string filter)
    {
        if (!orders.Any()) return [];

        var groupingFunc = GetGroupingFunction(filter);
        
        var groupedOrders = orders
            .GroupBy(o => groupingFunc(o.DataCriacao))
            .Select(g => new OrdersByDateDto
            {
                Date = g.Key,
                Total = g.Count()
            })
            .ToDictionary(x => x.Date, x => x.Total);

        var allPeriods = GetAllPeriods(orders, dateFormat, filter);

        return [.. allPeriods.Select(period => new OrdersByDateDto
        {
            Date = period,
            Total = groupedOrders.TryGetValue(period, out var total) ? total : 0
        }).OrderBy(dto => dto.Date)];
    }

    private static List<RevenueByDateDto> GetRevenueByDate(IEnumerable<Order> orders, string dateFormat, string filter)
    {
        if (!orders.Any()) return [];

        var groupingFunc = GetGroupingFunction(filter);
        
        var groupedProfit = orders
            .GroupBy(o => groupingFunc(o.DataCriacao))
            .Select(g => new RevenueByDateDto
            {
                Date = g.Key,
                TotalProfit = g.Sum(o => o.Valor)
            })
            .ToDictionary(x => x.Date, x => x.TotalProfit);

        var allPeriods = GetAllPeriods(orders, dateFormat, filter);

        return [.. allPeriods.Select(period => new RevenueByDateDto
        {
            Date = period,
            TotalProfit = groupedProfit.TryGetValue(period, out var total) ? total : 0
        }).OrderBy(dto => dto.Date)];
    }

    private static List<CustomerDistributionDto> GetCustomerDistribution(IEnumerable<Order> orders)
    {
        if (!orders.Any()) return [];

        return [.. orders
            .GroupBy(o => o.Cliente)
            .Select(g => new CustomerDistributionDto
            {
                Region = g.Key,
                Total = g.Count(),
                CustomerName = g.Key
            })];
    }

    private static List<TopProductDto> GetTopProducts(IEnumerable<Order> orders)
    {
        if (!orders.Any()) return new List<TopProductDto>();

        return [.. orders
            .GroupBy(o => o.Produto)
            .Select(g => new TopProductDto
            {
                ProductName = g.Key,
                Quantity = g.Count(),
                TotalRevenue = g.Sum(o => o.Valor)
            })
            .OrderByDescending(g => g.TotalRevenue)
            .Take(5)];
    }

    private static decimal GetOrderCompletionRate(IEnumerable<Order> orders)
    {
        if (!orders.Any()) return 0m;
        return orders.Count(o => o.Status == OrderStatusEnum.Finalizado) / (decimal)orders.Count() * 100;
    }

    private static List<string> GetAllPeriods(IEnumerable<Order> orders, string dateFormat, string filter)
    {
        if (!orders.Any()) return [];

        var minDate = orders.Min(o => o.DataCriacao);
        var maxDate = orders.Max(o => o.DataCriacao);
        var currentDateTime = DateTime.UtcNow;
        
        maxDate = maxDate > currentDateTime ? currentDateTime : maxDate;
        
        var allPeriods = new List<string>();

        switch (filter.ToUpperInvariant())
        {
            case "DIA":
                var startHour = new DateTime(minDate.Year, minDate.Month, minDate.Day, 0, 0, 0);
                var endHour = new DateTime(maxDate.Year, maxDate.Month, maxDate.Day, 23, 59, 59);
                
                for (var date = startHour; date <= endHour; date = date.AddHours(1))
                {
                    allPeriods.Add(date.ToString("HH:00"));
                }
                break;

            case "MES":
                for (var date = new DateTime(minDate.Year, minDate.Month, 1);
                     date <= maxDate;
                     date = date.AddDays(1))
                {
                    allPeriods.Add(date.ToString(dateFormat));
                }
                break;

            case "ANO":
                for (var date = new DateTime(minDate.Year, 1, 1);
                     date <= maxDate;
                     date = date.AddMonths(1))
                {
                    allPeriods.Add(date.ToString(dateFormat));
                }
                break;

            default:
                TimeSpan totalSpan = maxDate - minDate;
                
                if (totalSpan.TotalDays <= 1)
                {
                    var startTime = minDate.Date.AddHours(minDate.Hour);
                    var endTime = maxDate.Date.AddHours(maxDate.Hour);
                    
                    for (var date = startTime; date <= endTime; date = date.AddHours(1))
                    {
                        allPeriods.Add(date.ToString("HH:00"));
                    }
                }
                else if (totalSpan.TotalDays <= 30)
                {
                    for (var date = minDate.Date; date <= maxDate.Date; date = date.AddDays(1))
                    {
                        allPeriods.Add(date.ToString("yyyy-MM-dd"));
                    }
                }
                else if (totalSpan.TotalDays <= 365)
                {
                    for (var date = new DateTime(minDate.Year, minDate.Month, 1);
                         date <= new DateTime(maxDate.Year, maxDate.Month, 1);
                         date = date.AddMonths(1))
                    {
                        allPeriods.Add(date.ToString("yyyy-MM"));
                    }
                }
                else
                {
                    for (var year = minDate.Year; year <= maxDate.Year; year++)
                    {
                        allPeriods.Add(year.ToString());
                    }
                }
                break;
        }

        return allPeriods;
    }

    private static List<AverageOrderValueByDateDto> GetAverageOrderValueByDate(IEnumerable<Order> orders, string dateFormat, string filter)
    {
        if (!orders.Any()) return [];

        var groupingFunc = GetGroupingFunction(filter);
        
        var groupedAverage = orders
            .GroupBy(o => groupingFunc(o.DataCriacao))
            .Select(g => new AverageOrderValueByDateDto
            {
                Date = g.Key,
                TotalProfit = g.Average(o => o.Valor)
            })
            .ToDictionary(x => x.Date, x => x.TotalProfit);

        var allPeriods = GetAllPeriods(orders, dateFormat, filter);

        return [.. allPeriods.Select(period => new AverageOrderValueByDateDto
        {
            Date = period,
            TotalProfit = groupedAverage.TryGetValue(period, out var avg) ? avg : 0
        }).OrderBy(dto => dto.Date)];
    }

    private static string DetermineOptimalDateFormat(IEnumerable<Order> orders)
    {
        if (!orders.Any()) return "yyyy-MM-dd";
        
        var minDate = orders.Min(o => o.DataCriacao);
        var maxDate = orders.Max(o => o.DataCriacao);
        var totalDays = (maxDate - minDate).TotalDays;
        
        if (totalDays <= 1) return "HH:mm";
        if (totalDays <= 31) return "yyyy-MM-dd";
        if (totalDays <= 366) return "yyyy-MM";
        return "yyyy";
    }

    private static Func<DateTime, string> GetGroupingFunction(string filter)
    {
        return filter.ToUpperInvariant() switch
        {
            "DIA" => (date) => date.ToString("HH:00"),
            "MES" => (date) => date.ToString("yyyy-MM-dd"),
            "ANO" => (date) => date.ToString("yyyy-MM"),
            _ => (date) => 
            {
                var totalDays = (DateTime.UtcNow - date).TotalDays;
                return totalDays switch
                {
                    <= 1 => date.ToString("HH:00"),
                    <= 30 => date.ToString("yyyy-MM-dd"),
                    <= 365 => date.ToString("yyyy-MM"),
                    _ => date.ToString("yyyy")
                };
            }
        };
    }
}
