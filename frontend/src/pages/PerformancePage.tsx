import React from 'react';
import { useTheme } from '../context/ThemeProvider';
import { useMetrics } from '../hooks/useMetrics';
import { AnimatedElement } from '../components/animation/AnimatedElement';
import { MetricsLoader } from '../components/performance/MetricsLoader';
import KPISection from '../components/performance/KPISection';
import ServiceStatus from '../components/performance/ServiceStatus';
import PageHeader from '../components/performance/PageHeader';
import ResourceUsageChart from '../components/performance/ResourceUsageChart';
import DatabaseMetrics from '../components/performance/DatabaseMetrics';
import CacheMetrics from '../components/performance/CacheMetrics';
import PerformanceMetrics from '../components/performance/PerformanceMetrics';

export const PerformancePage: React.FC = () => {
  const { metrics, historicalData, loading, error } = useMetrics({
    pollingInterval: 5000,
    maxHistoricalPoints: 30
  });
  const { isDarkMode } = useTheme();

  if (loading) {
    return <MetricsLoader />;
  }

  if (error) {
    return (
      <AnimatedElement animation="popup" className="h-[80vh] flex items-center justify-center">
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-exclamation-triangle text-2xl text-white"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Erro ao carregar métricas
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error.message || 'Não foi possível carregar as métricas de performance do sistema.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Tentar Novamente
          </button>
        </div>
      </AnimatedElement>
    );
  }

  if (!metrics) return null;

  return (
    <AnimatedElement animation="fadeIn" transition="slow" className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader />
        
        <KPISection metrics={metrics} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 flex">
            <div className="w-full flex flex-col h-full">
              <PerformanceMetrics 
                performance={metrics.performance}
                historicalData={historicalData.slice(-10)}
                isDarkMode={isDarkMode}
                className="flex-grow h-full"
              />
            </div>
          </div>
          <div className="lg:col-span-6 flex">
            <div className="w-full flex flex-col h-full">
              <ResourceUsageChart 
                data={historicalData}
                isDarkMode={isDarkMode}
                className="flex-grow h-full"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 flex">
            <div className="w-full flex flex-col h-full">
              <CacheMetrics 
                cache={metrics.cache}
                historicalData={historicalData}
                className="flex-grow h-full"
              />
            </div>
          </div>
          <div className="lg:col-span-6 flex">
            <div className="w-full flex flex-col h-full">
              <DatabaseMetrics 
                database={metrics.database}
                historicalData={historicalData}
                className="flex-grow h-full"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <ServiceStatus 
            services={metrics.services} 
            resilience={metrics.resilience}
          />
        </div>
      </div>
    </AnimatedElement>
  );
}; 