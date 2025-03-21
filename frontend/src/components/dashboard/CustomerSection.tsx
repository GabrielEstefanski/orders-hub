import { AnimatedElement } from "../animation/AnimatedElement";
import CustomerDistributionChart from "./CustomerDistributionChart";

interface CustomerSectionProps {
    data: {
        ordersPerCustomer: {
            [key: string]: number;
        };
    };
}

const CustomerSection: React.FC<CustomerSectionProps> = ({ data }) => (
    <AnimatedElement animation="popup" delay={0.7} className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Distribuição de Clientes
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {Object.keys(data.ordersPerCustomer || {}).length} clientes
        </div>
      </div>
      
      <div className="h-[300px]">
        <CustomerDistributionChart 
          data={Object.entries(data.ordersPerCustomer || {}).map(([name, count]) => ({
            customerName: name,
            total: count as number
          }))}
        />
      </div>
    </AnimatedElement>
);
  
export default CustomerSection;  