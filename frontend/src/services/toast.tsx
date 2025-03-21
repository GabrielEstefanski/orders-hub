import { JSX } from 'react';
import { toast, ToastOptions } from 'react-toastify';

interface CustomToastConfig {
  icon?: string;
  title?: string;
  message: string;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  autoClose?: number | false;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
}

interface ToastContentProps {
  title?: string;
  message: string;
  icon: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const defaultConfig: ToastOptions = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'colored',
} as const;

const ToastContent = ({ title, message, icon, type }: ToastContentProps): JSX.Element => (
  <div className="flex items-start gap-3 min-w-[300px] p-3">
    <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full
      ${type === 'success' ? 'bg-green-100'
        : type === 'error' ? 'bg-red-100'
        : type === 'info' ? 'bg-blue-100'
        : 'bg-yellow-100'}`}
    >
      <i className={`fa ${icon} text-base
        ${type === 'success' ? 'text-green-600'
        : type === 'error' ? 'text-red-600'
        : type === 'info' ? 'text-blue-600'
        : 'text-yellow-600'}`} />
    </span>
    <div className="flex-1 pt-1">
      {title && (
        <h4 className="font-semibold text-[0.925rem] mb-1 text-gray-900">{title}</h4>
      )}
      <p className="text-[0.875rem] text-gray-700 leading-relaxed">{message}</p>
    </div>
  </div>
);

const baseToastStyle = `
  !rounded-lg !overflow-hidden
  !bg-white
  !shadow-lg !shadow-black/5
  !border !border-gray-100
  !text-gray-800
  !p-0
  [&_.Toastify__close-button]:!text-gray-400
  [&_.Toastify__close-button:hover]:!text-gray-600
  [&_.Toastify__close-button]:!self-start
  [&_.Toastify__close-button]:!mt-3
  [&_.Toastify__close-button]:!mr-2
  [&_.Toastify__toast-body]:!p-0
  [&_.Toastify__progress-bar-container]:!overflow-hidden
  [&_.Toastify__progress-bar-container]:!rounded-b-lg
  [&_.Toastify__progress-bar]:!shadow-none
`;

const success = ({ message, title, icon = 'fa-check', ...config }: CustomToastConfig): void => {
  toast.success(
    <ToastContent title={title} message={message} icon={icon} type="success" />,
    {
      ...defaultConfig,
      ...config,
      className: `${baseToastStyle}`,
      progressClassName: `!h-1.5 !bg-green-500/20
        [&::-webkit-progress-bar]:!bg-transparent
        [&::-webkit-progress-value]:!bg-green-500`,
      icon: false,
    }
  );
};

const error = ({ message, title, icon = 'fa-xmark', ...config }: CustomToastConfig): void => {
  toast.error(
    <ToastContent title={title} message={message} icon={icon} type="error" />,
    {
      ...defaultConfig,
      ...config,
      className: `${baseToastStyle}`,
      progressClassName: `!h-1.5 !bg-red-500/20
        [&::-webkit-progress-bar]:!bg-transparent
        [&::-webkit-progress-value]:!bg-red-500`,
      icon: false,
    }
  );
};

const info = ({ message, title, icon = 'fa-circle-info', ...config }: CustomToastConfig): void => {
  toast.info(
    <ToastContent title={title} message={message} icon={icon} type="info" />,
    {
      ...defaultConfig,
      ...config,
      className: `${baseToastStyle}`,
      progressClassName: `!h-1.5 !bg-blue-500/20
        [&::-webkit-progress-bar]:!bg-transparent
        [&::-webkit-progress-value]:!bg-blue-500`,
      icon: false,
    }
  );
};

const warning = ({ message, title, icon = 'fa-triangle-exclamation', ...config }: CustomToastConfig): void => {
  toast.warning(
    <ToastContent title={title} message={message} icon={icon} type="warning" />,
    {
      ...defaultConfig,
      ...config,
      className: `${baseToastStyle}`,
      progressClassName: `!h-1.5 !bg-yellow-500/20
        [&::-webkit-progress-bar]:!bg-transparent
        [&::-webkit-progress-value]:!bg-yellow-500`,
      icon: false,
    }
  );
};

export const toastService = {
  success,
  error,
  info,
  warning,
} as const; 