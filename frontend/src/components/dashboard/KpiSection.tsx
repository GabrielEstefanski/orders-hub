import { formatPercentage } from "../../utils/formatters/number";
import { AnimatedElement } from "../animation/AnimatedElement";
import { AnimatedList } from "../animation/AnimatedList";
import DashboardSummary from "../../types/DashboardSummary";
import KPICard from "./KPICard";

const KPISection: React.FC<DashboardSummary> = (dashboardSummary: DashboardSummary) => (
    <AnimatedList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AnimatedElement animation="slideUp" delay={0.1}>
        <KPICard
          title="Total de Pedidos"
          value={dashboardSummary.totalOrders ?? 0}
          lastValue={dashboardSummary.previousTotalOrders}
          icon={<i className="fas fa-shopping-cart" />}
          gradient="from-blue-500 to-indigo-500"
        />
      </AnimatedElement>
      
      <AnimatedElement animation="slideUp" delay={0.2}>
        <KPICard
          title="Faturamento Total"
          value={dashboardSummary.totalRevenue ?? 0}
          lastValue={dashboardSummary.previousTotalRevenue}
          icon={<i className="fas fa-dollar-sign" />}
          isCurrency
          gradient="from-emerald-500 to-teal-500"
        />
      </AnimatedElement>
  
      <AnimatedElement animation="slideUp" delay={0.3}>
        <KPICard
          title="Ticket Médio"
          value={dashboardSummary.averageOrderValue ?? 0}
          lastValue={dashboardSummary.previousAverageOrderValue}
          icon={<i className="fas fa-receipt" />}
          isCurrency
          gradient="from-purple-500 to-pink-500"
        />
      </AnimatedElement>
  
      <AnimatedElement animation="slideUp" delay={0.4}>
        <KPICard
          title="Taxa de Conclusão"
          value={dashboardSummary.orderCompletionRate ?? 0}
          icon={<i className="fas fa-check-circle" />}
          format={(value) => formatPercentage(value / 100)}
          gradient="from-amber-500 to-orange-500"
        />
      </AnimatedElement>
    </AnimatedList>
);

export default KPISection;  