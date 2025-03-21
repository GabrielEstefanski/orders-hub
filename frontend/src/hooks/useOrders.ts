import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { getOrders, deleteOrder, postOrder, putOrder } from '../services/order';
import Order from '../types/Order';
import { startConnection, subscribeToNotifications } from '../services/signalr';
import { useUser } from './useUser';
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<string>('cliente');
  const [sortOrder, setSortOrder] = useState<boolean>(false);

  const { user } = useUser();

  const debouncedFetchOrders = useCallback(
    debounce(async () => {
      setLoading(true);
      try {
        const data = await getOrders(searchTerm, sortField, sortOrder);
        setOrders(data);
        setFilteredOrders(data);
      } catch {
        console.error('Erro ao carregar os pedidos');
      } finally {
        setLoading(false);
      }
    }, 300),
    [searchTerm, sortField, sortOrder]
  );

  useEffect(() => {
    debouncedFetchOrders();
    return () => {
      debouncedFetchOrders.cancel();
    };
  }, [debouncedFetchOrders]);
  
  const handleDelete = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      handleDeleteOrderNotification(orderId);
    } catch (error) {
      console.error('Erro ao excluir o pedido:', error);
    }
  };

  const handleSearch = useCallback(
    debounce(async (term: string) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder((prevOrder) => !prevOrder);
  };

  const handleAddOrder = async (newOrder: Partial<Order>) => {
    try {
      const userName = user?.name ?? 'Sistema';
      const createdOrder = await postOrder(newOrder, userName);
      if (createdOrder) {
        handleAddOrderNotification(createdOrder);
      }
    } catch (error) {
      console.error('Erro ao criar o pedido:', error);
    }
  };

  const handleEditOrder = async (order: Partial<Order>) => {
    try {
      const userName = user?.name ?? 'Sistema';
      const updatedOrder = await putOrder(order, userName);
      if (updatedOrder) {
        handleUpdateOrders(updatedOrder);
      }
    } catch (error) {
      console.error('Erro ao editar o pedido:', error);
    }
  };

  const handleUpdateOrders = useCallback((update: Order) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === update.id ? { ...update} : order
      )
    );

    setFilteredOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === update.id ? { ...update} : order
      )
    );
  }, []);  

  const handleAddOrderNotification = useCallback((newOrder: Order) => {
    setOrders((prevOrders) => {
      if (prevOrders.some(order => order.id === newOrder.id)) {
        return prevOrders;
      }
      return [...prevOrders, newOrder];
    });
    
    setFilteredOrders((prevOrders) => {
      if (prevOrders.some(order => order.id === newOrder.id)) {
        return prevOrders;
      }
      return [...prevOrders, newOrder];
    });
  }, []);

  const handleDeleteOrderNotification = useCallback((orderId: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    setFilteredOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
  }, []);

  useEffect(() => {
    const updateOrders = (update: { order: Order }) => {
      handleUpdateOrders(update.order);
    };

    const addOrder = (newOrder: { order: Order}) => {
      handleAddOrderNotification(newOrder.order);
    };

    const deleteOrder = (orderId: string) => {
      handleDeleteOrderNotification(orderId);
    };

    let connection: any;

    const connectSignalR = async () => {
      try {
        connection = await startConnection();
        subscribeToNotifications((update: any) => {
          switch (update.actionType) {
            case 'Updated':
            case 'OrderUpdated':
              updateOrders(update);
              break;
            case 'Created':
              addOrder(update);
              break;
            case 'Deleted':
              deleteOrder(update.orderId);
              break;
            default:
              console.warn('Tipo de notificação desconhecido:', update);
              break;
          }
        });
      } catch (error) {
        console.error("Erro ao conectar ao SignalR:", error);
      }
    };

    connectSignalR();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [handleUpdateOrders, handleAddOrderNotification, handleDeleteOrderNotification]);

  return {
    orders,
    filteredOrders,
    loading,
    handleDelete,
    handleSearch,
    searchTerm,
    handleAddOrder,
    handleEditOrder,
    setOrders,
    handleUpdateOrders,
    handleSort,
    sortField,
    sortOrder
  };
};
