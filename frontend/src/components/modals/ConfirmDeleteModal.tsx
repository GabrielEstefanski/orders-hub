import Modal from "./Modal";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Exclusão"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
          >
            Excluir
          </button>
        </>
      }
    >
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Tem certeza que deseja excluir este pedido? Essa ação não pode ser desfeita.
      </p>
    </Modal>
  );
};

export default ConfirmDeleteModal;
