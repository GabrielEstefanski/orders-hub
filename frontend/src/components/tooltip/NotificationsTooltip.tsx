import React, { useState } from 'react';
import Tooltip from '.';

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsTooltipProps {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  onMarkAsRead: (id: string) => void;
  children: React.ReactNode;
}

const NotificationsTooltip: React.FC<NotificationsTooltipProps> = ({
  notifications,
  onMarkAsRead,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (id: string) => {
    onMarkAsRead(id);
    if (window.innerWidth < 768) {
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  const tooltipContent = (
    <div className="w-full sm:w-80 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
      <div className="text-sm font-medium p-3 border-b border-white/10 dark:border-gray-700/10
        bg-gradient-to-r from-blue-600/60 to-purple-600/60
        dark:from-blue-500/60 dark:to-purple-500/60
        text-white backdrop-blur-md rounded-t-lg flex justify-between items-center">
        <span>Notificações</span>
        <button 
          onClick={() => setIsOpen(false)} 
          className="text-white/70 hover:text-white transition-colors p-1 rounded-full"
        >
          <i className="fas fa-times text-xs"></i>
        </button>
      </div>
      <div className="p-2 rounded-b-lg">
        {notifications.length === 0 ? (
          <div className="text-sm text-gray-700 dark:text-gray-300 p-3
            flex items-center justify-center gap-2
            bg-white/10 dark:bg-gray-800/10 rounded-lg border border-white/10 dark:border-gray-700/10">
            <i className="fas fa-bell-slash"></i>
            Nenhuma notificação
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
              className={`p-3 rounded-xl mb-2 cursor-pointer
                border border-white/20 dark:border-gray-700/20
                transition-all duration-200
                ${notification.read 
                  ? 'bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-700/30' 
                  : 'bg-blue-500/20 dark:bg-blue-400/20 hover:bg-blue-500/30 dark:hover:bg-blue-400/30'
                }
                backdrop-blur-md
                hover:shadow-lg active:scale-[0.98]`}
            >
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {notification.message}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(notification.timestamp).toLocaleTimeString('pt-BR')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <Tooltip 
      content={tooltipContent} 
      position="bottom"
      transparent={true}
      isOpen={isOpen}
      onToggle={setIsOpen}
      clickable={true}
    >
      {children}
    </Tooltip>
  );
};

export default NotificationsTooltip;