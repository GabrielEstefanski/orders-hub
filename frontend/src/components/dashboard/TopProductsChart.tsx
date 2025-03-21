import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeProvider';
import CustomTooltip from './CustomTooltip';
import { formatNumber } from '../../utils/formatters/number';

interface TopProductsChartProps {
  data: Array<{
    productName: string;
    quantity: number;
    totalRevenue: number;
  }>;
  loading: boolean;
}

const TopProductsChart = ({ data = [], loading = false }: TopProductsChartProps) => {
  const { isDarkMode } = useTheme();

  const formatTooltipData = (payload: any) => {
    if (!payload) return { label: '', value: 0, prefix: 'R$ ', subtitle: '0 unidades vendidas' };
    
    return {
      label: payload.productName || 'Produto sem nome',
      value: payload.quantity || 0,
      subtitle: 'Unidades vendidas'
    };
  };

  if (loading) {
    return (
      <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-700/20 rounded-lg animate-pulse flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item.productName.length > 15 ? item.productName.substring(0, 15) + '...' : item.productName,
    productName: item.productName,
    total: item.totalRevenue,
    quantity: item.quantity
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#818CF8" stopOpacity={0.4}/>
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
          <Tooltip content={<CustomTooltip dataFormatter={formatTooltipData} />} />
          <Bar 
            dataKey="total" 
            fill="url(#colorTotal)"
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

export default TopProductsChart;
