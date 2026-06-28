import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  // État d'ouverture/fermeture de la sidebar sur mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // État de collapse de la sidebar sur desktop
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => setSidebarOpen((prev) => !prev);

  // Toggle desktop collapse
  const toggleSidebarCollapse = () => setSidebarCollapsed((prev) => !prev);

  // Le bouton du header fait les deux selon la taille d'écran
  const handleMenuToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebarCollapse();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Barre latérale de navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onToggle={toggleMobileSidebar}
        onCollapse={toggleSidebarCollapse}
      />

      {/* Zone de contenu principal avec marge pour la sidebar sur desktop */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        }`}
      >
        {/* En-tête fixe en haut */}
        <Header onMenuToggle={handleMenuToggle} />

        {/* Contenu de la page enfant (via le routeur) */}
        <main className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
