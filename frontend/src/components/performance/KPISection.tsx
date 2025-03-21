import { MetricsData } from "../../services/metrics";
import { formatNumber } from "../../utils/formatters/number";
import { formatTime } from "../../utils/formatters/time";
import { AnimatedElement } from "../animation/AnimatedElement";
import { AnimatedList } from "../animation/AnimatedList";
import KPICard from "../dashboard/KPICard";

interface KPISectionProps {
  metrics: MetricsData;
}

const KPISection: React.FC<KPISectionProps> = ({ metrics }) => (
  <AnimatedList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
    <AnimatedElement animation="slideUp" delay={0.1}>
      <KPICard
        title="Throughput"
        value={metrics.performance.throughputPerMinute}
        icon={<i className="fas fa-tachometer-alt" />}
        gradient="from-purple-500 to-pink-500"
        format={(value) => `${formatNumber(value)}/min`}
        subtitle={`SLA: ${metrics.performance.serviceLevel}%`}
      />
    </AnimatedElement>

    <AnimatedElement animation="slideUp" delay={0.2}>
      <KPICard
        title="Taxa de Erro"
        value={metrics.performance.errorRate}
        icon={<i className="fas fa-exclamation-triangle" />}
        gradient="from-red-500 to-orange-500"
        format={(value) => `${value}%`}
        subtitle={`${formatNumber(metrics.resilience.recoveredErrors)} erros recuperados`}
      />
    </AnimatedElement>

    <AnimatedElement animation="slideUp" delay={0.3}>
      <KPICard
        title="Usuários Ativos"
        value={metrics.users.activeCount}
        icon={<i className="fas fa-users" />}
        gradient="from-green-500 to-emerald-500"
        format={(value) => formatNumber(value)}
        subtitle="Usuários conectados agora"
      />
    </AnimatedElement>

    <AnimatedElement animation="slideUp" delay={0.4}>
      <KPICard
        title="Recursos"
        value={metrics.systemResources.cpuUsage}
        icon={<i className="fas fa-microchip" />}
        gradient="from-blue-500 to-indigo-500"
        format={(value) => `${value.toFixed(2)}%`}
        subtitle={`${(metrics.systemResources.memoryUsageMB.toFixed(2))} MB em uso`}
      />
    </AnimatedElement>

    <AnimatedElement animation="slideUp" delay={0.5}>
      <KPICard
        title="Cache Hit Rate"
        value={metrics.cache.hitRate * 100}
        icon={<i className="fas fa-bolt" />}
        gradient="from-yellow-500 to-orange-500"
        format={(value) => `${value}%`}
        subtitle={`${formatNumber(metrics.cache.hits)} hits / ${formatNumber(metrics.cache.misses)} misses`}
      />
    </AnimatedElement>

    <AnimatedElement animation="slideUp" delay={0.6}>
      <KPICard
        title="Conexões DB"
        value={metrics.database.active}
        icon={<i className="fas fa-database" />}
        gradient="from-cyan-500 to-blue-500"
        format={(value) => formatNumber(value)}
        subtitle={`${formatNumber(metrics.database.total)} conexões totais`}
      />
    </AnimatedElement>

    <AnimatedElement animation="slideUp" delay={0.7}>
      <KPICard
        title="Circuit Breaker"
        value={metrics.resilience.circuitBreaker.database}
        icon={<i className="fas fa-shield-alt" />}
        gradient="from-violet-500 to-purple-500"
        format={(value) => `${value}%`}
        subtitle={`${formatNumber(metrics.resilience.retryAttempts)} retentativas`}
      />
    </AnimatedElement>

    <AnimatedElement animation="slideUp" delay={0.8}>
      <KPICard
        title="API Response"
        value={metrics.performance.p95LatencySeconds || metrics.apiMetrics?.requests.responseTime.average || 0}
        icon={<i className="fas fa-clock" />}
        gradient="from-rose-500 to-pink-500"
        format={(value) => formatTime(value)}
        subtitle={`SLA: ${metrics.performance.slaCompliancePercentage?.toFixed(2) || 100}%`}
      />
    </AnimatedElement>
  </AnimatedList>
);

export default KPISection;