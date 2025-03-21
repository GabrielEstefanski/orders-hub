import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import formatNumber from '../../utils/formatNumber';
import { useTheme } from '../../context/ThemeProvider';
import CustomTooltip from './CustomTooltip';

interface CustomerDistributionChartProps {
  data: Array<{
    customerName: string;
    total: number;
  }>;
  loading?: boolean;
}

const CustomerDistributionChart = ({ data = [], loading = false }: CustomerDistributionChartProps) => {
  const { isDarkMode } = useTheme();

  const formatTooltipData = (payload: any) => ({
    label: payload.customerName,
    value: payload.total,
    subtitle: 'Pedidos'
  });

  if (loading) {
    return (
      <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-700/20 rounded-lg animate-pulse flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item.customerName.length > 15 ? item.customerName.substring(0, 15) + '...' : item.customerName,
    customerName: item.customerName,
    total: item.total
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EC4899" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#F472B6" stopOpacity={0.4}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDarkMode ? 'rgba(107, 114, 128, 0.2)' : '#E5E7EB'}
            vertical={false}
          />
          <XAxis 
            dataKey="name" 
            stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            interval={0}
            tick={{
              fill: isDarkMode ? '#D1D5DB' : '#4B5563',
              fontSize: 11
            }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatNumber(value)}
            tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }}
          />
          <Tooltip content={<CustomTooltip dataFormatter={formatTooltipData} />}/>
          <Bar 
            dataKey="total" 
            fill="url(#customerGradient)"
            radius={[8, 8, 0, 0]}
            maxBarSize={50}
            className="transition-all duration-300 hover:opacity-80"
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerDistributionChart;