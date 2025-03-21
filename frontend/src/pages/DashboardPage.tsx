import { useState, useEffect } from 'react';
import { useDashboardStore } from '../services/dashboard';
import { useNavigate } from 'react-router-dom';

import { AnimatedElement } from '../components/animation/AnimatedElement';
import DashboardLoader from '../components/dashboard/DashboardLoader';
import StatusChart from '../components/dashboard/StatusChart';
import OrdersChart from '../components/dashboard/OrdersByDateChart';
import ProfitChart from '../components/dashboard/ProfitByDateChart';
import TopProductsChart from '../components/dashboard/TopProductsChart';
import CustomerDistributionChart from '../components/dashboard/CustomerDistributionChart';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import KPISection from '../components/dashboard/KpiSection';
import AverageOrderValueChart from '../components/dashboard/AverageOrderValueChart';
import { motion } from 'framer-motion';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => (
  <AnimatedElement animation="popup" className="h-[80vh] flex items-center justify-center">
    <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/20 max-w-lg w-full text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <i className="fas fa-exclamation-triangle text-2xl text-white"></i>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Erro ao carregar dados
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {error || 'Não foi possível carregar os dados do dashboard.'}
      </p>
      <button 
        onClick={onRetry} 
        className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 font-medium"
        type="button"
      >
        <i className="fas fa-sync-alt mr-2"/>
        Tentar Novamente
      </button>
    </div>
  </AnimatedElement>
);

const NoOrdersDisplay: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <AnimatedElement animation="popup" className="h-[80vh] flex items-center justify-center">
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/20 max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-shopping-cart text-2xl text-white"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Nenhum pedido disponível
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Parece que você ainda não possui pedidos registrados no sistema. Comece adicionando pedidos para visualizar dados no dashboard.
        </p>
        <button 
          onClick={() => navigate('/orders')} 
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium"
          type="button"
        >
          <i className="fas fa-plus-circle mr-2"/>
          Adicionar Pedidos
        </button>
      </div>
    </AnimatedElement>
  );
};

const ChartCard: React.FC<{
  title: string;
  icon: string;
  children: React.ReactNode;
  delay?: number;
}> = ({ title, icon, children, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
  >
    <div className="flex items-center mb-4">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mr-3">
        <i className={`${icon} text-white text-sm`}></i>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
    </div>
    {children}
  </motion.div>
);

const Dashboard: React.FC = () => {
  const { data: dashboardData, loading, error, fetchData } = useDashboardStore();
  const [filterPeriod, setFilterPeriod] = useState<string>("MES");

  useEffect(() => {
    fetchData(filterPeriod);
  }, [fetchData, filterPeriod]);

  if (loading) {
    return <DashboardLoader />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => fetchData(filterPeriod)} />;
  }

  const currentData = dashboardData[filterPeriod];
  if (!currentData) return null;
  
  if (!currentData.totalOrders || currentData.totalOrders === 0) {
    return <NoOrdersDisplay />;
  }

  const statusDataWithPercentage = currentData.ordersByStatus.map(item => ({
    status: item.status,
    total: item.total,
    percentage: (item.total / currentData.totalOrders) * 100
  }));

  const topProductsMapped = currentData.topProducts.map(item => ({
    productName: item.productName,
    quantity: item.quantity,
    totalRevenue: item.totalRevenue
  }));

  const averageOrderValueMapped = currentData.averageOrderValueByDate.map(item => ({
    date: item.date,
    totalProfit: item.totalProfit
  }));

  return (
    <AnimatedElement animation="fadeIn" transition="slow" className="min-h-screen space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader 
          filterPeriod={filterPeriod} 
          setFilterPeriod={setFilterPeriod} 
        />
        
        <KPISection {...currentData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard 
            title="Pedidos por Período" 
            icon="fas fa-calendar-alt"
            delay={0.3}
          >
            <OrdersChart data={currentData.ordersByDate} loading={loading} />
          </ChartCard>

          <ChartCard 
            title="Faturamento por Período" 
            icon="fas fa-chart-line"
            delay={0.4}
          >
            <ProfitChart data={currentData.revenueByDate} loading={loading} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard 
            title="Status dos Pedidos" 
            icon="fas fa-tasks"
            delay={0.5}
          >
            <StatusChart data={statusDataWithPercentage} loading={loading} />
          </ChartCard>

          <ChartCard 
            title="Top Produtos" 
            icon="fas fa-trophy"
            delay={0.6}
          >
            <TopProductsChart data={topProductsMapped} loading={loading} />
          </ChartCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard 
            title="Distribuição de Clientes" 
            icon="fas fa-users"
            delay={0.7}
          >
            <CustomerDistributionChart data={currentData.customerDistribution} loading={loading} />
          </ChartCard>

          <ChartCard 
            title="Ticket Médio por Período" 
            icon="fas fa-receipt"
            delay={0.8}
          >
            <AverageOrderValueChart data={averageOrderValueMapped} loading={loading} />
          </ChartCard>
        </div>
      </div>
    </AnimatedElement>
  );
};

export default Dashboard;
