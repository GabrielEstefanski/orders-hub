import { useEffect, useState } from "react";
import CustomInput from "../inputs/Custom";
import { debounce } from "lodash";

interface ToolBarProps {
  onSearch: (searchTerm: string) => void;
  onExport: () => void;
  searchTerm: string;
}

const ToolBar = ({ onSearch, onExport, searchTerm }: ToolBarProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const debouncedSearch = debounce((term: string) => {
    onSearch(term);
  }, 300);

  const handleSearch = (term: string) => {
    setLocalSearchTerm(term);
    debouncedSearch(term);
  };

  return (
    <div className="sticky left-0 w-full top-0 bg-white/80 dark:bg-gray-800/80 z-10 pb-4 pt-4 rounded-t-lg border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex justify-between items-center px-4">
        <div>
          <label htmlFor="table-search" className="sr-only">Search</label>
          <div className="relative">
            <CustomInput
              id="table-search"
              value={localSearchTerm}
              icon={<i className="fa fa-search" aria-hidden="true"/>}
              onChange={handleSearch}
              placeholder="Filtrar pedidos"
              className="lg:w-80 sm:min-w-20 bg-white/90 dark:bg-gray-700/90 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 dark:focus:border-blue-500/50 text-gray-900 dark:text-gray-100 transition-all duration-200"
            />
          </div>
        </div>
        <div className="flex items-center">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 focus:ring-2 focus:ring-blue-500/50 dark:bg-blue-500 dark:hover:bg-blue-600"
            onClick={onExport}
          >
            <i className="fas fa-file-export" />
            <span className="hidden sm:inline ml-2">Exportar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;