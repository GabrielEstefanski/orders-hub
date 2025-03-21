import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import CustomTooltip from './CustomTooltip';
import { useTheme } from '../../context/ThemeProvider';

interface StatusChartProps {
  data: Array<{
    status: string;
    total: number;
    percentage: number;
  }>;
  loading?: boolean;
}

const colors = {
  'Pendente': '#F59E0B',
  'Processando': '#3B82F6',
  'Finalizado': '#10B981'
};

const RADIAN = Math.PI / 180;

const StatusChart = ({ data = [], loading = false }: StatusChartProps) => {
  const { isDarkMode } = useTheme();

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium"
        stroke={isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}
        strokeWidth={0.5}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const formatTooltipData = (payload: any) => ({
    label: payload.status,
    value: payload.total,
    color: colors[payload.status as keyof typeof colors],
    suffix: ' pedidos',
    subtitle: `${payload.percentage.toFixed(1)}% do total`
  });

  if (loading) {
    return (
      <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-700/20 rounded-lg animate-pulse flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-[370px] w-full">
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <defs>
            {Object.entries(colors).map(([status, color]) => (
              <linearGradient key={status} id={`color${status}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            dataKey="total"
            stroke={isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.5)'}
            strokeWidth={2}
            animationDuration={1500}
            animationBegin={300}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#color${entry.status})`}
                className="transition-all duration-300 hover:opacity-80 drop-shadow-md"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip dataFormatter={formatTooltipData} />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-2 mt-2 px-4">
        {data.map((entry, index) => (
          <motion.div 
            key={entry.status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center gap-2 text-sm"
          >
            <div 
              className="w-4 h-4 rounded-full shadow-md transition-all duration-300 hover:scale-110" 
              style={{ backgroundColor: colors[entry.status as keyof typeof colors] }}
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {entry.status} <span className="text-gray-500 dark:text-gray-400 font-normal">({entry.percentage.toFixed(1)}%)</span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatusChart;
