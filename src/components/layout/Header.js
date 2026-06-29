import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiBell, FiCheck, FiX, FiClock, FiInfo } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

// Notifications mockées
const mockNotifications = [
  {
    id: 1,
    type: 'info',
    title: 'Nouvelle séance ajoutée',
    message: 'Une séance de "Algorithmique" a été planifiée pour Lundi 8h30.',
    time: 'Il y a 5 min',
    read: false,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Modification en attente',
    message: 'Votre modification de la séance de Vendredi est en attente de validation.',
    time: 'Il y a 30 min',
    read: false,
  },
  {
    id: 3,
    type: 'success',
    title: 'Séance validée',
    message: 'La séance "Développement Web" de Mardi a été validée par le chef de pôle.',
    time: 'Il y a 2h',
    read: true,
  },
];

const Header = ({ onMenuToggle }) => {
  const { isDark, toggleTheme } = useTheme();
  const currentUser = { id: 1, prenom: 'Ahmed', nom: 'Benani' };

  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'success': return <FiCheck className="text-emerald-500" size={14} />;
      case 'warning': return <FiClock className="text-amber-500" size={14} />;
      default:        return <FiInfo className="text-sky-500" size={14} />;
    }
  };

  return (
    <header className="flex justify-between items-center h-[70px] bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 z-30 shadow-sm dark:bg-slate-900/95 dark:border-slate-800 sticky top-0 transition-colors duration-200">
      {/* Gauche : hamburger + titre */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="bg-transparent border-none text-slate-500 dark:text-slate-300 text-[1.2rem] cursor-pointer p-1 hover:text-slate-800 dark:hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          <FiMenu size={22} />
        </button>
      </div>

      {/* Droite : dark mode + notifs + user */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          className="bg-transparent border-none text-[1.2rem] cursor-pointer text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-yellow-300 transition-colors p-1"
          onClick={toggleTheme}
          title="Basculer le thème"
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative bg-transparent border-none text-slate-500 dark:text-slate-300 cursor-pointer p-1 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <FiBell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 font-medium">
                    Tout marquer comme lu
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-slate-400 text-sm">Aucune notification</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-slate-50 dark:border-slate-700/50 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!notif.read ? 'bg-sky-50/50 dark:bg-sky-900/20' : ''}`}
                    >
                      <div className="mt-0.5 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                        {getNotifIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm ${!notif.read ? 'font-semibold text-slate-800 dark:text-slate-100' : 'font-medium text-slate-600 dark:text-slate-300'}`}>
                            {notif.title}
                          </p>
                          {!notif.read && <span className="w-2 h-2 bg-sky-500 rounded-full flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{notif.time}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }}
                        className="text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition p-0.5 mt-0.5"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Séparateur */}
        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />

        {/* User info */}
        <div className="text-right">
          <div className="font-bold text-[0.9rem] text-slate-800 dark:text-slate-50">
            {currentUser.prenom} {currentUser.nom}
          </div>
          <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
            FORMATEUR
          </div>
        </div>
        <div className="flex items-center justify-center w-[38px] h-[38px] rounded-full font-bold text-white bg-gradient-to-br from-sky-400 to-sky-600 border-2 border-white dark:border-slate-800 shadow-sm cursor-pointer hover:scale-105 transition-transform">
          {currentUser.prenom[0]}
        </div>
      </div>
    </header>
  );
};

export default Header;
