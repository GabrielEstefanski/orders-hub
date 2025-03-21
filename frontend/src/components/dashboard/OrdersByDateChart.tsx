import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import formatNumber from '../../utils/formatNumber';
import CustomTooltip from './CustomTooltip';
import { useTheme } from '../../context/ThemeProvider';

interface OrdersByDateChartProps {
  data: Array<{
    date: string;
    total: number;
  }>;
  loading?: boolean;
}

const OrdersByDateChart = ({ data = [], loading = false }: OrdersByDateChartProps) => {
  const { isDarkMode } = useTheme();
  
  if (loading) {
    return (
      <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-700/20 rounded-lg animate-pulse flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  const formatTooltipData = (payload: any) => ({
    label: payload.date,
    value: payload.total,
    subtitle: 'Pedidos',
    color: '#3B82F6'
  });

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <filter id="blueShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#3B82F6" floodOpacity="0.2"/>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(107, 114, 128, 0.2)' : '#E5E7EB'} />
          <XAxis 
            dataKey="date" 
            stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
            tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563', fontSize: 12 }}
            interval="preserveStartEnd"
            minTickGap={30}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
            tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563', fontSize: 12 }}
            tickFormatter={(value) => formatNumber(value)}
            width={40}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip dataFormatter={formatTooltipData} />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#3B82F6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#ordersGradient)"
            dot={false}
            activeDot={{
              r: 7,
              stroke: '#3B82F6',
              strokeWidth: 2,
              fill: '#FFFFFF',
              filter: 'url(#blueShadow)'
            }}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersByDateChart;
