import { useEffect, useState } from 'react'
import MonthlyView from './views/MonthlyView'
import ModulesView from './views/ModulesView'
import ProfileView from './views/ProfileView'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedView, setSelectedView] = useState<'schedule' | 'monthly' | 'modules' | 'profile'>('schedule')

  // Synchronize document root with darkMode state to resolve variant rendering
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Synchronize resize states cleanly
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900
      setIsMobile(mobile)
      if (mobile) {
        setIsCollapsed(false) // Clean up desktop sidebar minimization mode when shifting to mobile layout views
      } else {
        setSidebarOpen(false) // Close the open mobile drawer state when sliding back into wide layouts
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    <div 
      className={`w-full h-screen grid gap-[18px] p-[18px] overflow-hidden transition-[background,grid-template-columns] duration-350 ease-[ease] font-sans text-[14px] leading-[1.6] bg-bg-app text-text-main
        ${isMobile ? 'grid-cols-1' : isCollapsed ? 'grid-cols-[76px_1fr]' : 'grid-cols-[280px_1fr]'}`}
    >
      {/* Sidebar Section */}
      <aside 
        className={`relative flex flex-col gap-6 min-height-[calc(100vh-36px)] border overflow-hidden transition-all duration-300 ease-in-out z-30
          bg-slate-100 border-slate-200 text-slate-700
          dark:bg-[#111d3a] dark:border-[#17274a] dark:text-[#b8c6e3]
          ${isCollapsed ? 'w-[76px] px-3 py-[22px] items-center' : 'w-[280px] px-5 py-[22px]'}
          ${sidebarOpen ? 'max-[900px]:translate-x-0' : 'max-[900px]:-translate-x-full'}
          max-[900px]:fixed max-[900px]:top-0 max-[900px]:left-0 max-[900px]:bottom-0 max-[900px]:w-[280px] max-[900px]:max-w-[80vw] max-[900px]:rounded-r-[24px] max-[900px]:min-h-screen
          rounded-[22px]`}
      >
        {/* Header de la Sidebar */}
        <div className={`flex items-center gap-3 shrink-0 w-full ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-[#2e60ff] to-[#1d4ed8] grid place-items-center font-bold text-white shrink-0">G</div>
            {!isCollapsed && (
              <div className="grid gap-0.5 transition-opacity duration-200">
                <div className="font-bold text-[16px] text-slate-900 dark:text-white whitespace-nowrap">Vue Stagiaire</div>
                <span className="w-max px-2 py-[2px] rounded-full bg-slate-200 dark:bg-white/5 text-slate-800 dark:text-white text-[9px] font-semibold uppercase tracking-[0.12em]">STAGIAIRE</span>
              </div>
            )}
          </div>
          
          {/* Bouton d'action dans la sidebar (Fermer sur mobile, Réduire sur Bureau) */}
          <button
            className="w-[34px] h-[34px] border border-slate-300 dark:border-white/14 rounded-[10px] bg-slate-200 dark:bg-white/6 text-slate-700 dark:text-white inline-flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-slate-300 dark:hover:bg-white/12"
            type="button"
            onClick={toggleCollapse}
            aria-label={isMobile ? "Close sidebar" : "Toggle layout view"}
          >
            {isMobile ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : isCollapsed ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

        {/* Menu Section 1 */}
        <div className="grid gap-2 w-full">
          <div className={`text-[11px] uppercase tracking-[0.18em] transition-opacity duration-200 text-slate-500 dark:text-[#7d8caa] px-2.5 ${isCollapsed ? 'hidden' : 'block'}`}>
            MON PLANNING
          </div>
          <button
            className={`w-full border-0 rounded-[16px] py-3 flex items-center gap-3 text-left bg-transparent text-slate-700 dark:text-white text-[14px] cursor-pointer transition-all duration-200 hover:bg-[#3872f8]/12 relative
              ${isCollapsed ? 'px-0 justify-center' : 'px-3.5'}
              ${selectedView === 'schedule' ? 'bg-slate-200 dark:bg-white/8 before:content-[""] before:absolute before:left-0 before:w-1 before:h-8 before:rounded-full before:bg-[#4f8bff]' : ''}`}
            type="button"
            onClick={() => onSelectView('schedule')}
            title="Mon emploi du temps"
          >
            <span className="w-8 h-8 grid place-items-center rounded-[12px] bg-slate-200 dark:bg-white/8 shrink-0" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
                <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M7 10h10M7 14h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            {!isCollapsed && <span className="truncate">Mon emploi du temps</span>}
          </button>
          
          <button
            className={`w-full border-0 rounded-[16px] py-3 flex items-center gap-3 text-left bg-transparent text-slate-700 dark:text-white text-[14px] cursor-pointer transition-all duration-200 hover:bg-[#3872f8]/12 relative
              ${isCollapsed ? 'px-0 justify-center' : 'px-3.5'}
              ${selectedView === 'monthly' ? 'bg-slate-200 dark:bg-white/8 before:content-[""] before:absolute before:left-0 before:w-1 before:h-8 before:rounded-full before:bg-[#4f8bff]' : ''}`}
            type="button"
            onClick={() => onSelectView('monthly')}
            title="Vue mensuelle"
          >
            <span className="w-8 h-8 grid place-items-center rounded-[12px] bg-slate-200 dark:bg-white/8 shrink-0" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            {!isCollapsed && <span className="truncate">Vue mensuelle</span>}
          </button>
        </div>

        {/* Menu Section 2 */}
        <div className="grid gap-2 w-full">
          <div className={`text-[11px] uppercase tracking-[0.18em] transition-opacity duration-200 text-slate-500 dark:text-[#7d8caa] px-2.5 ${isCollapsed ? 'hidden' : 'block'}`}>
            INFOS
          </div>
          <button
            className={`w-full border-0 rounded-[16px] py-3 flex items-center gap-3 text-left bg-transparent text-slate-700 dark:text-white text-[14px] cursor-pointer transition-all duration-200 hover:bg-[#3872f8]/12 relative
              ${isCollapsed ? 'px-0 justify-center' : 'px-3.5'}
              ${selectedView === 'modules' ? 'bg-slate-200 dark:bg-white/8 before:content-[""] before:absolute before:left-0 before:w-1 before:h-8 before:rounded-full before:bg-[#4f8bff]' : ''}`}
            type="button"
            onClick={() => onSelectView('modules')}
            title="Mes modules"
          >
            <span className="w-8 h-8 grid place-items-center rounded-[12px] bg-slate-200 dark:bg-white/8 shrink-0" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 4h14v16H5z" stroke="currentColor" strokeWidth="2" />
                <path d="M5 10h14" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            {!isCollapsed && <span className="truncate">Mes modules</span>}
          </button>
          
          <button
            className={`w-full border-0 rounded-[16px] py-3 flex items-center gap-3 text-left bg-transparent text-slate-700 dark:text-white text-[14px] cursor-pointer transition-all duration-200 hover:bg-[#3872f8]/12 relative
              ${isCollapsed ? 'px-0 justify-center' : 'px-3.5'}
              ${selectedView === 'profile' ? 'bg-slate-200 dark:bg-white/8 before:content-[""] before:absolute before:left-0 before:w-1 before:h-8 before:rounded-full before:bg-[#4f8bff]' : ''}`}
            type="button"
            onClick={() => onSelectView('profile')}
            title="Mon profil"
          >
            <span className="w-8 h-8 grid place-items-center rounded-[12px] bg-slate-200 dark:bg-white/8 shrink-0" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="2" />
                <path d="M4 22c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            {!isCollapsed && <span className="truncate">Mon profil</span>}
          </button>
        </div>
      </aside>

      {/* Main Container Wrapper */}
      <div className="flex flex-col h-full overflow-hidden">
        <header className="flex justify-between items-center gap-4 pb-3 border-b bg-inherit shrink-0 max-[900px]:py-[18px] max-[900px]:pb-2.5 max-[900px]:sticky max-[900px]:top-0 max-[900px]:z-10 border-border-light">
          <div className="flex items-center gap-4 max-[540px]:w-full max-[540px]:justify-between">
            {/* Bouton burger visible uniquement sur mobile pour ouvrir la sidebar */}
            {isMobile && (
              <button
                className="w-10 h-10 rounded-xl border border-slate-300 dark:border-white/14 flex items-center justify-center bg-bg-card"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <div className="text-[20px] font-bold">GESEEMPL</div>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="w-[46px] h-[46px] rounded-[16px] border inline-flex items-center justify-center cursor-pointer transition-all duration-250 bg-bg-card text-text-main border-border-light active:bg-[#4f8bff]/14 active:text-[#4f8bff]"
              onClick={() => setDarkMode((value) => !value)}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              type="button"
            >
              {darkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3.75a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V4.75a1 1 0 0 1 1-1ZM12 17.25a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1ZM4.72 a1 1 0 0 1 1.42 0l1.06 1.06a1 1 0 0 1-1.42 1.42L4.72 6.14a1 1 0 0 1 0-1.42ZM16.8 16.8a1 1 0 0 1 1.42 0l1.06 1.06a1 1 0 1 1-1.42 1.42l-1.06-1.06a1 1 0 0 1 0-1.42ZM3.75 12a1 1 0 0 1 1-1h1.5a1 1 0 1 1 0 2h-1.5a1 1 0 0 1-1-1ZM17.25 12a1 1 0 0 1 1-1h1.5a1 1 0 1 1 0 2h-1.5a1 1 0 0 1-1-1ZM7.05 16.95a1 1 0 0 1 0-1.42l1.06-1.06a1 1 0 0 1 1.42 1.42l-1.06 1.06a1 1 0 0 1-1.42 0ZM15.49 8.51a1 1 0 0 1 0-1.42l1.06-1.06a1 1 0 1 1 1.42 1.42l-1.06 1.06a1 1 0 0 1-1.42 0ZM12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3.25a1 1 0 0 1 1 1 7.75 7.75 0 0 0 0 15.5 1 1 0 1 1 0 2 9.75 9.75 0 0 1 0-19.5 1 1 0 0 1 1 1Z" fill="currentColor" />
                </svg>
              )}
            </button>

            <div className="flex items-center gap-3 p-2.5 rounded-[20px] transition-all duration-250 max-[900px]:hidden bg-bg-card [box-shadow:0_24px_60px_rgba(15,23,42,0.12)] dark:[box-shadow:0_30px_80px_rgba(0,0,0,0.25)]">
              <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#4f7cff] to-[#1d4ed8] text-white grid place-items-center font-bold">Y</div>
              <div>
                <div className="font-bold">Youssef Tazi</div>
                <div className="text-[13px] text-text-muted">STAGIAIRE · GRP A2</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pt-6 pb-7 min-h-0 max-[900px]:pb-5">
          {selectedView === 'schedule' && (
            <section className="w-full max-w-[1180px] mx-auto mb-6 p-6 rounded-[28px] transition-all duration-250 max-[900px]:p-5 max-[900px]:max-w-full max-[580px]:p-5 bg-bg-card [box-shadow:0_24px_60px_rgba(15,23,42,0.12)] dark:[box-shadow:0_30px_80px_rgba(0,0,0,0.25)]">
              <div className="flex justify-between items-center flex-wrap gap-3 mb-4 max-[700px]:flex-col max-[700px]:items-stretch">
                <div className="text-[12px] font-semibold tracking-[0.14em] uppercase py-2.5 px-3.5 rounded-full border bg-primary-light text-primary border-primary/16 dark:bg-primary/14">
                  Groupe A2 · Filière Comptabilité · Année 2 - Vue hebdomadaire
                </div>
                <div className="flex items-center gap-2.5 max-[700px]:flex-col max-[700px]:items-stretch">
                  <button 
                    className="border-0 rounded-full bg-primary text-white py-2.5 px-4 cursor-pointer transition-all duration-200 hover:bg-primary-hover hover:-translate-y-[1px]" 
                    type="button"
                  >
                    PDF
                  </button>
                  <div className="min-w-[100px] text-center rounded-full py-2.5 px-3 font-bold text-[13px] bg-primary-light text-primary dark:bg-primary/14">
                    20/04/2026
                  </div>
                </div>
              </div>

              <div className="w-full overflow-x-auto mx-auto">
                <table className="w-full border-collapse min-w-[760px] mx-auto max-[700px]:min-w-[620px] max-[540px]:min-w-[520px]">
                  <thead>
                    <tr>
                      <th className="text-left font-bold text-[12px] uppercase tracking-[0.08em] py-3 px-2.5 border-b text-text-muted border-border-light">JOURS</th>
                      <th className="text-left font-bold text-[12px] uppercase tracking-[0.08em] py-3 px-2.5 border-b text-text-muted border-border-light">8H30 - 11H</th>
                      <th className="text-left font-bold text-[12px] uppercase tracking-[0.08em] py-3 px-2.5 border-b text-text-muted border-border-light">11H - 13H30</th>
                      <th className="text-left font-bold text-[12px] uppercase tracking-[0.08em] py-3 px-2.5 border-b text-text-muted border-border-light">13H30 - 16H</th>
                      <th className="text-left font-bold text-[12px] uppercase tracking-[0.08em] py-3 px-2.5 border-b text-text-muted border-border-light">16H - 18H30</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Lundi */}
                    <tr>
                      <td className="py-3 px-2.5 border-b w-[150px] border-border-light">
                        <div className="text-[13px] font-bold uppercase">LUNDI</div>
                        <div className="text-[12px] mt-1 text-text-muted">20/4</div>
                      </td>
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light">
                        <div className="inline-flex flex-col gap-1 p-3 rounded-[16px] min-w-[150px] border bg-bg-card text-text-secondary border-border-light">
                          <strong className="text-text-main">Comptabilité</strong>
                          <span>Salle 01 · M. Benali</span>
                        </div>
                      </td>
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light" />
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light">
                        <div className="inline-flex flex-col gap-1 p-3 rounded-[16px] min-w-[150px] border border-transparent bg-distanciel text-distanciel-text">
                          <strong className="dark:text-[#f8fbff]">Informatique</strong>
                          <span>Labo 2 · M. Hassan</span>
                        </div>
                      </td>
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light" />
                    </tr>
                    {/* Mardi */}
                    <tr>
                      <td className="py-3 px-2.5 border-b w-[150px] border-border-light">
                        <div className="text-[13px] font-bold uppercase">MARDI</div>
                        <div className="text-[12px] mt-1 text-text-muted">21/4</div>
                      </td>
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light" />
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light">
                        <div className="inline-flex flex-col gap-1 p-3 rounded-[16px] min-w-[150px] border border-transparent bg-presentiel text-presentiel-text">
                          <strong className="dark:text-[#f8fbff]">Fiscalité</strong>
                          <span>Salle 02 · M. Bernard</span>
                        </div>
                      </td>
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light" />
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light">
                        <div className="inline-flex flex-col gap-1 p-3 rounded-[16px] min-w-[150px] border border-transparent bg-distanciel text-distanciel-text">
                          <strong className="dark:text-[#f8fbff]">Anglais</strong>
                          <span>Salle 05 · Mme. Clark</span>
                        </div>
                      </td>
                    </tr>
                    {/* Mercredi */}
                    <tr>
                      <td className="py-3 px-2.5 border-b w-[150px] border-border-light">
                        <div className="text-[13px] font-bold uppercase">MERCREDI</div>
                        <div className="text-[12px] mt-1 text-text-muted">22/4</div>
                      </td>
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light">
                        <div className="inline-flex flex-col gap-1 p-3 rounded-[16px] min-w-[150px] border bg-bg-card text-text-secondary border-border-light">
                          <strong className="text-text-main">Comptabilité</strong>
                          <span>Salle 01 · M. Benali</span>
                        </div>
                      </td>
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light" />
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light" />
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light" />
                    </tr>
                    {/* Jeudi */}
                    <tr>
                      <td className="py-3 px-2.5 border-b w-[150px] border-border-light">
                        <div className="text-[13px] font-bold uppercase">JEUDI</div>
                        <div className="text-[12px] mt-1 text-text-muted">23/4</div>
                      </td>
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light" />
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light">
                        <div className="inline-flex flex-col gap-1 p-3 rounded-[16px] min-w-[150px] border border-transparent bg-presentiel text-presentiel-text">
                          <strong className="dark:text-[#f8fbff]">Gestion</strong>
                          <span>Salle 04 · M. Rousseau</span>
                        </div>
                      </td>
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light" />
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light" />
                    </tr>
                    {/* Vendredi */}
                    <tr>
                      <td className="py-3 px-2.5 border-b w-[150px] border-border-light">
                        <div className="text-[13px] font-bold uppercase">VENDREDI</div>
                        <div className="text-[12px] mt-1 text-text-muted">24/4</div>
                      </td>
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light">
                        <div className="inline-flex flex-col gap-1 p-3 rounded-[16px] min-w-[150px] border bg-bg-card text-text-secondary border-border-light">
                          <strong className="text-text-main">Math</strong>
                          <span>Salle 06 · M. Idrissi</span>
                        </div>
                      </td>
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light" />
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light">
                        <div className="inline-flex flex-col gap-1 p-3 rounded-[16px] min-w-[150px] border border-transparent bg-distanciel text-distanciel-text">
                          <strong className="dark:text-[#f8fbff]">Communication</strong>
                          <span>Salle 03 · Mme. Saidi</span>
                        </div>
                      </td>
                      <td className="py-3 px-2.5 border-b max-[580px]:py-3.5 max-[580px]:px-3 border-border-light" />
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

      {/* Backdrop de fermeture pour le menu Mobile uniquement */}
      {sidebarOpen && isMobile && (
        <button
          className="fixed inset-0 bg-[#0f232a]/35 border-0 z-20"
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}
    </div>
  )
}

export default App