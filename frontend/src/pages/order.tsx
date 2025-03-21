import { useState } from 'react';
import OrderTable from '../components/table/OrderTable';
import ModalForm from '../components/modals/ModalForm';
import { useOrders } from '../hooks/useOrders';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import Order from '../types/Order';
import { AnimatePresence, motion } from 'framer-motion';
import OrderDrawer from '../components/ui/OrderDrawer';

const OrderPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalViewOpen, setIsModalViewOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('DataDeCriacao');
  const [descending, setDescending] = useState<boolean>(false);

  const {
    filteredOrders,
    loading,
    handleDelete,
    handleSearch,
    handleAddOrder,
    handleEditOrder,
    searchTerm,
    handleSort
  } = useOrders();

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      handleDelete(orderToDelete);
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleOpenDeleteModal = (id: string) => {
    setOrderToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleOpenViewModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalViewOpen(true);
  };

  const handleOpenAddEditModal = (order: Order | null) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleAddEditOrder = (newOrder: Partial<Order>) => {
    if (selectedOrder === null) {
      handleAddOrder(newOrder);
    } else {
      handleEditOrder(newOrder);
    }
  };

  const handleSortChange = (column: string) => {
    setSortBy(column);
    setDescending(prev => column === sortBy ? !prev : false);
    handleSort(column);
  };

  const handleExport = () => {
    const csvContent = filteredOrders.map(order => ({
      Cliente: order.cliente,
      Produto: order.produto,
      Status: order.status,
      Valor: order.valor,
      'Data de Criação': new Date(order.dataCriacao).toLocaleDateString('pt-BR')
    }));

    console.log('Exportando:', csvContent);
  };

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
            >
              Gerenciamento de Pedidos
            </motion.h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Gerencie todos os pedidos do seu negócio
            </p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenAddEditModal(null)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <i className="fas fa-plus" />
            <span>Novo Pedido</span>
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SkeletonLoader type='table' />
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <OrderTable
                  orders={filteredOrders}
                  onDelete={handleOpenDeleteModal}
                  onView={handleOpenViewModal}
                  onEdit={handleOpenAddEditModal}
                  onSearch={handleSearch}
                  onExport={handleExport}
                  searchTerm={searchTerm}
                  onSortChange={handleSortChange}
                  sortBy={sortBy}
                  descending={descending}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddEditOrder}
          orderToEdit={selectedOrder}
        />
        <OrderDrawer
          isOpen={isModalViewOpen}
          onClose={() => setIsModalViewOpen(false)}
          orderToView={selectedOrder}
        />
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
};

export default OrderPage;