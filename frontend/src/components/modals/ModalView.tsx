import { useEffect, useState } from "react";
import Modal from "./Modal";
import Order from "../../types/Order";
import CustomInput from "../inputs/Custom";
import MoneyInput from "../inputs/Money";
import { OrderStatus } from "../../types/OrderStatus";
import formatDate from "../../utils/date/formatDate";

interface ModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  orderToView?: Order | null;
}

const ModalView = ({ isOpen, onClose, orderToView }: ModalViewProps) => {
  const [id, setId] = useState<string>('');
  const [cliente, setCliente] = useState<string>('');
  const [produto, setProduto] = useState<string>('');
  const [valor, setValor] = useState<number>(0);
  const [status, setStatus] = useState<number>(0);
  const [dataCriacao, setDataCriacao] = useState<string>('');

  useEffect(() => {
    if (orderToView) {
      setId(orderToView.id);
      setCliente(orderToView.cliente);
      setProduto(orderToView.produto);
      setValor(orderToView.valor);
      setStatus(orderToView.status);
      setDataCriacao(orderToView.dataCriacao);
    }
  }, [orderToView]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Visualizar Pedido">
      <div className="space-y-4">
        <CustomInput
          id="id-entrega"
          label="ID da Entrega"
          value={id}
          onChange={() => {}}
          icon={<i className="fa fa-tag" />}
          className="w-full!"
          disabled
        />
        <CustomInput
          id="cliente"
          label="Cliente"
          value={cliente}
          onChange={() => {}}
          icon={<i className="fa fa-user" />}
          className="w-full!"
          disabled
        />
        <CustomInput
          id="produto"
          label="Produto"
          value={produto}
          onChange={() => {}}
          icon={<i className="fa fa-box" />}
          className="w-full!"
          disabled
        />
        <MoneyInput
          id="valor"
          label="Valor"
          value={valor}
          onChange={() => {}}
          disabled
        />
        <CustomInput
          id="status"
          label="Status"
          value={OrderStatus[status]}
          onChange={() => {}}
          icon={<i className="fa fa-clipboard" />}
          className="w-full!"
          disabled
        />
        <CustomInput
          id="dataCriacao"
          label="Data de Criação"
          value={formatDate(dataCriacao)}
          onChange={() => {}}
          icon={<i className="fa fa-calendar" />}
          className="w-full!"
          disabled
        />
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalView;
