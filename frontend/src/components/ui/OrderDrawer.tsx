import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Order from "../../types/Order";
import { OrderStatus } from "../../types/OrderStatus";
import formatDate from "../../utils/date/formatDate";
import api from "../../services/api";

interface OrderHistory {
  id: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
}

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orderToView?: Order | null;
}

const OrderDrawer = ({ isOpen, onClose, orderToView }: OrderDrawerProps) => {
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!orderToView) return;

      try {
        setLoading(true);
        const response = await api.get<OrderHistory[]>(`/order/${orderToView.id}/history`);
        setHistory(response);
      } catch (error) {
        console.error('Erro ao buscar histórico do pedido:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && orderToView) {
      fetchOrderHistory();
    }
  }, [isOpen, orderToView]);

  const formatOrderId = (id: string) => {
    if (!id) return "";
    if (id.length > 8 && id.includes("-")) {
      return id.substring(0, 8) + "...";
    }
    return id;
  };

  const StatusBadge = ({ status }: { status: number }) => {
    const statusColors = {
      0: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      1: 'bg-blue-100 text-blue-800 border-blue-200',
      2: 'bg-green-100 text-green-800 border-green-200',
      3: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[status as keyof typeof statusColors]}`}>
        {OrderStatus[status]}
      </span>
    );
  };

  const getHistoryIcon = (field: string) => {
    switch (field) {
      case "Criação":
        return { icon: "fa-plus-circle", color: "text-green-500" };
      case "Status":
        return { icon: "fa-exchange-alt", color: "text-blue-500" };
      case "Valor":
        return { icon: "fa-dollar-sign", color: "text-yellow-500" };
      case "Cliente":
        return { icon: "fa-user-edit", color: "text-purple-500" };
      case "Produto":
        return { icon: "fa-box", color: "text-indigo-500" };
      default:
        return { icon: "fa-edit", color: "text-gray-500" };
    }
  };

  const renderHistoryContent = (change: OrderHistory) => {
    const { icon, color } = getHistoryIcon(change.field);

    if (change.field === "Criação") {
      return (
        <div className="flex items-start space-x-3">
          <div className={`mt-0.5 ${color}`}>
            <i className={`fas ${icon} text-lg`}></i>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Pedido Criado
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {change.newValue}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-start space-x-3">
        <div className={`mt-0.5 ${color}`}>
          <i className={`fas ${icon} text-lg`}></i>
        </div>
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {change.field === "Status" 
              ? "Status alterado" 
              : `Alteração em ${change.field}`}
          </p>
          <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-block truncate max-w-[120px] sm:max-w-full">{change.oldValue}</span>
            <span className="mx-2">
              <i className="fas fa-long-arrow-alt-right text-gray-400"></i>
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px] sm:max-w-full">{change.newValue}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[90%] md:w-[600px] bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto"
          >
            {orderToView && (
              <div className="h-full flex flex-col">
                <div className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                          Pedido #{formatOrderId(orderToView.id)}
                        </h2>
                        <span 
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-1 px-2 rounded cursor-help"
                          title={orderToView.id}
                        >
                          ID Completo
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Criado em {formatDate(orderToView.dataCriacao)}
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <i className="fas fa-times text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-4 sm:p-6 space-y-6 sm:space-y-8">
                  <section className="space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                      Informações do Pedido
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2 bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                        <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center gap-2 truncate">
                          <i className="fas fa-user text-blue-500" />
                          {orderToView.cliente}
                        </p>
                      </div>
                      <div className="space-y-2 bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Produto</p>
                        <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center gap-2 truncate">
                          <i className="fas fa-box text-indigo-500" />
                          {orderToView.produto}
                        </p>
                      </div>
                      <div className="space-y-2 bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Valor</p>
                        <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          <i className="fas fa-dollar-sign text-green-500" />
                          {orderToView.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                      <div className="space-y-2 bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Status</p>
                        <StatusBadge status={orderToView.status} />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <i className="fas fa-history mr-2 text-purple-500"></i>
                      Histórico de Alterações
                    </h3>
                    
                    {loading ? (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-16 sm:h-20 rounded-lg"></div>
                        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-16 sm:h-20 rounded-lg"></div>
                        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-16 sm:h-20 rounded-lg"></div>
                      </div>
                    ) : (
                      <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700 space-y-4 sm:space-y-6 py-2">
                        {history.length > 0 ? (
                          history.map((change, index) => (
                            <motion.div
                              key={change.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="relative"
                            >
                              <div className="absolute -left-[calc(0.5rem+1px)] -ml-8 h-4 w-4 rounded-full bg-white dark:bg-gray-800 border-4 border-blue-500"></div>
                              
                              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                  <div className="mb-2 sm:mb-0 flex-1 min-w-0">
                                    {renderHistoryContent(change)}
                                  </div>
                                  <div className="text-left sm:text-right sm:ml-4 flex flex-row sm:flex-col justify-between items-center sm:items-end gap-2 sm:gap-0 mt-2 sm:mt-0">
                                    <p className="text-xs text-gray-900 dark:text-white font-medium order-2 sm:order-1">
                                      {change.changedBy}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 order-1 sm:order-2">
                                      {formatDate(change.changedAt)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-3 sm:mb-4">
                              <i className="fas fa-clipboard text-gray-400 text-lg"></i>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              Nenhuma alteração registrada
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderDrawer;