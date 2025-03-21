import { OrderActionsProps } from "../../types/ActionsProps";
import Tooltip from "../tooltip";

const OrderActions = ({ orderId, onDelete, onView, onEdit }: OrderActionsProps) => (
  <div className="flex gap-2">
    <div className="relative group">
      <Tooltip content="Editar" position="bottom">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 hover:bg-blue-200 dark:hover:bg-blue-500/30 text-blue-700 dark:text-blue-300 transition-all duration-200 backdrop-blur-sm hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 focus:ring-2 focus:ring-blue-500/50"
          onClick={() => onEdit(orderId)}
        >
          <i className="fa fa-edit" />
        </button>
      </Tooltip>
    </div>

    <div className="relative group">
      <Tooltip content="Excluir" position="bottom">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-700 dark:text-red-300 transition-all duration-200 backdrop-blur-sm hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 focus:ring-2 focus:ring-red-500/50"
          onClick={() => onDelete(orderId)}
        >
          <i className="fa fa-trash" />
        </button>
      </Tooltip>
    </div>

    <div className="relative group">
      <Tooltip content="Ver detalhes" position="bottom">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-500/20 hover:bg-yellow-200 dark:hover:bg-yellow-500/30 text-yellow-700 dark:text-yellow-300 transition-all duration-200 backdrop-blur-sm hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 focus:ring-2 focus:ring-yellow-500/50"
          onClick={() => onView(orderId)}
        >
          <i className="fa fa-eye" />
        </button>
      </Tooltip>
    </div>
  </div>
);

export default OrderActions;
