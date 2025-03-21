import { useState, useEffect } from "react";
import Modal from "./Modal";
import Order from "../../types/Order";
import CustomInput from "../inputs/Custom";
import MoneyInput from "../inputs/Money";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: Partial<Order>) => void;
  orderToEdit?: Order | null;
}

const ModalForm = ({ isOpen, onClose, onSubmit, orderToEdit }: ModalFormProps) => {
  const [cliente, setCliente] = useState<string>("");
  const [produto, setProduto] = useState<string>("");
  const [valor, setValor] = useState<number>(0);
  const [initialOrder, setInitialOrder] = useState<Partial<Order> | null>(null);
  useEffect(() => {
    if (orderToEdit) {
      setCliente(orderToEdit.cliente);
      setProduto(orderToEdit.produto);
      setValor(orderToEdit.valor);
      setInitialOrder({ ...orderToEdit });
    } else {
      setCliente("");
      setProduto("");
      setValor(0);
      setInitialOrder(null);
    }
  }, [orderToEdit]);

  const isFormChanged = () => {
    if (!initialOrder) return cliente || produto || valor > 0;
    return (
      cliente !== initialOrder.cliente ||
      produto !== initialOrder.produto ||
      valor !== initialOrder.valor
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newOrder: Partial<Order> = orderToEdit
      ? {
          id: orderToEdit.id,
          cliente,
          produto,
          valor,
          status: orderToEdit.status,
          dataCriacao: orderToEdit.dataCriacao,
        }
      : {
          cliente,
          produto,
          valor
        };

    onSubmit(newOrder);
    onClose();
  };

  return (
    <Modal
      key={orderToEdit?.id}
      isOpen={isOpen}
      onClose={onClose}
      title={orderToEdit ? "Editar Pedido" : "Criar Pedido"
    }>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <CustomInput
            id="cliente"
            label="Cliente"
            value={cliente}
            required
            onChange={setCliente}
            placeholder="Nome do cliente"
            icon={<i className="fa fa-user"/>}
            className="w-full!"
          />
          <CustomInput
            id="produto"
            label="Produto"
            value={produto}
            required
            placeholder="Nome do produto"
            onChange={setProduto}
            icon={<i className="fa fa-box"/>}
            className="w-full!"
          />
          <MoneyInput
            id="valor"
            label="Valor"
            value={valor}
            onChange={setValor}
            required
          />
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormChanged()}
              className={`px-4 py-2 rounded-md text-white ${
                isFormChanged() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed pointer-events-none"
              }`}
            >
              {orderToEdit ? "Salvar Alterações" : "Criar Pedido"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ModalForm;
