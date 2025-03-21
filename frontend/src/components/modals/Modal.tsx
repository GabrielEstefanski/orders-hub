import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[2px]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                duration: 0.25,
                bounce: 0.15
              }
            }}
            exit={{ 
              opacity: 0,
              y: 20,
              scale: 0.95,
              transition: {
                duration: 0.15
              }
            }}
            className="relative w-full max-w-2xl z-10"
          >
            <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-2xl 
              border border-gray-200/50 dark:border-gray-700/50 p-6 w-full max-w-md mx-auto
              overflow-hidden transition-colors duration-200">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50" />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-700 
                  dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50
                  transition-all duration-200 group"
              >
                <i className="fa fa-times text-lg transform group-hover:rotate-90 transition-transform duration-200" />
              </button>

              {title && (
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white pr-8 
                  border-b border-gray-200/50 dark:border-gray-700/50 pb-4">
                  {title}
                </h2>
              )}

              <div className={`${title ? 'mt-6' : 'mt-2'} text-gray-700 dark:text-gray-200`}>
                {children}
              </div>

              {footer && (
                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
