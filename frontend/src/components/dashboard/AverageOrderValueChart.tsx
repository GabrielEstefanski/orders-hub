import { memo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import formatNumber from '../../utils/formatNumber';
import CustomTooltip from './CustomTooltip';
import { useTheme } from '../../context/ThemeProvider';

interface AverageOrderValueChartProps {
  data: Array<{
    date: string;
    totalProfit: number;
  }>;
  loading?: boolean;
}

const AverageOrderValueChart = memo(({ data, loading = false }: AverageOrderValueChartProps) => {
  const { isDarkMode } = useTheme();
  
  if (loading) {
    return (
      <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-700/20 rounded-lg animate-pulse flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  const formatTooltipData = (payload: any) => {
    if (!payload) return { label: '', value: 0, prefix: 'R$ ', subtitle: 'Ticket médio' };
    
    return {
      label: payload.date,
      value: payload.averageValue.toFixed(2),
      prefix: 'R$ ',
      subtitle: 'Ticket médio'  
    };
  };

  const chartData = data.map(item => ({
    date: item.date,
    averageValue: item.totalProfit
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="averageValueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
            </linearGradient>
            <filter id="purpleShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#8B5CF6" floodOpacity="0.2"/>
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
            width={60}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip dataFormatter={formatTooltipData} />} />
          <Area
            type="monotone"
            dataKey="averageValue"
            stroke="#8B5CF6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#averageValueGradient)"
            dot={false}
            activeDot={{
              r: 7,
              stroke: '#8B5CF6',
              strokeWidth: 2,
              fill: '#FFFFFF',
              filter: 'url(#purpleShadow)'
            }}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

AverageOrderValueChart.displayName = 'AverageOrderValueChart';
export default AverageOrderValueChart; 