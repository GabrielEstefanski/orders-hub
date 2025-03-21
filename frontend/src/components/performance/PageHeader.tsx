import { AnimatedElement } from "../animation/AnimatedElement";

const PageHeader: React.FC = () => (
    <AnimatedElement animation="slideDown" className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent 
          bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
          Performance do Sistema
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Monitore métricas e desempenho em tempo real
        </p>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl
        bg-gray-50 dark:bg-gray-800
        border border-gray-200 dark:border-gray-700 shadow-sm">
        <i className="fas fa-sync-alt text-purple-500 dark:text-purple-400 animate-spin-slow" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Atualização automática a cada 5 segundos
        </span>
      </div>
    </AnimatedElement>
  );
  
export default PageHeader;