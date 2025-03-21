import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import Tooltip from '../tooltip';
import { sidebarLinks } from '../../utils/sidebarItems';
import { useUser } from '../../hooks/useUser';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps) => {
  const { accessToken } = useAuth();
  const [_isAuthenticated, setIsAuthenticated] = useState(!!accessToken);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    setIsAuthenticated(!!accessToken);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '[') {
        toggleSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [accessToken, toggleSidebar]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/auth/login");
  };

  return (
    <>
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed left-0 z-40 top-[var(--header-height)] 
          bg-white/80 dark:bg-gray-900/80
          border-r border-gray-200/20 dark:border-gray-800/20
          shadow-[0_0_15px_theme(colors.blue.400/10)]
          dark:shadow-[0_0_15px_theme(colors.blue.500/5)]
          backdrop-blur-md
          text-gray-700 dark:text-gray-100 
          transition-all duration-300 ease-in-out 
          ${isCollapsed ? 'md:w-16' : 'md:w-64'} 
          ${isCollapsed ? 'hidden md:flex' : 'flex'} 
          flex-col group`} 
        style={{ height: 'calc(100vh - var(--header-height))', marginTop: 0 }}
      >
        <div className="relative h-0">
          <button
            className={`absolute -right-3 top-6 z-50 w-6 h-6 
              rounded-full bg-white/90 dark:bg-gray-800/90
              border border-gray-200/30 dark:border-gray-700/30 
              shadow-md hover:shadow-lg
              flex items-center justify-center
              transform hover:scale-105
              transition-all duration-200 
              opacity-0 md:opacity-100`}
            onClick={toggleSidebar}
          >
            <i className={`fa ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} 
              text-gray-600 dark:text-gray-300 text-xs`} 
              aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
            />
          </button>
        </div>

        <div className="md:hidden p-4 pt-[calc(var(--header-height)-1rem)] border-b border-gray-200/20 dark:border-gray-800/20">
          <div className="flex items-center gap-3">
            <img
              src={user?.profilePhoto || "https://github.com/shadcn.png"}
              alt={`Foto do usuário ${user?.name || 'Não identificado'}`}
              className="w-10 h-10 rounded-full border-2 border-white/50 dark:border-gray-800/50 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://github.com/shadcn.png";
              }}
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{user?.name || "Usuário"}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email || "email@exemplo.com"}</div>
            </div>
          </div>
        </div>

        <ul className="flex-1 mt-16 md:mt-16 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {sidebarLinks.map((link, index) => (
            <div key={index}>
              {isCollapsed ? (
                <li
                  className="flex items-center p-3 rounded-xl
                    bg-transparent hover:bg-gray-100/30 dark:hover:bg-gray-800/30
                    group/item cursor-pointer relative
                    before:absolute before:inset-0 before:z-[-1] before:rounded-xl
                    before:bg-gradient-to-r before:from-blue-500/0 before:to-purple-500/0
                    hover:before:from-blue-500/10 hover:before:to-purple-500/10
                    dark:hover:before:from-blue-500/[0.05] dark:hover:before:to-purple-500/[0.05]
                    hover:shadow-[0_0_10px_theme(colors.blue.400/20)]
                    dark:hover:shadow-[0_0_10px_theme(colors.blue.500/10)]
                    transition-all duration-200"
                  onClick={() => navigate(link.to)}
                  data-tooltip-id="sidebar-tooltip"
                  data-tooltip-content={link.label}
                >
                  <i className={`fa ${link.icon} text-gray-500 dark:text-gray-400
                    group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400
                    group-hover/item:drop-shadow-[0_0_3px_theme(colors.blue.400/50)]
                    transition-all duration-200 text-lg`} />
                </li>
              ) : (
                <li
                  className="flex items-center p-3 rounded-xl
                    bg-transparent hover:bg-gray-100/30 dark:hover:bg-gray-800/30
                    group/item cursor-pointer relative
                    before:absolute before:inset-0 before:z-[-1] before:rounded-xl
                    before:bg-gradient-to-r before:from-blue-500/0 before:to-purple-500/0
                    hover:before:from-blue-500/10 hover:before:to-purple-500/10
                    dark:hover:before:from-blue-500/[0.05] dark:hover:before:to-purple-500/[0.05]
                    hover:shadow-[0_0_10px_theme(colors.blue.400/20)]
                    dark:hover:shadow-[0_0_10px_theme(colors.blue.500/10)]
                    transition-all duration-200"
                  onClick={() => navigate(link.to)}
                >
                  <i className={`fa ${link.icon} text-gray-500 dark:text-gray-400
                    group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400
                    group-hover/item:drop-shadow-[0_0_3px_theme(colors.blue.400/50)]
                    transition-all duration-200 text-lg`} />
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300
                    group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400
                    group-hover/item:drop-shadow-[0_0_2px_theme(colors.blue.400/30)]">
                    {link.label}
                  </span>
                </li>
              )}
            </div>
          ))}
        </ul>

        <div className="px-3 py-4 border-t border-gray-200/20 dark:border-gray-800/20">
          {isCollapsed ? (
            <div className="list-none">
              <Tooltip content="Sair" position="right">
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center justify-center p-3 rounded-xl
                    hover:bg-red-50/30 dark:hover:bg-red-900/20
                    group/logout cursor-pointer relative
                    before:absolute before:inset-0 before:z-[-1] before:rounded-xl
                    before:bg-gradient-to-r before:from-red-500/0 before:to-pink-500/0
                    hover:before:from-red-500/10 hover:before:to-pink-500/10
                    dark:hover:before:from-red-500/[0.05] dark:hover:before:to-pink-500/[0.05]
                    hover:shadow-[0_0_10px_theme(colors.red.400/20)]
                    dark:hover:shadow-[0_0_10px_theme(colors.red.500/10)]
                    transition-all duration-200"
                >
                  <i className="fa fa-sign-out-alt text-gray-500 dark:text-gray-400
                    group-hover/logout:text-red-500 dark:group-hover/logout:text-red-400
                    group-hover/logout:drop-shadow-[0_0_3px_theme(colors.red.400/50)]
                    transition-all duration-200 text-lg" />
                </button>
              </Tooltip>
            </div>
          ) : (
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center p-3 rounded-xl
                hover:bg-red-50/30 dark:hover:bg-red-900/20
                group/logout cursor-pointer relative
                before:absolute before:inset-0 before:z-[-1] before:rounded-xl
                before:bg-gradient-to-r before:from-red-500/0 before:to-pink-500/0
                hover:before:from-red-500/10 hover:before:to-pink-500/10
                dark:hover:before:from-red-500/[0.05] dark:hover:before:to-pink-500/[0.05]
                hover:shadow-[0_0_10px_theme(colors.red.400/20)]
                dark:hover:shadow-[0_0_10px_theme(colors.red.500/10)]
                transition-all duration-200"
            >
              <i className="fa fa-sign-out-alt text-gray-500 dark:text-gray-400
                group-hover/logout:text-red-500 dark:group-hover/logout:text-red-400
                group-hover/logout:drop-shadow-[0_0_3px_theme(colors.red.400/50)]
                transition-all duration-200 text-lg" />
              <span className="ml-3 font-medium text-gray-700 dark:text-gray-300
                group-hover/logout:text-red-500 dark:group-hover/logout:text-red-400
                group-hover/logout:drop-shadow-[0_0_2px_theme(colors.red.400/30)]">
                Sair
              </span>
            </button>
          )}
        </div>
      </div>

      <div id="sidebar-tooltip" 
        className="!bg-gray-800/90 !text-white !px-3 !py-2 !rounded-lg !text-sm !font-medium
          !shadow-lg !border !border-gray-700/30 !backdrop-blur-sm
          !shadow-[0_0_10px_theme(colors.gray.800/30)]"
        role="tooltip"
      />
    </>
  );
};

export default Sidebar;