import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiCalendar, FiUsers, FiHome, FiUser, FiBook, FiGrid, FiX } from 'react-icons/fi';

// Éléments de navigation regroupés par section
const navSections = [
  {
    label: 'PLANNING',
    items: [
      { to: '/formateur/dashboard', icon: FiCalendar, text: 'Emploi du temps' },
    ],
  },
  {
    label: 'RESSOURCES',
    items: [
      { to: '/formateur/groupes', icon: FiUsers, text: 'Groupes / Filières' },
      { to: '/formateur/salles', icon: FiHome, text: 'Salles / Espaces' },
      { to: '/formateur/formateurs', icon: FiUser, text: 'Formateurs' },
      { to: '/formateur/modules', icon: FiBook, text: 'Modules' },
      { to: '/formateur/affectations', icon: FiGrid, text: 'Affectations' },
    ],
  },
];

const Sidebar = ({ isOpen, isCollapsed, onToggle, onCollapse }) => {
  return (
    <>
      {/* Overlay semi-transparent sur mobile quand la sidebar est ouverte */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      {/* Barre latérale */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full
          bg-slate-800 text-slate-400 border-r border-slate-700
          dark:bg-slate-900 dark:border-slate-800
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${isCollapsed ? 'lg:w-[84px]' : 'lg:w-[260px]'}
          w-[260px]
        `}
      >
        {/* Zone du logo */}
        <div className={`flex items-center h-16 px-5 ${isCollapsed ? 'lg:justify-center lg:px-0' : 'justify-between'}`}>
          <button
            onClick={onCollapse}
            className="hidden lg:flex items-center gap-3 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
            aria-label="Toggle sidebar"
          >
            {/* Badge logo 'G' */}
            <div className="bg-sky-500 w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg shadow-sky-500/30">
              G
            </div>
            {!isCollapsed && (
              <span className="text-white font-semibold text-lg tracking-wide whitespace-nowrap overflow-hidden">
                GESEMPL
              </span>
            )}
          </button>

          {/* Logo pour mobile (non cliquable pour collapse) */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="bg-sky-500 w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg shadow-sky-500/30">
              G
            </div>
            <span className="text-white font-semibold text-lg tracking-wide">
              GESEMPL
            </span>
          </div>

          {/* Bouton fermer visible uniquement sur mobile */}
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-white lg:hidden transition-colors duration-200"
            aria-label="Fermer le menu"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Liens de navigation */}
        <nav className="flex-1 overflow-y-auto mt-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.label}>
              {/* Titre de la section */}
              {!isCollapsed && (
                <p className="uppercase text-xs text-gray-500 tracking-wider font-medium px-6 mb-2 whitespace-nowrap overflow-hidden">
                  {section.label}
                </p>
              )}
              {isCollapsed && (
                <div className="hidden lg:block w-8 h-px bg-gray-600 mx-auto mb-2" />
              )}

              {/* Éléments de navigation */}
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      title={isCollapsed ? item.text : undefined}
                      className={({ isActive }) =>
                        `flex items-center gap-3 mx-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-[0.95rem] font-medium
                        ${isCollapsed ? 'lg:justify-center lg:mx-2 lg:px-2' : ''}
                        ${
                          isActive
                            ? 'bg-white/5 text-white border-l-2 border-sky-500/50'
                            : 'text-slate-300 hover:text-white hover:bg-white/5 border-l-2 border-transparent hover:border-sky-500/50'
                        }`
                      }
                    >
                      <item.icon size={18} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="whitespace-nowrap overflow-hidden">
                          {item.text}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
