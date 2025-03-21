import { StatusIndicator } from "../common/StatusIndicator";
import ChartCard from "./ChartData";
import { MetricsData } from "../../services/metrics";
import { formatNumber } from "../../utils/formatters/number";

interface ServiceStatusProps {
  services: MetricsData['services'];
  resilience: MetricsData['resilience'];
}

const ServiceStatus: React.FC<ServiceStatusProps> = ({ services, resilience }) => {
  const getCircuitBreakerStatus = (value: number) => {
    if (value === 0) return "Aberto";
    if (value === 0.5) return "Semi-aberto";
    return "Fechado";
  };

  const getCircuitBreakerColor = (value: number) => {
    if (value === 0) return "from-red-400 to-red-500";
    if (value === 0.5) return "from-yellow-400 to-yellow-500";
    return "from-green-400 to-green-500";
  };

  const availableServices = Object.values(services).filter(Boolean).length;
  const totalServices = Object.values(services).length;
  const availabilityPercentage = (availableServices / totalServices) * 100;

  return (
    <ChartCard
      title="Status dos Serviços" 
      icon="fas fa-server"
      subtitle="Monitoramento de serviços e resiliência"
      delay={0.6}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">Disponibilidade de Serviços</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {availabilityPercentage.toFixed(2)}%
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${availabilityPercentage === 100 
                  ? 'bg-gradient-to-r from-green-400 to-green-500' 
                  : availabilityPercentage >= 66 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                    : 'bg-gradient-to-r from-red-400 to-red-500'}`}
                style={{ width: `${availabilityPercentage}%` }}
              ></div>
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {availableServices} de {totalServices} serviços ativos
            </div>
          </div>
          <div className="space-y-3">
            {Object.entries(services).map(([service, status]) => (
              <div key={service} 
                className="flex items-center justify-between p-3 
                bg-gray-50 dark:bg-gray-700/50 rounded-lg
                border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${status 
                      ? 'bg-gradient-to-br from-green-400 to-green-500' 
                      : 'bg-gradient-to-br from-red-400 to-red-500'}`}>
                    <i className={`fas ${
                      service === 'redis' ? 'fa-database' :
                      service === 'rabbitMQ' ? 'fa-envelope' : 
                      service === 'api' ? 'fa-cloud' :
                      'fa-cogs'
                    } text-white`} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white capitalize">
                      {service}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {status ? 'Operacional' : 'Indisponível'}
                    </div>
                  </div>
                </div>
                <StatusIndicator status={status} />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-9">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 h-full">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Métricas de Resiliência
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4
                border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Erros Recuperados
                </div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  {formatNumber(resilience.recoveredErrors)}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4
                border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Retentativas
                </div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  {formatNumber(resilience.retryAttempts)}
                </div>
              </div>
            </div>
            
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
              Status dos Circuit Breakers
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(resilience.circuitBreaker).map(([service, value]) => (
                <div key={service} 
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3
                  border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {service}
                    </span>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${getCircuitBreakerColor(value)}`}></div>
                  </div>
                  <div className="font-medium text-gray-800 dark:text-white text-sm">
                    {getCircuitBreakerStatus(value)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Informações de Resiliência
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p className="mb-2">
                  O sistema utiliza padrões de resiliência como Circuit Breaker, Retry e Timeout 
                  para garantir estabilidade mesmo em condições de falha.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-500"></div>
                    <span>Circuit Breaker Fechado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500"></div>
                    <span>Circuit Breaker Semi-aberto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-500"></div>
                    <span>Circuit Breaker Aberto</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
};

export default ServiceStatus;