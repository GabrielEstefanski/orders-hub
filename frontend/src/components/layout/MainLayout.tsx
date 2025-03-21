import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useState } from "react";

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';
  const isPerformancePage = location.pathname === '/performance';

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); 
  };

  return (
    <div className={`min-h-screen ${
      isAboutPage || isPerformancePage
        ? 'bg-white dark:bg-gray-900'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900' 
    }`}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
  
      <div className={`flex-1 flex flex-col min-h-screen
        ${isCollapsed ? 'md:pl-16' : 'md:pl-64'} 
        transition-all duration-300 ease-in-out`}
      >
        <Header toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
        
        <main className="flex-1 pt-[calc(var(--header-height)+2rem)] pb-20">
          <div className="max-w-8xl mx-auto w-full p-4 lg:p-8">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;