import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "./ChartData";
import { MetricsData } from "../../services/metrics";
import { formatNumber } from "../../utils/formatters/number";
import CustomTooltip from "../dashboard/CustomTooltip";

interface DatabaseMetricsProps {
  database: MetricsData['database'];
  historicalData: MetricsData[];
  className?: string;
}

const DatabaseMetrics: React.FC<DatabaseMetricsProps> = ({ database, historicalData, className = "" }) => {
  const utilizationPercentage = database.total > 0 
    ? (database.active / database.total) * 100 
    : 0;

  return (
    <ChartCard
      title="Métricas de Banco de Dados"
      icon="fas fa-database"
      subtitle="Monitoramento de conexões e performance"
      delay={0.8}
      className={className}
    >
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Ativas</div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(database.active)}
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Idle</div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(database.idle)}
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(database.total)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">Utilização</div>
          <div className="text-sm font-medium text-gray-800 dark:text-white">
            {utilizationPercentage.toFixed(2)}%
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${
              utilizationPercentage > 80 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : utilizationPercentage > 60 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                  : 'bg-gradient-to-r from-green-400 to-green-500'
            }`}
            style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
          ></div>
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {utilizationPercentage > 80 
            ? 'Alta utilização - considere expandir o pool' 
            : utilizationPercentage > 60 
              ? 'Utilização moderada' 
              : 'Utilização saudável'}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Histórico de Conexões
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={historicalData}>
            <XAxis 
              dataKey="timestamp" 
              stroke="#9CA3AF" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                if (typeof value === 'string') {
                  return value.split(' ')[1] || value; // Exibe apenas o horário
                }
                return value;
              }}
            />
            <YAxis 
              stroke="#9CA3AF" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              content={
                <CustomTooltip 
                  dataFormatter={(payload) => ({
                    label: "Conexões",
                    value: payload.database?.active,
                    color: "#3B82F6",
                    formatter: (value) => formatNumber(Number(value)),
                    subtitle: `Total: ${formatNumber(payload.database?.total || 0)} | Idle: ${formatNumber(payload.database?.idle || 0)}`
                  })}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="database.active"
              name="Ativas"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="database.idle"
              name="Idle"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default DatabaseMetrics;