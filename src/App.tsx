import { useEffect, useState } from 'react'
import './App.css'
import MonthlyView from './views/MonthlyView'
import ModulesView from './views/ModulesView'
import ProfileView from './views/ProfileView'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedView, setSelectedView] = useState<'schedule' | 'monthly' | 'modules' | 'profile'>('schedule')

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900
      setIsMobile(mobile)
      if (mobile) {
        setIsCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (sidebarOpen && isMobile) {
      setIsCollapsed(false)
    }
  }, [sidebarOpen, isMobile])

  const onSelectView = (view: 'schedule' | 'monthly' | 'modules' | 'profile') => {
    setSelectedView(view)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const toggleCollapse = () => {
    if (isMobile) {
      setSidebarOpen((current) => !current)
      return
    }
    setIsCollapsed((current) => !current)
  }

  const showSidebarFab = isCollapsed || (isMobile && !sidebarOpen)

  return (
    <div className={`dashboard ${sidebarOpen ? 'sidebar-open' : ''} ${isCollapsed ? 'sidebar-collapsed' : ''} ${darkMode ? 'dark-mode' : ''}`}>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-top">
          <div className="brand">
            <div className="brand-icon">G</div>
            <div className="brand-labels">
              <div className="brand-title">Vue Stagiaire</div>
              <span className="brand-badge">STAGIAIRE</span>
            </div>
          </div>
          <div className="sidebar-actions">
            <button
              className="sidebar-close"
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        

        <div className="menu-section">
          <div className="menu-label">MON PLANNING</div>
          <button
            className={`menu-item ${selectedView === 'schedule' ? 'active' : ''}`}
            type="button"
            onClick={() => onSelectView('schedule')}
            title="Mon emploi du temps"
          >
            <span className="menu-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
                <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M7 10h10M7 14h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <span className="menu-text">Mon emploi du temps</span>
          </button>
          <button
            className={`menu-item ${selectedView === 'monthly' ? 'active' : ''}`}
            type="button"
            onClick={() => onSelectView('monthly')}
            title="Vue mensuelle"
          >
            <span className="menu-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <span className="menu-text">Vue mensuelle</span>
          </button>
        </div>

        <div className="menu-section">
          <div className="menu-label">INFOS</div>
          <button
            className={`menu-item ${selectedView === 'modules' ? 'active' : ''}`}
            type="button"
            onClick={() => onSelectView('modules')}
            title="Mes modules"
          >
            <span className="menu-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 4h14v16H5z" stroke="currentColor" strokeWidth="2" />
                <path d="M5 10h14" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            <span className="menu-text">Mes modules</span>
          </button>
          <button
            className={`menu-item ${selectedView === 'profile' ? 'active' : ''}`}
            type="button"
            onClick={() => onSelectView('profile')}
            title="Mon profil"
          >
            <span className="menu-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="2" />
                <path d="M4 22c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            <span className="menu-text">Mon profil</span>
          </button>
        </div>
      </aside>

      <div className="content-shell">
        <header className="main-header">
          <div className="header-left">
            <div className="main-heading">GESEEMPL</div>
          </div>

          <div className="header-right">
            <button
              className={`theme-toggle ${darkMode ? 'active' : ''}`}
              onClick={() => setDarkMode((value) => !value)}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              type="button"
            >
              {darkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3.75a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V4.75a1 1 0 0 1 1-1ZM12 17.25a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1ZM4.72 4.72a1 1 0 0 1 1.42 0l1.06 1.06a1 1 0 0 1-1.42 1.42L4.72 6.14a1 1 0 0 1 0-1.42ZM16.8 16.8a1 1 0 0 1 1.42 0l1.06 1.06a1 1 0 1 1-1.42 1.42l-1.06-1.06a1 1 0 0 1 0-1.42ZM3.75 12a1 1 0 0 1 1-1h1.5a1 1 0 1 1 0 2h-1.5a1 1 0 0 1-1-1ZM17.25 12a1 1 0 0 1 1-1h1.5a1 1 0 1 1 0 2h-1.5a1 1 0 0 1-1-1ZM7.05 16.95a1 1 0 0 1 0-1.42l1.06-1.06a1 1 0 0 1 1.42 1.42l-1.06 1.06a1 1 0 0 1-1.42 0ZM15.49 8.51a1 1 0 0 1 0-1.42l1.06-1.06a1 1 0 1 1 1.42 1.42l-1.06 1.06a1 1 0 0 1-1.42 0ZM12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3.25a1 1 0 0 1 1 1 7.75 7.75 0 0 0 0 15.5 1 1 0 1 1 0 2 9.75 9.75 0 0 1 0-19.5 1 1 0 0 1 1 1Z" fill="currentColor" />
                </svg>
              )}
            </button>

            <div className="user-chip">
              <div className="user-avatar">Y</div>
              <div>
                <div className="user-name">Youssef Tazi</div>
                <div className="user-meta">STAGIAIRE · GRP A2</div>
              </div>
            </div>
          </div>
        </header>

        <main className="main-content">
          {selectedView === 'schedule' && (
            <section className="schedule-panel">
              <div className="schedule-header">
                <div className="schedule-tag">
                  Groupe A2 · Filière Comptabilité · Année 2 - Vue hebdomadaire
                </div>
                <div className="schedule-actions">
                  <button className="action-button" type="button">
                    PDF
                  </button>
                  <div className="date-pill">20/04/2026</div>
                </div>
              </div>

              <div className="schedule-table-wrap">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>JOURS</th>
                      <th>8H30 - 11H</th>
                      <th>11H - 13H30</th>
                      <th>13H30 - 16H</th>
                      <th>16H - 18H30</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="day-name">LUNDI</div>
                        <div className="day-date">20/4</div>
                      </td>
                      <td>
                        <div className="session-card">
                          <strong>Comptabilité</strong>
                          <span>Salle 01 · M. Benali</span>
                        </div>
                      </td>
                      <td />
                      <td>
                        <div className="session-card distanciel">
                          <strong>Informatique</strong>
                          <span>Labo 2 · M. Hassan</span>
                        </div>
                      </td>
                      <td />
                    </tr>
                    <tr>
                      <td>
                        <div className="day-name">MARDI</div>
                        <div className="day-date">21/4</div>
                      </td>
                      <td />
                      <td>
                        <div className="session-card presentiel">
                          <strong>Fiscalité</strong>
                          <span>Salle 02 · M. Bernard</span>
                        </div>
                      </td>
                      <td />
                      <td>
                        <div className="session-card distanciel">
                          <strong>Anglais</strong>
                          <span>Salle 05 · Mme. Clark</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="day-name">MERCREDI</div>
                        <div className="day-date">22/4</div>
                      </td>
                      <td>
                        <div className="session-card">
                          <strong>Comptabilité</strong>
                          <span>Salle 01 · M. Benali</span>
                        </div>
                      </td>
                      <td />
                      <td />
                      <td />
                    </tr>
                    <tr>
                      <td>
                        <div className="day-name">JEUDI</div>
                        <div className="day-date">23/4</div>
                      </td>
                      <td />
                      <td>
                        <div className="session-card presentiel">
                          <strong>Gestion</strong>
                          <span>Salle 04 · M. Rousseau</span>
                        </div>
                      </td>
                      <td />
                      <td />
                    </tr>
                    <tr>
                      <td>
                        <div className="day-name">VENDREDI</div>
                        <div className="day-date">24/4</div>
                      </td>
                      <td>
                        <div className="session-card">
                          <strong>Math</strong>
                          <span>Salle 06 · M. Idrissi</span>
                        </div>
                      </td>
                      <td />
                      <td>
                        <div className="session-card distanciel">
                          <strong>Communication</strong>
                          <span>Salle 03 · Mme. Saidi</span>
                        </div>
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {selectedView === 'monthly' && <MonthlyView />}
          {selectedView === 'modules' && <ModulesView />}
          {selectedView === 'profile' && <ProfileView />}
        </main>
      </div>

      {showSidebarFab && (
        <button
          className="sidebar-fab"
          type="button"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Open navigation'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {sidebarOpen && (
        <button
          className="mobile-backdrop"
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}
    </div>
  )
}

export default App
