import api from "./api";
import Order from "../types/Order";

export const getOrders = async (
  searchTerm: string = "",
  sortBy: string = "cliente",
  descending: boolean = false,
): Promise<Order[]> => {
  try {
    const orders = await api.get<Order[]>('/order', {
      params: { searchTerm, sortBy, descending }
    });
    return orders;
  } catch (error) {
    console.error('Erro ao buscar pedidos: ', error);
    throw error;
  }
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    await api.delete(`/order/${orderId}`);
  } catch (error) {
    console.error('Erro ao deletar o pedido: ', error);
    throw error;
  }
};

export const postOrder = async (data: Partial<Order>, createdBy: string): Promise<Order> => {
  try {
    const newOrder = await api.post<Order>('/order', { ...data, createdBy });
    return newOrder;
  } catch (error) {
    console.error('Erro ao criar pedido: ', error);
    throw error;
  }
};

export const putOrder = async (data: Partial<Order>, changedBy: string): Promise<Order> => {
  try {
    const updatedOrder = await api.put<Order>(`/order/${data.id}`, { ...data, changedBy });
    return updatedOrder;
  } catch (error) {
    console.error('Erro ao editar o pedido: ', error);
    throw error;
  }
};
