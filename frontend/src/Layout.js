import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Layout = ({ role = 'chef_de_pole', onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { config } = useSelector(state => state.schedule) || { config: {} };
  const poles = config?.poles || [];
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('gesempl_darkmode') === 'true';
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('gesempl_darkmode', isDarkMode);
    } catch {}
  }, [isDarkMode]);

  // Map des rôles
  const roleDisplay = {
    'chef_de_pole': 'Chef de Pôle',
    'gestionnaire_stagiaire': 'Gestionnaire Stagiaire',
    'stagiaire': 'Stagiaire',
    'formateur_user': 'Formateur',
    'directeur_pedagogique': 'Directeur Pédagogique'
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-50 transition-colors duration-200">
      {/* Top Navbar */}
      <header className="flex justify-between items-center h-[70px] bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 z-10 shadow-sm dark:bg-slate-900/95 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={onLogout} title="Changer de rôle">
          <img src="/cmc-logo.png" alt="CMC Logo" className="h-10 object-contain drop-shadow-sm" />
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
            <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
              {roleDisplay[role]}
            </div>
          </div>
          <div className="flex items-center justify-center w-[38px] h-[38px] rounded-full font-bold text-white bg-gradient-to-br from-slate-300 to-slate-400 border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform dark:border-slate-800">M</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`flex flex-col bg-slate-800 text-slate-400 border-r border-slate-700 transition-all duration-300 dark:bg-slate-900 relative ${isSidebarOpen ? 'w-[260px]' : 'w-[84px]'} shrink-0 z-20`}>
          <div className={`flex items-center p-6 border-b border-white/5 transition-all duration-300 ${isSidebarOpen ? 'gap-3.5' : 'flex-col gap-5 py-5'}`}>
            <img src="/cmc-logo.png" alt="CMC Logo" className="h-9 object-contain drop-shadow-sm shrink-0 bg-white p-1 rounded-lg cursor-pointer hover:scale-105 transition-transform" onClick={onLogout} title="Changer de rôle" />
            <span className={`font-extrabold text-[1.15rem] tracking-wider text-white cursor-pointer hover:text-sky-300 transition-colors ${!isSidebarOpen ? 'hidden' : ''}`} onClick={onLogout} title="Changer de rôle">GESEMPL</span>
            <button 
              className={`bg-transparent border-none text-slate-300 text-[1.2rem] cursor-pointer p-1 transition-colors hover:text-white shrink-0 ${isSidebarOpen ? 'ml-auto' : ''}`}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              ☰
            </button>
          </div>

          {/* Menu Navigation */}
          <div className="flex-1 overflow-y-auto no-scrollbar py-6">
            <nav className="flex flex-col gap-7">

              {/* SECTION: GENERAL (Chef de pôle / Directeur) */}
              {(role === 'chef_de_pole' || role === 'directeur_pedagogique') && (
                <>
                  <div className="flex flex-col">
                    <div className={`text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest px-6 mb-2.5 ${!isSidebarOpen ? 'hidden' : ''}`}>TABLEAU DE BORD</div>
                    {role === 'directeur_pedagogique' && (
                      <Link to="/" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-amber-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${location.pathname === '/' ? 'text-white border-amber-500/50 bg-white/5' : ''}`}>
                        <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>D</span>
                        <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Vue d'ensemble</span>
                      </Link>
                    )}
                    
                    {role !== 'directeur_pedagogique' && (
                      <>
                        <div className={`text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest px-6 mb-2.5 mt-4 ${!isSidebarOpen ? 'hidden' : ''}`}>PLANNING</div>
                        <Link to="/" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-sky-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${location.pathname === '/' ? 'text-white border-sky-500/50 bg-white/5' : ''}`}>
                          <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>E</span>
                          <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Emploi du temps</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className={`text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest px-6 mb-2.5 ${!isSidebarOpen ? 'hidden' : ''}`}>RESSOURCES</div>
                    <Link to="/modules" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-sky-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${location.pathname === '/modules' ? 'text-white border-sky-500/50 bg-white/5' : ''}`}>
                      <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>M</span>
                      <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Modules</span>
                    </Link> 
                    <Link to="/formateurs" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-sky-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${location.pathname === '/formateurs' ? 'text-white border-sky-500/50 bg-white/5' : ''}`}>
                      <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>F</span>
                      <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Formateurs</span>
                    </Link> 
                    <Link to="/salles" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-sky-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${location.pathname === '/salles' ? 'text-white border-sky-500/50 bg-white/5' : ''}`}>
                      <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>S</span>
                      <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Salles</span>
                    </Link> 
                    <Link to="/groupes" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-sky-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${location.pathname === '/groupes' ? 'text-white border-sky-500/50 bg-white/5' : ''}`}>
                      <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>G</span>
                      <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Groupes</span>
                    </Link> 
                  </div>

                  <div className="flex flex-col">
                    <div className={`text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest px-6 mb-2.5 ${!isSidebarOpen ? 'hidden' : ''}`}>GESTION</div>
                    <a href="#" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-sky-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'}`}>
                      <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>A</span>
                      <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Affectations</span>
                    </a>
                    <a href="#" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-sky-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'}`}>
                      <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>E</span>
                      <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Exports</span>
                    </a>
                  </div>
                </>
              )}

              {role === 'gestionnaire_stagiaire' && (
                <>
                  <div className="flex flex-col">
                    <div className={`text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest px-6 mb-2.5 ${!isSidebarOpen ? 'hidden' : ''}`}>SÉLECTION DE PÔLE</div>
                    <Link to="/" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-emerald-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${location.search === '' && location.pathname === '/' ? 'text-white border-emerald-500/50 bg-white/5' : ''}`}>
                      <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>G</span>
                      <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Vue d'ensemble</span>
                    </Link>
                    {poles.map(poleItem => {
                      const poleStr = typeof poleItem === 'object' ? (poleItem.nom || poleItem.pole) : poleItem;
                      const isActive = location.search.includes(`pole=${encodeURIComponent(poleStr)}`);
                      return (
                        <Link 
                          key={poleStr} 
                          to={`/?pole=${encodeURIComponent(poleStr)}`} 
                          className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-emerald-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${isActive ? 'text-white border-emerald-500/50 bg-white/5' : ''}`}
                        >
                          <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>
                            {poleStr.charAt(0).toUpperCase()}
                          </span>
                          <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>{poleStr}</span>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="flex flex-col">
                    <div className={`text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest px-6 mb-2.5 ${!isSidebarOpen ? 'hidden' : ''}`}>SUIVI</div>
                    <Link to="/absences-formateurs" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-emerald-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${location.pathname === '/absences-formateurs' ? 'text-white border-emerald-500/50 bg-white/5' : ''}`}>
                      <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>A</span>
                      <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Absences Formateurs</span>
                    </Link>
                  </div>
                </>
              )}

              {/* SECTION: STAGIAIRE */}
              {role === 'stagiaire' && (
                <>
                  <div className="flex flex-col">
                    <div className={`text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest px-6 mb-2.5 ${!isSidebarOpen ? 'hidden' : ''}`}>MON ESPACE</div>
                    <Link to="/" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-rose-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${location.pathname === '/' ? 'text-white border-rose-500/50 bg-white/5' : ''}`}>
                      <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>E</span>
                      <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Emploi du temps</span>
                    </Link>
                    <Link to="/mes-modules" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-rose-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${location.pathname === '/mes-modules' ? 'text-white border-rose-500/50 bg-white/5' : ''}`}>
                      <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>M</span>
                      <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Mes Modules</span>
                    </Link>
                    <Link to="/vue-mensuelle" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-rose-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${location.pathname === '/vue-mensuelle' ? 'text-white border-rose-500/50 bg-white/5' : ''}`}>
                      <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>V</span>
                      <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Vue Mensuelle</span>
                    </Link>
                    <Link to="/mon-profil" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-rose-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${location.pathname === '/mon-profil' ? 'text-white border-rose-500/50 bg-white/5' : ''}`}>
                      <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>P</span>
                      <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Mon Profil</span>
                    </Link>
                  </div>
                </>
              )}

              {/* SECTION: FORMATEUR */}
              {role === 'formateur_user' && (
                <>
                  <div className="flex flex-col">
                    <div className={`text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest px-6 mb-2.5 ${!isSidebarOpen ? 'hidden' : ''}`}>MON ESPACE</div>
                    <Link to="/" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-indigo-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${location.pathname === '/' ? 'text-white border-indigo-500/50 bg-white/5' : ''}`}>
                      <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>E</span>
                      <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Mon Emploi du temps</span>
                    </Link>
                    <Link to="/emplois-groupes" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-indigo-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${location.pathname === '/emplois-groupes' ? 'text-white border-indigo-500/50 bg-white/5' : ''}`}>
                      <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>G</span>
                      <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Emplois groupes</span>
                    </Link>
                    <Link to="/absences-missions" className={`flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-indigo-500/50 ${isSidebarOpen ? 'px-6 gap-3.5' : 'px-3 justify-center'} ${location.pathname === '/absences-missions' ? 'text-white border-indigo-500/50 bg-white/5' : ''}`}>
                      <span className={`text-[1.2rem] font-black text-slate-400 opacity-90 transition-all hover:scale-110 ${!isSidebarOpen ? 'text-[1.4rem] m-0' : ''}`}>A</span>
                      <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Absences & Missions</span>
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>

          {/* Bouton de déconnexion (Bottom of Sidebar) */}
          <div className="p-4 border-t border-slate-700 shrink-0">
            <button 
              onClick={onLogout}
              className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-4 gap-3' : 'justify-center px-0'} py-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors font-medium text-sm`}
            >
              <span className={`text-lg font-bold ${!isSidebarOpen ? 'text-xl' : ''}`}>⏻</span>
              <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-slate-100 p-5 overflow-y-auto dark:bg-slate-900 transition-colors duration-200 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
