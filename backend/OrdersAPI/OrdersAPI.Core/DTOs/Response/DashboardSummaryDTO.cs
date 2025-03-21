namespace OrdersAPI.Core.DTOs.Response
{
    public class DashboardSummaryDto
    {
        public int TotalOrders { get; set; }
        public int PreviousTotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal PreviousTotalRevenue { get; set; }
        public decimal AverageOrderValue { get; set; }
        public decimal PreviousAverageOrderValue { get; set; }
        public int TotalCustomers { get; set; }
        public int PreviousTotalCustomers { get; set; }
        public decimal OrderCompletionRate { get; set; }
        public decimal PreviousOrderCompletionRate { get; set; }
        public required List<OrdersByStatusDto> OrdersByStatus { get; set; }
        public required List<OrdersByDateDto> OrdersByDate { get; set; }
        public required List<RevenueByDateDto> RevenueByDate { get; set; }
        public required List<TopProductDto> TopProducts { get; set; }
        public required List<CustomerDistributionDto> CustomerDistribution { get; set; }
        public required List<AverageOrderValueByDateDto> AverageOrderValueByDate { get; set; }
    }

    public class OrdersByStatusDto
    {
        public required string Status { get; set; }
        public int Total { get; set; }
    }

    public class OrdersByDateDto
    {
        public required string Date { get; set; }
        public int Total { get; set; }
    }

    public class RevenueByDateDto
    {
        public required string Date { get; set; }
        public decimal TotalProfit { get; set; }
    }

    public class TopProductDto
    {
        public required string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class CustomerDistributionDto
    {
        public required string Region { get; set; }
        public int Total { get; set; }
        public required string CustomerName { get; set; }
    }

    public class AverageOrderValueByDateDto
    {
        public required string Date { get; set; }
        public decimal TotalProfit { get; set; }
    }
}
