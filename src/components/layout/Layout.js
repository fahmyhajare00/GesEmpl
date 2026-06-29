import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleMobileSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleSidebarCollapse = () => setSidebarCollapsed((prev) => !prev);

  const handleMenuToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebarCollapse();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-50 transition-colors duration-200">
      {/* Header fixe en haut */}
      <Header onMenuToggle={handleMenuToggle} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onToggle={toggleMobileSidebar}
          onCollapse={toggleSidebarCollapse}
        />

        {/* Contenu principal */}
        <main
          className={`flex-1 bg-slate-100 dark:bg-slate-900 overflow-y-auto transition-all duration-300 ${
            sidebarCollapsed ? 'lg:ml-[84px]' : 'lg:ml-[260px]'
          }`}
        >
          <div className="p-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
