import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiCalendar, FiUsers, FiHome, FiUser, FiBook, FiGrid } from 'react-icons/fi';

const navSections = [
  {
    label: 'PLANNING',
    items: [
      { to: '/formateur/dashboard', icon: 'E', text: 'Emploi du temps' },
    ],
  },
  {
    label: 'RESSOURCES',
    items: [
      { to: '/formateur/groupes',      icon: 'G', text: 'Groupes / Filières' },
      { to: '/formateur/salles',       icon: 'S', text: 'Salles / Espaces' },
      { to: '/formateur/formateurs',   icon: 'F', text: 'Formateurs' },
      { to: '/formateur/modules',      icon: 'M', text: 'Modules' },
      { to: '/formateur/affectations', icon: 'A', text: 'Affectations' },
    ],
  },
];

const Sidebar = ({ isOpen, isCollapsed, onToggle, onCollapse }) => {
  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full flex flex-col
          bg-slate-800 text-slate-400 border-r border-slate-700
          dark:bg-slate-900 dark:border-slate-800
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${isCollapsed ? 'lg:w-[84px]' : 'lg:w-[260px]'}
          w-[260px]
        `}
      >
        {/* Zone logo */}
        <div className={`flex items-center h-[70px] border-b border-white/5 transition-all duration-300 ${isCollapsed ? 'lg:flex-col lg:justify-center lg:gap-4 lg:py-4' : 'px-6 gap-3.5'}`}>
          {/* Badge G */}
          <button onClick={onCollapse} className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg font-extrabold text-white bg-gradient-to-br from-sky-500 to-sky-700 shadow-sm shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
            G
          </button>
          {/* Mobile badge */}
          <div className="flex lg:hidden items-center justify-center w-9 h-9 rounded-lg font-extrabold text-white bg-gradient-to-br from-sky-500 to-sky-700 shadow-sm shrink-0">
            G
          </div>

          {/* Titre */}
          {!isCollapsed && (
            <span className="font-extrabold text-[1.15rem] tracking-wider text-white hidden lg:block">GESEMPL</span>
          )}
          <span className="font-extrabold text-[1.15rem] tracking-wider text-white lg:hidden">GESEMPL</span>

          {/* Bouton collapse desktop */}
          {!isCollapsed && (
            <button
              onClick={onCollapse}
              className="hidden lg:block ml-auto bg-transparent border-none text-slate-300 text-[1.2rem] cursor-pointer p-1 hover:text-white transition-colors"
              title="Réduire"
            >
              ☰
            </button>
          )}

          {/* Bouton fermer mobile */}
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-white lg:hidden ml-auto transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-7 py-6 flex-1 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.label} className="flex flex-col">
              {!isCollapsed && (
                <div className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest px-6 mb-2.5 whitespace-nowrap overflow-hidden">
                  {section.label}
                </div>
              )}
              {isCollapsed && <div className="hidden lg:block w-8 h-px bg-slate-600 mx-auto mb-2" />}

              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      title={isCollapsed ? item.text : undefined}
                      className={({ isActive }) =>
                        `flex items-center py-3 text-slate-300 no-underline text-[0.95rem] font-medium transition-all duration-200 border-l-[3px] border-transparent hover:bg-white/5 hover:text-white hover:border-sky-500/50
                        ${isCollapsed ? 'lg:px-3 lg:justify-center' : 'px-6 gap-3.5'}
                        ${isActive ? 'text-white border-sky-500/50 bg-white/5' : ''}`
                      }
                    >
                      <span className={`font-black text-slate-400 dark:text-slate-300 opacity-90 transition-all hover:scale-110 ${isCollapsed ? 'text-[1.4rem]' : 'text-[1.2rem]'}`}>
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className="whitespace-nowrap overflow-hidden">{item.text}</span>
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
