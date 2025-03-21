import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "./ChartData";
import { MetricsData } from "../../services/metrics";
import { formatNumber } from "../../utils/formatters/number";
import CustomTooltip from "../dashboard/CustomTooltip";

interface CacheMetricsProps {
  cache: MetricsData['cache'];
  historicalData: MetricsData[];
  className?: string;
}

const CacheMetrics: React.FC<CacheMetricsProps> = ({ cache, historicalData, className = "" }) => {
  return (
    <ChartCard
      title="Métricas de Cache"
      icon="fas fa-bolt"
      subtitle="Desempenho e estatísticas de cache"
      delay={0.7}
      className={className}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Taxa de Acerto</div>
          <div className="mt-1">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {cache.hitRate * 100}%
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Acertos</div>
          <div className="mt-1">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {formatNumber(cache.hits)}
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Falhas</div>
          <div className="mt-1">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {formatNumber(cache.misses)}
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Acessos</div>
          <div className="mt-1">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {formatNumber(cache.hits + cache.misses)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Taxa de Acerto por Tipo</div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Redis</span>
                <span>{(cache.hitRateByType.redis * 100).toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-500 h-1.5 rounded-full"
                  style={{ width: `${cache.hitRateByType.redis * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Database</span>
                <span>{(cache.hitRateByType.database * 100).toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-purple-400 to-purple-500 h-1.5 rounded-full"
                  style={{ width: `${cache.hitRateByType.database * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Estatísticas Gerais</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Economia de Recursos
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatNumber(cache.hits * 50)} ms
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Eficiência
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {cache.hitRate > 80 ? 'Ótima' : cache.hitRate > 50 ? 'Boa' : 'Regular'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Evolução da Taxa de Acerto
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={historicalData}>
            <defs>
              <linearGradient id="cacheGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(107, 114, 128, 0.15)"
              vertical={false}
            />
            <XAxis 
              dataKey="timestamp"
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              content={
                <CustomTooltip 
                  dataFormatter={(payload) => ({
                    label: "Taxa de Acerto",
                    value: payload.cache?.hitRate * 100,
                    color: "#F59E0B",
                    suffix: "%",
                    subtitle: `Acertos: ${formatNumber(payload.cache?.hits || 0)}`
                  })}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="cache.hitRate"
              name="Taxa de Acerto"
              stroke="#F59E0B"
              fill="url(#cacheGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default CacheMetrics;