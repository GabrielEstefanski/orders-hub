import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import CustomTooltip from "../dashboard/CustomTooltip";
import ChartCard from "./ChartData";
import { formatNumber } from "../../utils/formatters/number";
import { MetricsData } from "../../services/metrics";

interface ResourceUsageChartProps {
    data: MetricsData[];
    isDarkMode: boolean;
    className?: string;
}

const ResourceUsageChart: React.FC<ResourceUsageChartProps> = ({ data, isDarkMode, className = "" }) => {
  const latestMetrics = data[data.length - 1] || {};
  
  return (
    <ChartCard 
      title="Recursos do Sistema" 
      icon="fas fa-microchip" 
      subtitle="Monitoramento de recursos do sistema"
      delay={0.5}
      className={className}
    >
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">CPU</div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {(latestMetrics?.systemResources?.cpuUsage || 0).toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Memória</div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(latestMetrics?.systemResources?.memoryUsageMB || 0)} MB
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Threads</div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(latestMetrics?.systemResources?.threadCount || 0)}
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Handles</div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(latestMetrics?.systemResources?.handleCount || 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">Saturação de Recursos</div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-green-500 to-red-500 h-4 rounded-full transition-all duration-300"
            style={{ 
              width: `${latestMetrics?.performance?.resourceSaturation || 0}%`,
            }}
          ></div>
        </div>
        <div className="mt-1 text-right">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {(latestMetrics?.performance?.resourceSaturation || 0).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">Service Level</div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-red-500 to-green-500 h-4 rounded-full transition-all duration-300"
            style={{ 
              width: `${latestMetrics?.performance?.serviceLevel || 0}%`,
            }}
          ></div>
        </div>
        <div className="mt-1 text-right">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {(latestMetrics?.performance?.serviceLevel || 0).toFixed(2)}%
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EC4899" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDarkMode ? 'rgba(107, 114, 128, 0.15)' : 'rgba(107, 114, 128, 0.15)'}
            vertical={false}
          />
          <XAxis 
            dataKey="timestamp"
            stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value.toFixed(0)}`}
          />
          <Tooltip 
            content={
              <CustomTooltip 
                dataFormatter={(payload) => ({
                  label: "Recursos do Sistema",
                  value: payload.systemResources?.cpuUsage,
                  formatter: (value) => Number(value).toFixed(2),
                  color: "#6366F1",
                  suffix: "%",
                  subtitle: `Memória: ${formatNumber(payload.systemResources?.memoryUsageMB || 0)} MB`
                })}
              />
            } 
          />
          <Area
            type="monotone"
            dataKey="systemResources.cpuUsage"
            name="CPU"
            stroke="#6366F1"
            fill="url(#cpuGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="systemResources.memoryUsageMB"
            name="Memória"
            stroke="#EC4899"
            fill="url(#memoryGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default ResourceUsageChart;