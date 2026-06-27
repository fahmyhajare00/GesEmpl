import React, { useState } from 'react';

import { Link, Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-50 transition-colors duration-200">
      {/* Top Navbar */}
      <header className="flex justify-between items-center h-[70px] bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 z-10 shadow-sm dark:bg-slate-900/95 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg font-extrabold text-white bg-gradient-to-br from-sky-500 to-sky-700 shadow-sm">G</div>
          <span className="font-extrabold text-[1.15rem] tracking-wider text-slate-800 dark:text-slate-50">GESEMPL</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="mr-4 bg-transparent border-none text-[1.2rem] cursor-pointer"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Basculer le thème"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <div className="text-right">
            <div className="font-bold text-[0.9rem] text-slate-800 dark:text-slate-50">MED Med</div>
            <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">CHEF DE PÔLE</div>
          </div>
          <div className="flex items-center justify-center w-[38px] h-[38px] rounded-full font-bold text-white bg-gradient-to-br from-slate-300 to-slate-400 border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform dark:border-slate-800">M</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`flex flex-col bg-slate-800 text-slate-400 overflow-y-auto border-r border-slate-700 overflow-x-hidden transition-all duration-300 dark:bg-slate-900 ${isSidebarOpen ? 'w-[260px]' : 'w-[84px]'}`}>
          <div className={`flex items-center p-6 border-b border-white/5 transition-all duration-300 ${isSidebarOpen ? 'gap-3.5' : 'flex-col gap-5 py-5'}`}>
            <div className="flex items-center justify-center w-9 h-9 rounded-lg font-extrabold text-white bg-gradient-to-br from-sky-500 to-sky-700 shadow-sm shrink-0">G</div>
            <span className={`font-extrabold text-[1.15rem] tracking-wider text-white ${!isSidebarOpen ? 'hidden' : ''}`}>GESEMPL</span>
            <button 
              className={`bg-transparent border-none text-slate-300 text-[1.2rem] cursor-pointer p-1 transition-colors hover:text-white shrink-0 ${isSidebarOpen ? 'ml-auto' : ''}`}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              ☰
            </button>
          </div>

          <nav className="flex flex-col gap-7 py-6">
            <div className="flex flex-col">
              <div className={`text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest px-6 mb-2.5 ${!isSidebarOpen ? 'hidden' : ''}`}>PLANNING</div>
              <Link to="/" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-sky-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${window.location.pathname === '/' ? 'text-white border-sky-500/50 bg-white/5' : ''}`}>
                <span className={`text-[1.2rem] opacity-80 transition-opacity hover:opacity-100 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>📅</span>
                <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Emploi du temps</span>
              </Link>
            </div>

            <div className="flex flex-col">
              <div className={`text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest px-6 mb-2.5 ${!isSidebarOpen ? 'hidden' : ''}`}>RESSOURCES</div>
                <Link to="/groupes" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-sky-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'}`}>
                  <span className={`text-[1.2rem] opacity-80 transition-opacity hover:opacity-100 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>👥</span>
                  <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Groupes / Filières</span>
                </Link>

                <Link to="/salles" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-sky-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'}`}>
                  <span className={`text-[1.2rem] opacity-80 transition-opacity hover:opacity-100 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>🏫</span>
                  <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Salles / Espaces</span>
                </Link>

                <Link to="/formateurs" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-sky-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'}`}>
                  <span className={`text-[1.2rem] opacity-80 transition-opacity hover:opacity-100 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>👤</span>
                  <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Formateurs</span>
                </Link>

                <Link to="/modules" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-sky-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'}`}>
                  <span className={`text-[1.2rem] opacity-80 transition-opacity hover:opacity-100 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>📚</span>
                  <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Modules</span>
                </Link> 
            </div>

            <div className="flex flex-col">
              <div className={`text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest px-6 mb-2.5 ${!isSidebarOpen ? 'hidden' : ''}`}>GESTION</div>
              <a href="#" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-sky-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'}`}>
                <span className={`text-[1.2rem] opacity-80 transition-opacity hover:opacity-100 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>📋</span>
                <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Affectations</span>
              </a>
              <a href="#" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-sky-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'}`}>
                <span className={`text-[1.2rem] opacity-80 transition-opacity hover:opacity-100 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>⬇️</span>
                <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Exports</span>
              </a>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-slate-100 p-5 overflow-y-auto dark:bg-slate-900 transition-colors duration-200">
          <Outlet />
       </main>
      </div>
    </div>
  );
};

export default Layout;
