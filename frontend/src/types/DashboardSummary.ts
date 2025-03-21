interface DashboardSummary {
    totalOrders: number;
    previousTotalOrders: number;
    totalRevenue: number;
    previousTotalRevenue: number;
    averageOrderValue: number;
    previousAverageOrderValue: number;
    totalCustomers: number;
    orderCompletionRate: number;
    previousTotalCustomers: number;
    ordersByStatus: Array<{
        status: string;
        total: number;
    }>;
    ordersByDate: Array<{
        date: string;
        total: number;
    }>;
    revenueByDate: Array<{
        date: string;
        totalProfit: number;
    }>;
    topProducts: Array<{
        productName: string;
        quantity: number;
        totalRevenue: number;
    }>;
    customerDistribution: Array<{
        region: string;
        total: number;
        customerName: string;
    }>;
    averageOrderValueByDate: Array<{
        date: string;
        totalProfit: number;
    }>;
}

export default DashboardSummary;