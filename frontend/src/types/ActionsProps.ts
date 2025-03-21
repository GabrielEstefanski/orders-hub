export interface OrderActionsProps {
  orderId: string;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}