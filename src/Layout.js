import React, { useState } from 'react';
import './Layout.css';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <div className={`dashboard-layout ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Top Navbar */}
      <header className="top-navbar">
        <div className="top-navbar-left">
          <div className="logo-dark">G</div>
          <span className="brand-text-dark">GESEMPL</span>
        </div>
        <div className="top-navbar-right">
          <button 
            className="top-icon-btn" 
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Basculer le thème"
            style={{ marginRight: '16px', background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <div className="user-info-top">
            <div className="user-name-top">MED Med</div>
            <div className="user-role-top">CHEF DE PÔLE</div>
          </div>
          <div className="user-avatar-top">M</div>
        </div>
      </header>

      <div className="layout-body">
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-logo-container">
            <div className="logo-light">G</div>
            <span className="brand-text-light">GESEMPL</span>
            <button 
              className="sidebar-toggle-btn-inner" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              ☰
            </button>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-group">
              <div className="nav-group-title">PLANNING</div>
              <a href="#" className="nav-item active">
                <span className="nav-icon">📅</span>
                <span className="nav-text">Emploi du temps</span>
              </a>
            </div>

            <div className="nav-group">
              <div className="nav-group-title">RESSOURCES</div>
                <Link to="/groupes" className="nav-item">
                  <span className="nav-icon">👥</span>
                  <span className="nav-text">Groupes / Filières</span>
                </Link>

                <Link to="/salles" className="nav-item">
                  <span className="nav-icon">🏫</span>
                  <span className="nav-text">Salles / Espaces</span>
                </Link>

                <Link to="/formateurs" className="nav-item">
                  <span className="nav-icon">👤</span>
                  <span className="nav-text">Formateurs</span>
                </Link>

                <Link to="/modules" className="nav-item">
                  <span className="nav-icon">📚</span>
                  <span className="nav-text">Modules</span>
                </Link> 
            </div>

            <div className="nav-group">
              <div className="nav-group-title">GESTION</div>
              <Link to="/absences-formateurs" className="nav-item">
                <span className="nav-icon">🚫</span>
                <span className="nav-text">Absences formateurs</span>
              </Link>
              <a href="#" className="nav-item">
                <span className="nav-icon">📋</span>
                <span className="nav-text">Affectations</span>
              </a>
              <a href="#" className="nav-item">
                <span className="nav-icon">⬇️</span>
                <span className="nav-text">Exports</span>
              </a>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Outlet />
       </main>
      </div>
    </div>
  );
};

export default Layout;
