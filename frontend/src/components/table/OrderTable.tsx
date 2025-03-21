import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ToolBar from "./ToolBar";
import Pagination from "./Pagination";
import Order from "../../types/Order";
import OrderTableBody from "./OrderTableBody";
import TableHeader from "./OrderTableHeader";

interface OrderTableProps {
  orders: Order[];
  onDelete: (id: string) => void;
  onView: (data: Order) => void;
  onSearch: (searchTerm: string) => void;
  onEdit: (data: Order) => void;
  onExport: () => void;
  searchTerm: string;
  onSortChange: (column: string) => void;
  sortBy: string;
  descending: boolean;
}

const OrderTable = ({
  orders,
  onDelete,
  onView,
  onSearch,
  onEdit,
  onExport,
  searchTerm,
  onSortChange,
  sortBy,
  descending,
}: OrderTableProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 7;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.max(Math.ceil(orders.length / itemsPerPage), 1);

  const startEntry = indexOfFirstItem + 1;
  const endEntry = Math.min(indexOfLastItem, orders.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="absolute -right-6 -top-6 w-32 h-32 
        bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10
        dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5
        rounded-full blur-2xl opacity-50" 
      />

      <div className="relative bg-white/80 dark:bg-gray-800/80 flex flex-col min-h-[600px]">
        <ToolBar
          onSearch={onSearch}
          onExport={onExport}
          searchTerm={searchTerm}
        />

        <div className="flex-grow overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 text-xs uppercase bg-gray-100/95 dark:bg-gray-700/95 backdrop-blur-sm border-y border-gray-200/50 dark:border-gray-700/50">
              <tr>
                <TableHeader column="cliente" label="Cliente" onSortChange={onSortChange} sortBy={sortBy} descending={descending} />
                <TableHeader column="produto" label="Produto" onSortChange={onSortChange} sortBy={sortBy} descending={descending} />
                <TableHeader column="status" label="Status" onSortChange={onSortChange} sortBy={sortBy} descending={descending} />
                <TableHeader column="valor" label="Valor" onSortChange={onSortChange} sortBy={sortBy} descending={descending} />
                <TableHeader column="dataCriacao" label="Data de Criação" onSortChange={onSortChange} sortBy={sortBy} descending={descending} />
                <th scope="col" className="px-6 py-4 text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  Ações
                </th>
              </tr>
            </thead>
            <AnimatePresence mode="wait">
              <OrderTableBody
                orders={currentOrders}
                onDelete={onDelete}
                onView={onView}
                onEdit={onEdit}
              />
            </AnimatePresence>
          </table>
        </div>

        <div className="sticky left-0 bottom-0 w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap"
            >
              Mostrando <span className="font-medium text-gray-900 dark:text-white">{startEntry}</span> até{' '}
              <span className="font-medium text-gray-900 dark:text-white">{endEntry}</span> de{' '}
              <span className="font-medium text-gray-900 dark:text-white">{orders.length.toLocaleString('pt-BR')}</span> pedidos
            </motion.span>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderTable;