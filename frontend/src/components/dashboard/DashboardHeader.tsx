import { AnimatedElement } from "../animation/AnimatedElement";
import PeriodSelector from "./PeriodSelector";

interface DashboardHeaderProps {
  filterPeriod: string;
  setFilterPeriod: (value: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ filterPeriod, setFilterPeriod }) => (
    <AnimatedElement animation="slideDown" className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent 
          bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Visão geral do desempenho do negócio
        </p>
      </div>
      <div className="flex items-center gap-2">
        <PeriodSelector
          current={filterPeriod}
          onChange={setFilterPeriod}
          options={[
            { value: "DIA", label: "Hoje" },
            { value: "MES", label: "Este Mês" },
            { value: "ANO", label: "Este Ano" },
            { value: "TUDO", label: "Todo Período" },
          ]}
        />
      </div>
    </AnimatedElement>
  );

export default DashboardHeader;