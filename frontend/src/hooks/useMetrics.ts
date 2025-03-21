import { useState, useEffect } from 'react';
import { metricsService, type MetricsData } from '../services/metrics';
import { toastService } from '../services/toast';

interface UseMetricsOptions {
  pollingInterval?: number;
  maxHistoricalPoints?: number;
}

export const useMetrics = (options: UseMetricsOptions = {}) => {
  const { 
    pollingInterval = 5000, 
    maxHistoricalPoints = 20 
  } = options;
  
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [historicalData, setHistoricalData] = useState<MetricsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await metricsService.getMetrics();
        setMetrics(data);
        setHistoricalData(prev => {
          const newData = [...prev, { ...data, timestamp: new Date().toLocaleTimeString() }];
          return newData.slice(-maxHistoricalPoints);
        });
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);
        toastService.error({
          title: 'Erro ao carregar métricas',
          message: 'Não foi possível obter os dados de performance do sistema.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, pollingInterval);
    return () => clearInterval(interval);
  }, [pollingInterval, maxHistoricalPoints]);

  return { metrics, historicalData, loading, error };
};
