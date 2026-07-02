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

  const [showNotifications, setShowNotifications] = useState(false);

  // Notifications dynamiques en fonction du rôle
  const initialNotifications = role === 'chef_de_pole' ? [
    {
      id: 1,
      type: 'warning',
      title: 'Ajout de séance proposé',
      message: 'Le formateur Ahmed a proposé d\'ajouter une séance de "React" Lundi à 8h30.',
      time: 'Il y a 10 min',
      read: false,
      actionRequired: true
    },
    {
      id: 2,
      type: 'warning',
      title: 'Modification de séance proposée',
      message: 'Le formateur Ahmed demande de décaler la séance de "Laravel" au Vendredi.',
      time: 'Il y a 30 min',
      read: false,
      actionRequired: true
    },
    {
      id: 3,
      type: 'info',
      title: 'Suppression refusée',
      message: 'Vous avez refusé la suppression de la séance "Algorithmique".',
      time: 'Il y a 2h',
      read: true,
      actionRequired: false
    }
  ] : [
    {
      id: 1,
      type: 'info',
      title: 'Nouvelle séance ajoutée',
      message: 'Une séance de "Algorithmique" a été planifiée pour Lundi 8h30.',
      time: 'Il y a 5 min',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Modification en attente',
      message: 'Votre modification de la séance de Vendredi est en attente de validation.',
      time: 'Il y a 30 min',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Séance validée',
      message: 'La séance "Développement Web" de Mardi a été validée par le chef de pôle.',
      time: 'Il y a 2h',
      read: true
    }
  ];

  const [notificationsList, setNotificationsList] = useState(initialNotifications);

  const handleValidation = (id, action) => {
    // Action dynamique pour valider ou refuser (action: 'validate' | 'refuse')
    setNotificationsList(prev => prev.map(notif => {
      if (notif.id === id) {
        return { 
          ...notif, 
          actionRequired: false, 
          type: action === 'validate' ? 'success' : 'info',
          title: action === 'validate' ? 'Demande validée' : 'Demande refusée',
          message: `Vous avez ${action === 'validate' ? 'validé' : 'refusé'} cette demande.`,
          read: true
        };
      }
      return notif;
    }));
  };

  const markAllAsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setNotificationsList(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notificationsList.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-50 transition-colors duration-200">
      {/* Top Navbar */}
      <header className="flex justify-between items-center h-[70px] bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 z-10 shadow-sm dark:bg-slate-900/95 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={onLogout} title="Changer de rôle">
          <img src="/cmc-logo.png" alt="CMC Logo" className="h-10 object-contain drop-shadow-sm" />
          <span className="font-extrabold text-[1.15rem] tracking-wider text-cyan-600 dark:text-cyan-400">GESEMPL</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="p-2 bg-transparent border-none text-[1.2rem] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer transition-colors"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Basculer le thème"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          
          {/* Notifications - Visible uniquement pour le formateur */}
          {role === 'formateur_user' && (
            <div className="relative">
              <button 
                className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[0.6rem] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Notifications */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-[380px] rounded-xl bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800 z-50 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-[1rem]">Notifications</h3>
                    <button 
                      onClick={markAllAsRead}
                      className="text-[0.8rem] text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 font-medium cursor-pointer"
                    >
                      Tout marquer comme lu
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                    {notificationsList.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">Aucune notification</div>
                    ) : notificationsList.map(notif => (
                      <div 
                        key={notif.id} 
                        onClick={() => markAsRead(notif.id)}
                        className={`group flex gap-4 border-b border-slate-50 p-5 hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/50 transition-colors relative cursor-pointer ${!notif.read ? 'bg-sky-50/50 dark:bg-sky-900/10' : ''}`}
                      >
                        <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          notif.type === 'info' ? 'bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400' :
                          notif.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' :
                          'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                        }`}>
                          {notif.type === 'info' && <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                          {notif.type === 'warning' && <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                          {notif.type === 'success' && <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-[0.9rem] text-slate-800 dark:text-slate-100 ${!notif.read ? 'font-bold' : 'font-semibold'}`}>{notif.title}</h4>
                            {!notif.read && <span className="h-2 w-2 rounded-full bg-sky-500"></span>}
                          </div>
                          <p className="mt-1.5 text-[0.85rem] text-slate-500 dark:text-slate-400 leading-snug">{notif.message}</p>
                          <span className="mt-2 block text-[0.75rem] font-medium text-slate-400">{notif.time}</span>
                          {notif.actionRequired && role === 'chef_de_pole' && (
                            <div className="mt-3 flex gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleValidation(notif.id, 'validate'); }}
                                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[0.75rem] font-bold rounded-md transition-colors"
                              >
                                Valider
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleValidation(notif.id, 'refuse'); }}
                                className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-[0.75rem] font-bold rounded-md transition-colors"
                              >
                                Refuser
                              </button>
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={(e) => deleteNotification(notif.id, e)}
                          className="absolute top-4 right-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity hover:text-slate-500 dark:hover:text-slate-400"
                          title="Supprimer la notification"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="h-8 w-px bg-slate-200 mx-3 dark:bg-slate-700"></div>

          <div className="text-right mr-1">
            <div className="font-bold text-[0.95rem] text-slate-800 dark:text-slate-50 leading-tight">
              {role === 'formateur_user' ? 'Ahmed Benani' : 'MED Med'}
            </div>
            <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-slate-500">
              {roleDisplay[role]}
            </div>
          </div>
          <div className={`flex items-center justify-center w-[40px] h-[40px] rounded-full font-bold text-white shadow-sm cursor-pointer hover:scale-105 transition-transform dark:border-slate-800 border-2 border-white ${role === 'formateur_user' ? 'bg-blue-500 text-lg' : 'bg-gradient-to-br from-slate-300 to-slate-400'}`}>
            {role === 'formateur_user' ? 'A' : 'M'}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`flex flex-col bg-slate-800 text-slate-400 border-r border-slate-700 transition-all duration-300 dark:bg-slate-900 relative ${isSidebarOpen ? 'w-[260px]' : 'w-[84px]'} shrink-0 z-20`}>
          <div className={`flex items-center p-6 border-b border-white/5 transition-all duration-300 ${isSidebarOpen ? 'gap-3.5' : 'flex-col gap-5 py-5'}`}>
            <img src="/cmc-logo.png" alt="CMC Logo" className="h-9 object-contain drop-shadow-sm shrink-0 bg-white p-1 rounded-lg cursor-pointer hover:scale-105 transition-transform" onClick={onLogout} title="Changer de rôle" />
            <span className={`font-extrabold text-[1.15rem] tracking-wider text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors ${!isSidebarOpen ? 'hidden' : ''}`} onClick={onLogout} title="Changer de rôle">GESEMPL</span>
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
