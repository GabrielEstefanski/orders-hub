import Order from "../../types/Order";
import formatCurrency from "../../utils/currency/formatCurrency";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { OrderStatus } from '../../types/OrderStatus';

const OrderTableBody = ({
  orders,
  onDelete,
  onView,
  onEdit,
}: {
  orders: Order[];
  onDelete: (id: string) => void;
  onView: (data: Order) => void;
  onEdit: (data: Order) => void;
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      'Pendente': 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
      'Processando': 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
      'Finalizado': 'bg-green-500/20 text-green-700 dark:text-green-300',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
  };

  return (
    <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
      {orders.length === 0 ? (
        <tr>
          <td colSpan={6} className="px-6 py-4 text-center text-gray-700 dark:text-gray-400 bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-sm">
            Sem registro de pedidos
          </td>
        </tr>
      ) : (
        orders.map((order, index) => (
          <tr
            key={order.id}
            className={`bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50/80 dark:hover:bg-gray-700/80 
              backdrop-blur-sm transition-colors duration-200
              ${index % 2 === 0 ? 'bg-opacity-100' : 'bg-opacity-50'}`}
          >
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <i className="fas fa-user text-gray-500 dark:text-gray-400" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.cliente}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-700 dark:text-gray-300">{order.produto}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(OrderStatus[order.status])}`}>
                {OrderStatus[order.status]}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
              {formatCurrency(order.valor)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
              {format(new Date(order.dataCriacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onView(order)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center
                    bg-blue-500/10 dark:bg-blue-500/5
                    hover:bg-blue-500/20 dark:hover:bg-blue-500/10
                    border border-blue-500/20 dark:border-blue-500/10
                    shadow-[0_0_8px_theme(colors.blue.400/0)] hover:shadow-[0_0_8px_theme(colors.blue.400/30)]
                    dark:shadow-[0_0_8px_theme(colors.blue.500/0)] dark:hover:shadow-[0_0_8px_theme(colors.blue.500/20)]
                    backdrop-blur-sm
                    group
                    transform hover:scale-105 active:scale-95
                    transition-all duration-200"
                  >
                    <i className="fas fa-eye text-blue-600 dark:text-blue-400
                      group-hover:text-blue-700 dark:group-hover:text-blue-300
                      drop-shadow-[0_0_2px_theme(colors.blue.400/0)] 
                      group-hover:drop-shadow-[0_0_2px_theme(colors.blue.400/50)]" />
                  </button>

                  <button
                    onClick={() => onEdit(order)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center
                      bg-amber-500/10 dark:bg-amber-500/5
                      hover:bg-amber-500/20 dark:hover:bg-amber-500/10
                      border border-amber-500/20 dark:border-amber-500/10
                      shadow-[0_0_8px_theme(colors.amber.400/0)] hover:shadow-[0_0_8px_theme(colors.amber.400/30)]
                      dark:shadow-[0_0_8px_theme(colors.amber.500/0)] dark:hover:shadow-[0_0_8px_theme(colors.amber.500/20)]
                      backdrop-blur-sm
                      group
                      transform hover:scale-105 active:scale-95
                      transition-all duration-200"
                  >
                    <i className="fas fa-edit text-amber-600 dark:text-amber-400
                      group-hover:text-amber-700 dark:group-hover:text-amber-300
                      drop-shadow-[0_0_2px_theme(colors.amber.400/0)] 
                      group-hover:drop-shadow-[0_0_2px_theme(colors.amber.400/50)]" />
                  </button>

                  <button
                    onClick={() => onDelete(order.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center
                      bg-red-500/10 dark:bg-red-500/5
                      hover:bg-red-500/20 dark:hover:bg-red-500/10
                      border border-red-500/20 dark:border-red-500/10
                      shadow-[0_0_8px_theme(colors.red.400/0)] hover:shadow-[0_0_8px_theme(colors.red.400/30)]
                      dark:shadow-[0_0_8px_theme(colors.red.500/0)] dark:hover:shadow-[0_0_8px_theme(colors.red.500/20)]
                      backdrop-blur-sm
                      group
                      transform hover:scale-105 active:scale-95
                      transition-all duration-200"
                  >
                    <i className="fas fa-trash text-red-600 dark:text-red-400
                      group-hover:text-red-700 dark:group-hover:text-red-300
                      drop-shadow-[0_0_2px_theme(colors.red.400/0)] 
                      group-hover:drop-shadow-[0_0_2px_theme(colors.red.400/50)]" />
                  </button>
              </div>
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
};

export default OrderTableBody;
