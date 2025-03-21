import { api } from "./api";

export interface DashboardSummaryDto {
  totalOrders: number;
  totalProfit: number;
  averageProfit: number;
  totalOrdersByStatus: Array<{
    status: string;
    total: number;
    percentage: number;
  }>;
  totalOrdersByDate: Array<{
    date: string;
    total: number;
  }>;
  profitByDate: Array<{
    date: string;
    totalProfit: number;
  }>;
  ordersPerCustomer: Record<string, number>;
  averageOrderValue: number;
  topProducts: Array<{
    product: string;
    total: number;
    totalValue: number;
  }>;
  orderCompletionRate: number;
  totalOrdersPreviousDate: number;
  totalProfitPreviousDate: number;
  averageProfitPreviousDate: number;
}

export const getDashboardData = async (filter: string): Promise<DashboardSummaryDto> => {
  const response = await api.get<DashboardSummaryDto>(`/dashboard/summary?filter=${filter}`);
  return response.data;
};

export const clearDashboardCache = async (): Promise<void> => {
  await api.post('/api/dashboard/clear-cache');
}; 