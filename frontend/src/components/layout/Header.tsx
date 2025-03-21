import { useTheme } from "../../context/ThemeProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { startConnection, stopConnection, subscribeToNotifications } from "../../services/signalr";
import Tooltip from "../tooltip";
import NotificationsTooltip from "../tooltip/NotificationsTooltip";
import { useUser } from "../../hooks/useUser";
import { OrderStatus } from '../../types/OrderStatus';

interface HeaderProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const Header = ({ toggleSidebar, isCollapsed }: HeaderProps) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useUser();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeSignalR = async () => {
      try {
        await startConnection();
        setIsConnected(true);

        subscribeToNotifications((update: any) => {
          if (update.actionType === 'OrderUpdated') {
            const newNotification: Notification = {
              id: update.order.id,
              message: `Pedido ${update.order.produto} atualizado para ${OrderStatus[update.order.status]}`,
              timestamp: new Date(),
              read: false
            };

            setNotifications(prev => [newNotification, ...prev].slice(0, 5));
          }
        });
      } catch (error) {
        console.error('Erro ao conectar com SignalR:', error);
        setIsConnected(false);
      }
    };

    initializeSignalR();

    return () => {
      stopConnection();
      setIsConnected(false);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className={`w-full px-6 py-4 transition-all duration-300 ease-in-out fixed top-0 left-0 z-[100] 
      backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20
      ${isCollapsed 
        ? 'bg-white/60 dark:bg-gray-900/60' 
        : 'bg-white/65 dark:bg-gray-900/65'
      } 
      before:absolute before:inset-0 before:z-[-1] 
      before:bg-gradient-to-r before:from-blue-500/5 before:via-purple-500/5 before:to-pink-500/5
      dark:before:from-blue-500/[0.03] dark:before:via-purple-500/[0.03] dark:before:to-pink-500/[0.03]
      shadow-[0_0_15px_theme(colors.blue.400/10)]
      dark:shadow-[0_0_15px_theme(colors.blue.500/5)]`}
    >
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-80 group-hover:opacity-75 transition duration-200" />
            <img
              src="/icon.png"
              alt="Logo icone"
              className="relative w-12 h-12 rounded-full border-2 border-white/50 dark:border-gray-800/50 transform group-hover:scale-105 transition duration-200"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-semibold md:text-2xl lg:text-3xl 
              bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 dark:from-white dark:via-gray-200 dark:to-gray-300
              bg-clip-text text-transparent">
              Orders Hub
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Sistema Online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 px-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <NotificationsTooltip
                  notifications={notifications}
                  unreadCount={unreadCount}
                  isConnected={isConnected}
                  onMarkAsRead={markAsRead}
                >
                  <button className={`p-2.5 w-10 h-10 flex items-center justify-center rounded-full
                    bg-gradient-to-r from-blue-500/10 to-purple-500/10
                    dark:from-blue-500/[0.15] dark:to-purple-500/[0.15]
                    border border-blue-500/20 dark:border-blue-400/20
                    shadow-[0_0_15px_theme(colors.blue.400/15)]
                    dark:shadow-[0_0_15px_theme(colors.blue.500/10)]
                    hover:shadow-[0_0_20px_theme(colors.blue.400/25)]
                    dark:hover:shadow-[0_0_20px_theme(colors.blue.500/20)]
                    backdrop-blur-md
                    transform hover:scale-105
                    transition-all duration-200
                    relative
                    ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!isConnected}
                  >
                    <i className={`fa fa-bell text-lg
                      ${isConnected 
                        ? 'text-gray-700 dark:text-gray-200' 
                        : 'text-gray-400 dark:text-gray-600'}`} />
                    {isConnected && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center
                        bg-gradient-to-r from-red-500 to-pink-500
                        text-white text-xs font-bold rounded-full
                        shadow-[0_0_8px_theme(colors.red.500/50)]
                        border border-white/50 dark:border-gray-800/50
                        animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </NotificationsTooltip>
              </div>

              <Tooltip 
                content="Alternar tema" 
                position="bottom"
                clickable={false}
              >
                <button
                  onClick={toggleTheme}
                  className="p-2.5 w-10 h-10 flex items-center justify-center rounded-full
                    bg-gradient-to-r from-blue-500/10 to-purple-500/10
                    dark:from-blue-500/[0.15] dark:to-purple-500/[0.15]
                    border border-blue-500/20 dark:border-blue-400/20
                    shadow-[0_0_15px_theme(colors.blue.400/15)]
                    dark:shadow-[0_0_15px_theme(colors.blue.500/10)]
                    hover:shadow-[0_0_20px_theme(colors.blue.400/25)]
                    dark:hover:shadow-[0_0_20px_theme(colors.blue.500/20)]
                    backdrop-blur-md
                    transform hover:scale-105
                    transition-all duration-200"
                >
                  {isDarkMode ? (
                    <i className="fa fa-sun text-amber-400 text-lg
                      drop-shadow-[0_0_4px_theme(colors.amber.400/70)]" />
                  ) : (
                    <i className="fa fa-moon text-blue-600 text-lg
                      drop-shadow-[0_0_4px_theme(colors.blue.400/70)]" />
                  )}
                </button>
              </Tooltip>

              <Tooltip 
                content="Acessar perfil" 
                position="bottom"
                clickable={false}
              >
                <div className="relative group">
                  <button 
                    onClick={handleProfileClick}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                      rounded-full blur opacity-40 group-hover:opacity-75 group-hover:scale-110 transition duration-300" />
                    <img
                      src={user?.profilePhoto || 'https://github.com/shadcn.png'}
                      alt={`Foto do usuário ${user?.name || 'Não identificado'}`}
                      className="relative w-10 h-10 rounded-full 
                        border-2 border-white/50 dark:border-gray-800/50 
                        transform group-hover:scale-105 transition duration-300
                        shadow-[0_0_10px_theme(colors.blue.400/30)]
                        dark:shadow-[0_0_10px_theme(colors.blue.500/20)]
                        object-cover"
                      onError={(e) => {
                        console.error('Erro ao carregar imagem de perfil:', e);
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://github.com/shadcn.png';
                      }}
                    />
                  </button>
                </div>
              </Tooltip>
            </div>
          </div>

          <div className="sm:hidden flex items-center gap-3">
            <NotificationsTooltip
              notifications={notifications}
              unreadCount={unreadCount}
              isConnected={isConnected}
              onMarkAsRead={markAsRead}
            >
              <button className={`p-2 w-9 h-9 flex items-center justify-center rounded-full
                bg-gradient-to-r from-blue-500/10 to-purple-500/10
                dark:from-blue-500/[0.15] dark:to-purple-500/[0.15]
                border border-blue-500/20 dark:border-blue-400/20
                shadow-[0_0_15px_theme(colors.blue.400/15)]
                dark:shadow-[0_0_15px_theme(colors.blue.500/10)]
                relative ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isConnected}
              >
                <i className={`fa fa-bell text-base
                  ${isConnected 
                    ? 'text-gray-700 dark:text-gray-200' 
                    : 'text-gray-400 dark:text-gray-600'}`} />
                {isConnected && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center
                    bg-gradient-to-r from-red-500 to-pink-500
                    text-white text-xs font-bold rounded-full
                    shadow-[0_0_8px_theme(colors.red.500/50)]
                    border border-white/50 dark:border-gray-800/50">
                    {unreadCount}
                  </span>
                )}
              </button>
            </NotificationsTooltip>

            <Tooltip 
              content="Alternar tema" 
              position="bottom"
              clickable={true}
            >
              <button
                onClick={toggleTheme}
                className="p-2 w-9 h-9 flex items-center justify-center rounded-full
                  bg-gradient-to-r from-blue-500/10 to-purple-500/10
                  dark:from-blue-500/[0.15] dark:to-purple-500/[0.15]
                  border border-blue-500/20 dark:border-blue-400/20
                  shadow-[0_0_15px_theme(colors.blue.400/15)]
                  dark:shadow-[0_0_15px_theme(colors.blue.500/10)]"
              >
                {isDarkMode ? (
                  <i className="fa fa-sun text-amber-400 text-base" />
                ) : (
                  <i className="fa fa-moon text-blue-600 text-base" />
                )}
              </button>
            </Tooltip>

            <button 
              className="p-2 w-9 h-9 flex items-center justify-center rounded-full
                bg-gradient-to-r from-blue-500/10 to-purple-500/10
                dark:from-blue-500/[0.15] dark:to-purple-500/[0.15]
                border border-blue-500/20 dark:border-blue-400/20
                shadow-[0_0_15px_theme(colors.blue.400/15)]
                dark:shadow-[0_0_15px_theme(colors.blue.500/10)]"
              onClick={toggleSidebar}
            >
              <i className="fa fa-bars text-gray-700 dark:text-gray-300 text-base" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;