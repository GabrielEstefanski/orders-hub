import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatNumber } from "../../utils/formatters/number";
import { formatTime } from "../../utils/formatters/time";
import ChartCard from "./ChartData";
import CustomTooltip from "../dashboard/CustomTooltip";

interface PerformanceMetricsProps {
  performance: {
    throughputPerMinute: number;
    errorRate: number;
    serviceLevel: number;
    resourceSaturation: number;
    p95LatencySeconds?: number;
    slaCompliancePercentage?: number;
    responseTimesByEndpoint?: {
      overall: {
        p95: number;
        sla: number;
      },
      endpoints: Array<{
        endpoint: string;
        p95: number;
        sla: number;
      }>
    };
  };
  historicalData: any[];
  isDarkMode: boolean;
  title?: string;
  compact?: boolean;
  className?: string;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  performance,
  historicalData,
  isDarkMode,
  title = "Performance Geral",
  compact = false,
  className = ""
}) => {
  return (
    <ChartCard
      title={title}
      icon="fas fa-chart-line"
      subtitle="Indicadores principais de performance"
      delay={0.4}
      className={className}
    >
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">SLA</div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {(performance.responseTimesByEndpoint?.overall?.sla ?? 0).toFixed(2)}%
            </span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-green-500 h-2 rounded-full"
                style={{ width: `${(performance.responseTimesByEndpoint?.overall?.sla ?? 0)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Throughput</div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(performance.throughputPerMinute)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              req/min
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Taxa de Erro</div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {performance.errorRate.toFixed(2)}%
            </span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-500 to-amber-500 h-2 rounded-full"
                style={{ width: `${Math.min(performance.errorRate * 5, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {performance.p95LatencySeconds !== undefined && (
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">Latência P95</div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(performance.p95LatencySeconds)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Tendências de Performance
        </h3>
        <ResponsiveContainer width="100%" height={compact ? 150 : 200}>
          <LineChart data={historicalData}>
            <XAxis 
              dataKey="timestamp" 
              stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
              fontSize={12}
              tickFormatter={(value) => {
                if (typeof value === 'string') {
                  return value.split(' ')[1] || value;
                }
                return value;
              }}
            />

            <YAxis
              stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
              fontSize={12}
              tickFormatter={(value) => value.toFixed(0)}
            />
            <Tooltip 
              content={
                <CustomTooltip 
                  dataFormatter={(payload) => ({
                    label: "Performance",
                    value: payload.performance.responseTimesByEndpoint.overall.sla,
                    color: "#10B981",
                    suffix: "%",
                    formatter: (value) => (Number(value)).toFixed(2),
                    subtitle: `SLA: ${(payload.errorRate || 0).toFixed(2)}%`
                  })}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="performance.responseTimesByEndpoint.overall.sla"
              name="SLA"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="performance.errorRate"
              name="Taxa de Erro"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="performance.p95LatencySeconds"
              name="P95 Latência"
              stroke="#6366F1"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {!compact && performance.responseTimesByEndpoint?.endpoints?.length && performance.responseTimesByEndpoint?.endpoints?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Performance por Endpoint
          </h3>
          <div className="overflow-x-auto max-h-40 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="sticky top-0 bg-white dark:bg-gray-800">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Endpoint
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    P95
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    SLA
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {performance.responseTimesByEndpoint?.endpoints?.slice(0, 4).map((ep, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-xs text-gray-900 dark:text-gray-200 truncate max-w-[150px]">
                      {ep.endpoint}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-900 dark:text-gray-200">
                      {formatTime(ep.p95)}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-900 dark:text-gray-200">
                      {ep.sla.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ChartCard>
  );
};

export default PerformanceMetrics;