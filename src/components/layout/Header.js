import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiMoon, FiSun, FiBell, FiCheck, FiX, FiClock, FiInfo } from 'react-icons/fi';
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
  {
    id: 4,
    type: 'info',
    title: 'Rappel',
    message: 'Vous avez une séance avec le groupe DEV201 demain à 13h30.',
    time: 'Il y a 5h',
    read: true,
  },
];

const Header = ({ onMenuToggle }) => {
  const { isDark, toggleTheme } = useTheme();
  // Fake user for the header since auth was removed
  const currentUser = { id: 1, prenom: 'Ahmed', nom: 'Benani' };

  // Notifications state
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Marquer une notification comme lue
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Marquer toutes comme lues
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Supprimer une notification
  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Première lettre du prénom du formateur
  const getInitial = () => {
    if (currentUser?.prenom) return currentUser.prenom[0].toUpperCase();
    if (currentUser?.name) return currentUser.name[0].toUpperCase();
    return 'U';
  };

  // Icône selon le type de notification
  const getNotifIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheck className="text-emerald-500" size={14} />;
      case 'warning':
        return <FiClock className="text-amber-500" size={14} />;
      case 'info':
      default:
        return <FiInfo className="text-sky-500" size={14} />;
    }
  };

  return (
    <header className="sticky top-0 z-30 h-[70px] bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm dark:bg-slate-900/95 dark:border-slate-800 transition-colors duration-300 flex flex-col justify-center">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Côté gauche : bouton hamburger */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onMenuToggle}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 p-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <FiMenu size={22} />
          </button>
        </div>

        {/* Côté droit : actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bouton dark / light mode */}
          <button
            onClick={toggleTheme}
            className="relative text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-yellow-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            aria-label="Basculer le mode sombre"
          >
            <div className="relative w-[18px] h-[18px]">
              <FiSun
                size={18}
                className={`absolute inset-0 transition-all duration-300 ${
                  isDark ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                }`}
              />
              <FiMoon
                size={18}
                className={`absolute inset-0 transition-all duration-300 ${
                  isDark ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                }`}
              />
            </div>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Notifications"
            >
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900 flex items-center justify-center text-[10px] text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown des notifications */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-scale-in z-50">
                {/* Header du dropdown */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition"
                    >
                      Tout marquer comme lu
                    </button>
                  )}
                </div>

                {/* Liste des notifications */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                      Aucune notification
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                          !notif.read ? 'bg-sky-50/50 dark:bg-sky-900/20' : ''
                        }`}
                      >
                        {/* Indicateur de type */}
                        <div className="mt-0.5 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          {getNotifIcon(notif.type)}
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-800 dark:text-gray-100' : 'font-medium text-gray-600 dark:text-gray-300'}`}>
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-sky-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                            {notif.time}
                          </p>
                        </div>

                        {/* Bouton fermer */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notif.id);
                          }}
                          className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition p-0.5 mt-0.5"
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
          <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-700" />

          {/* Avatar avec première lettre du formateur */}
          <div className="bg-sky-500 text-white w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm shadow-md cursor-default">
            {getInitial()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
