import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { } from '../store';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../index.css';

const GestionnaireStagiaire = () => {
  const { user, sessions, config } = useSelector(state => state.schedule);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filterPole = searchParams.get('pole');
  
  const setFilterPole = (pole) => {
    if (pole) {
      setSearchParams({ pole });
    } else {
      setSearchParams({});
    }
  };

  const [filterFormateur, setFilterFormateur] = useState('all');
  const [filterSalle, setFilterSalle] = useState('all');
  const [filterModule, setFilterModule] = useState('all');
  const [filterAnnee, setFilterAnnee] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [filterFiliere, setFilterFiliere] = useState('all');
  const [filterGroupe, setFilterGroupe] = useState('all');
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    return getWeekRange(today);
  });
  const [viewMode, setViewMode] = useState('grid');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('ressources');
  const [sInput, setSInput] = useState({ formateur: '', salle: '', filiere: '', pole: '', annee: '', timeSlot: '' });

  // --- LOGIQUE DE DATE ---
  function getWeekRange(date) {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(start.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 5);
    
    return {
      start: monday,
      end: sunday,
      label: `${formatDate(monday)} - ${formatDate(sunday)}`
    };
  }

  function formatDate(date) {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  // Navigation semaine
  const previousWeek = () => {
    const newStart = new Date(currentWeek.start);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeek(getWeekRange(newStart));
  };

  const nextWeek = () => {
    const newStart = new Date(currentWeek.start);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeek(getWeekRange(newStart));
  };

  const goToToday = () => {
    setCurrentWeek(getWeekRange(new Date()));
  };

  const handleWeekChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setCurrentWeek(getWeekRange(selectedDate));
  };

  const weekDays = useMemo(() => {
    const daysOfWeek = [];
    const start = new Date(currentWeek.start);
    for (let i = 0; i < config.activeDays.length; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      daysOfWeek.push({
        day: config.activeDays[i],
        date: date,
        dateStr: date.toISOString().split('T')[0]
      });
    }
    return daysOfWeek;
  }, [currentWeek, config.activeDays]);

  // --- FILTRAGE PAR SEMAINE + FILTRES ---
  const currentWeekKey = useMemo(() => {
    const d = new Date(currentWeek.start);
    return d.toISOString().split('T')[0];
  }, [currentWeek]);
  console.log("GESTIONNAIRE SESSIONS:", sessions);
  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      if (s.status === 'pending') return false;
      // Filtre par semaine affichée
      if (s.weekKey && s.weekKey !== currentWeekKey) return false;
      const mP = filterPole === 'all' || s.pole === filterPole;
      const mF = filterFormateur === 'all' || s.formateur === filterFormateur;
      const mS = filterSalle === 'all' || s.salle === filterSalle;
      const mModule = filterModule === 'all' || s.module === filterModule;
      const mAnnee = filterAnnee === 'all' || s.annee === filterAnnee;
      const mDate = !filterDate || s.date === filterDate;
      const mFiliere = filterFiliere === 'all' || s.filiere === filterFiliere;
      const mGroupe = filterGroupe === 'all' || s.groupe === filterGroupe;
      return mP && mF && mS && mModule && mAnnee && mDate && mFiliere && mGroupe;
    });
  }, [sessions, currentWeekKey, filterPole, filterFormateur, filterSalle, filterModule, filterAnnee, filterDate, filterFiliere, filterGroupe]);

  const pendingSessions = useMemo(() => sessions.filter(s => s.status === 'pending'), [sessions]);

  // --- CALCUL DU TOTAL DES HEURES ---
  const totalHeures = useMemo(() => {
    return filteredSessions.length * config.sessionDuration;
  }, [filteredSessions, config.sessionDuration]);

  const totalPresentiel = useMemo(() => filteredSessions.filter(s => s.type === 'presentiel').length, [filteredSessions]);
  const totalDistanciel = useMemo(() => filteredSessions.filter(s => s.type === 'distanciel').length, [filteredSessions]);

  // Génération dynamique des listes en fonction du pôle sélectionné
  const getFilteredList = (list) => {
    if (!list) return [];
    return list
      .filter(item => {
        if (typeof item === 'string') return true;
        if (filterPole === 'all' || !filterPole) return true;
        if (!item.pole) return true; // Ne pas cacher si le pôle est inconnu
        return item.pole === filterPole;
      })
      .map(item => typeof item === 'string' ? item : item.nom);
  };

  const listFormateurs = getFilteredList(config.formateurs);
  const listSalles = getFilteredList(config.salles);
  const listModules = config.modules ? getFilteredList(config.modules) : [...new Set(sessions.map(s => s.module))];
  const listAnnees = config.annees || [];
  const listFilieres = getFilteredList(config.filieres);
  const listGroupes = getFilteredList(config.groupes);
  const timeSlots = config.timeSlots || [];

  // --- STATS DYNAMIQUES DASHBOARD ---
  const totalFormateursPole = listFormateurs.length;
  const totalSallesPole = listSalles.length;
  const totalSeancesSemaine = filteredSessions.length;

  // --- ACTIONS ---

  const handleResetFilters = () => {
    setFilterFormateur('all');
    setFilterSalle('all');
    setFilterModule('all');
    setFilterAnnee('all');
    setFilterDate('');
    setFilterFiliere('all');
    setFilterGroupe('all');
  };

  const handleExportPDF = async () => {
    const tableElement = document.querySelector('.table-wrapper');
    if (!tableElement) return;

    // Optional: Add a simple loading state or just execute
    try {
      const canvas = await html2canvas(tableElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Emploi_du_temps.pdf`);
    } catch (err) {
      console.error("Erreur lors de l'export PDF:", err);
      alert("Erreur lors de la génération du PDF.");
    }
  };
  const isCurrentWeek = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(currentWeek.start);
    start.setHours(0, 0, 0, 0);
    const end = new Date(currentWeek.end);
    end.setHours(23, 59, 59, 999);
    return today >= start && today <= end;
  }, [currentWeek]);

  if (filterPole === null) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">Sélection du Pôle</h1>
        <p className="text-slate-500 mb-8">Veuillez choisir un pôle pour consulter son emploi du temps.</p>
        <div className="flex gap-6 flex-wrap justify-center max-w-4xl">
          {config.poles.map(pole => (
            <button
              key={pole}
              onClick={() => setFilterPole(pole)}
              className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-lg rounded-2xl p-8 flex flex-col items-center gap-4 transition-all hover:-translate-y-1 w-64"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-2xl font-bold">
                {pole.substring(0, 2)}
              </div>
              <span className="text-xl font-bold text-slate-700 dark:text-slate-200">{pole}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container relative">
      <button 
        onClick={() => setFilterPole(null)}
        className="absolute -top-12 left-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm z-10 flex items-center gap-2 mb-4"
      >
        <span>←</span> Retour aux pôles
      </button>

      <section className="flex gap-4 mb-5 mt-8">
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-6 flex flex-col justify-center shadow-sm border border-slate-200 dark:border-slate-700 border-t-4 border-t-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-t-sky-500">
          <div className="text-[2.5rem] font-extrabold bg-gradient-to-br from-sky-500 to-sky-700 bg-clip-text text-transparent leading-none mb-2">{totalFormateursPole}</div>
          <div className="text-[0.85rem] text-slate-500 dark:text-slate-400 font-medium">Formateurs actifs</div>
        </div>
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-6 flex flex-col justify-center shadow-sm border border-slate-200 dark:border-slate-700 border-t-4 border-t-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-t-sky-500">
          <div className="text-[2.5rem] font-extrabold bg-gradient-to-br from-sky-500 to-sky-700 bg-clip-text text-transparent leading-none mb-2">{totalSeancesSemaine}</div>
          <div className="text-[0.85rem] text-slate-500 dark:text-slate-400 font-medium">Séances cette semaine</div>
        </div>
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-6 flex flex-col justify-center shadow-sm border border-slate-200 dark:border-slate-700 border-t-4 border-t-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-t-sky-500">
          <div className="text-[2.5rem] font-extrabold bg-gradient-to-br from-sky-500 to-sky-700 bg-clip-text text-transparent leading-none mb-2">{totalSallesPole}</div>
          <div className="text-[0.85rem] text-slate-500 dark:text-slate-400 font-medium">Salles utilisées</div>
        </div>
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-6 flex flex-col justify-center shadow-sm border border-slate-200 dark:border-slate-700 border-t-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ borderTopColor: pendingSessions.length > 0 ? '#f59e0b' : 'var(--border-color)' }}>
          <div className="text-[2.5rem] font-extrabold leading-none mb-2" style={{ color: pendingSessions.length > 0 ? '#f59e0b' : 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text', backgroundImage: pendingSessions.length === 0 ? 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)' : 'none' }}>{pendingSessions.length}</div>
          <div className="text-[0.85rem] text-slate-500 dark:text-slate-400 font-medium">Séances en attente</div>
        </div>
      </section>

      <section className="bg-white/95 backdrop-blur-md rounded-xl p-3 px-4 mb-3 shadow-sm border border-slate-200 dark:bg-slate-800/95 dark:border-slate-700">
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-nowrap gap-2 w-full overflow-x-auto pb-2">
            <div className="flex-1 min-w-[90px] flex flex-col gap-0.5 opacity-70 pointer-events-none">
              <label className="text-[0.55rem] font-bold text-slate-500 uppercase tracking-wide">Pôle Actuel</label>
              <select className="px-1.5 py-1 rounded border border-slate-200 bg-white text-[0.65rem] text-slate-900 outline-none cursor-pointer transition-colors hover:border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={filterPole} readOnly>
                <option value={filterPole}>{filterPole}</option>
              </select>
            </div>
            
            <div className="flex-1 min-w-[90px] flex flex-col gap-0.5">
              <label className="text-[0.55rem] font-bold text-slate-500 uppercase tracking-wide">Module</label>
              <select className="px-1.5 py-1 rounded border border-slate-200 bg-white text-[0.65rem] text-slate-900 outline-none cursor-pointer transition-colors hover:border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={filterModule} onChange={(e) => setFilterModule(e.target.value)}>
                <option value="all">Tous les modules</option>
                {listModules.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            
            <div className="flex-1 min-w-[90px] flex flex-col gap-0.5">
              <label className="text-[0.55rem] font-bold text-slate-500 uppercase tracking-wide">Année</label>
              <select className="px-1.5 py-1 rounded border border-slate-200 bg-white text-[0.65rem] text-slate-900 outline-none cursor-pointer transition-colors hover:border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={filterAnnee} onChange={(e) => setFilterAnnee(e.target.value)}>
                <option value="all">Toutes les années</option>
                {listAnnees.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            
            <div className="flex-1 min-w-[90px] flex flex-col gap-0.5">
              <label className="text-[0.55rem] font-bold text-slate-500 uppercase tracking-wide">Filière</label>
              <select className="px-1.5 py-1 rounded border border-slate-200 bg-white text-[0.65rem] text-slate-900 outline-none cursor-pointer transition-colors hover:border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={filterFiliere} onChange={(e) => setFilterFiliere(e.target.value)}>
                <option value="all">Toutes les filières</option>
                {listFilieres.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            
            <div className="flex-1 min-w-[90px] flex flex-col gap-0.5">
              <label className="text-[0.55rem] font-bold text-slate-500 uppercase tracking-wide">Groupe</label>
              <select className="px-1.5 py-1 rounded border border-slate-200 bg-white text-[0.65rem] text-slate-900 outline-none cursor-pointer transition-colors hover:border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={filterGroupe} onChange={(e) => setFilterGroupe(e.target.value)}>
                <option value="all">Tous les groupes</option>
                {listGroupes.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            
            <div className="flex-1 min-w-[100px] flex flex-col gap-0.5">
              <label className="text-[0.55rem] font-bold text-slate-500 uppercase tracking-wide">Formateur</label>
              <select className="px-1.5 py-1 rounded border border-slate-200 bg-white text-[0.65rem] text-slate-900 outline-none cursor-pointer transition-colors hover:border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={filterFormateur} onChange={(e) => setFilterFormateur(e.target.value)}>
                <option value="all">Tous les formateurs</option>
                {listFormateurs.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="flex-1 min-w-[90px] flex flex-col gap-0.5">
              <label className="text-[0.55rem] font-bold text-slate-500 uppercase tracking-wide">Salle</label>
              <select className="px-1.5 py-1 rounded border border-slate-200 bg-white text-[0.65rem] text-slate-900 outline-none cursor-pointer transition-colors hover:border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={filterSalle} onChange={(e) => setFilterSalle(e.target.value)}>
                <option value="all">Toutes les salles</option>
                {listSalles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-center w-full gap-3 mt-2">
            <div className="px-3 py-1 rounded-full text-[0.75rem] font-semibold bg-presentiel-bg text-presentiel-text dark:bg-presentiel-darkBg dark:text-presentiel-darkText">
              {totalPresentiel} Présentiel
            </div>
            <div className="px-3 py-1 rounded-full text-[0.75rem] font-semibold bg-distanciel-bg text-distanciel-text dark:bg-distanciel-darkBg dark:text-distanciel-darkText">
              {totalDistanciel} Distanciel
            </div>
            <button className="px-2.5 py-1 bg-gradient-to-br from-slate-50 to-slate-200 border-[1.5px] border-slate-200 rounded text-slate-600 text-[0.65rem] font-semibold cursor-pointer transition-colors whitespace-nowrap h-[26px] hover:bg-gradient-to-br hover:from-red-100 hover:to-red-200 hover:border-red-500 hover:text-red-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-500 dark:hover:text-red-500" onClick={handleResetFilters}>
              ↻ Réinitialiser
            </button>
            
            <div className="px-3 py-1 rounded-full text-[0.75rem] font-semibold bg-sky-100 text-sky-700 border border-sky-200 flex items-center dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800">
              Σ {totalHeures}h
            </div>
            <button className="px-2.5 py-1 bg-white border-[1.5px] border-slate-200 rounded text-slate-700 text-[0.65rem] font-semibold cursor-pointer transition-all whitespace-nowrap h-[26px] hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:border-slate-600" onClick={handleExportPDF}>
              ⬇ PDF
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white/95 backdrop-blur-md rounded-xl p-2 px-4 mb-4 shadow-sm border border-slate-200 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-brand border-none rounded-full text-white cursor-pointer text-[0.8rem] font-semibold transition-all shadow-sm hover:bg-brand-hover hover:-translate-y-px hover:shadow-md" onClick={previousWeek}>
            ← Semaine précédente
          </button>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[0.85rem] font-semibold text-slate-900 bg-brand-light px-3 py-1 rounded-full dark:bg-slate-800 dark:text-slate-200">{currentWeek.label}</span>
          <div className="flex gap-1">
            {weekDays.map((wd, idx) => (
              <div key={idx} className={`px-2 py-1 bg-white rounded-md text-[0.7rem] font-medium text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 ${idx === new Date().getDay() - 1 ? '!bg-sky-500 !text-white !border-sky-500 shadow-sm' : ''}`}>
                {wd.day.slice(0, 3)} {wd.date.getDate()}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button className="px-4 py-2 bg-brand border-none rounded-full text-white cursor-pointer text-[0.8rem] font-semibold transition-all shadow-sm hover:bg-brand-hover hover:-translate-y-px hover:shadow-md" onClick={nextWeek}>
            Semaine suivante →
          </button>
        </div>
      </section>

      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-white/30 dark:bg-slate-800 dark:border-slate-700">
        {viewMode === 'grid' ? (
          <table className="w-full border-collapse table-fixed text-[0.7rem]">
            <thead>
              <tr>
                <th className="bg-gradient-to-br from-slate-50 to-slate-100 p-2 border-b-2 border-slate-200 text-[0.65rem] text-slate-500 font-bold uppercase tracking-wide dark:from-slate-900 dark:to-slate-800 dark:border-slate-700 dark:text-slate-100">Jours</th>
                {timeSlots.map(slot => (
                  <th key={slot} className="bg-gradient-to-br from-slate-50 to-slate-100 p-2 border-b-2 border-slate-200 text-[0.65rem] text-slate-500 font-bold uppercase tracking-wide dark:from-slate-900 dark:to-slate-800 dark:border-slate-700 dark:text-slate-100">{slot}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekDays.map((weekDay) => (
                <tr key={weekDay.day}>
                  <td className="w-[60px] font-bold text-center bg-gradient-to-br from-slate-50 to-slate-100 border-r-2 border-slate-200 text-slate-900 text-[0.7rem] uppercase tracking-wide p-1.5 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700 dark:text-slate-100">
                    <div>{weekDay.day}</div>
                    <div style={{ fontSize: '0.5rem', opacity: 0.9 }}>{weekDay.date.getDate()}/{weekDay.date.getMonth() + 1}</div>
                  </td>
                  {timeSlots.map((slot, sIdx) => {
                    const cellSessions = filteredSessions.filter(s => s.day === weekDay.day && s.slotIdx === sIdx);
                    return (
                      <td key={sIdx} className="h-[85px] border border-slate-100 relative p-[3px] transition-colors bg-white hover:bg-sky-50 hover:border-sky-200 cursor-default group align-top dark:bg-transparent dark:border-slate-700 dark:hover:bg-slate-800/50">
                        <div className={cellSessions.length > 1 ? "grid grid-cols-2 gap-[4px] h-full" : "flex flex-col gap-[2px] h-full min-h-[60px]"} data-count={cellSessions.length}>
                          {cellSessions.map(s => {
                            const isCompact = cellSessions.length > 1;

                            const paddingClass = isCompact ? 'p-1 px-1.5' : 'p-2';
                            const borderLeftClass = isCompact ? 'border-l-[2px]' : 'border-l-[4px]';
                            const moduleFontClass = isCompact ? 'text-[0.52rem] leading-tight mb-0.5' : 'text-[0.65rem] mb-0.5 leading-tight';
                            const subFontClass = isCompact ? 'text-[0.45rem] leading-none' : 'text-[0.55rem]';
                            const footerFontClass = 'text-[0.45rem] mt-1 pt-1';
                            const hideFooter = isCompact;

                            return (
                              <div key={s.id} className={`relative rounded-lg transition-all duration-300 ease-out shadow-sm border flex-shrink-0 overflow-hidden hover:shadow-md hover:-translate-y-1 group/card ${paddingClass} ${
                                s.type === 'presentiel'
                                  ? `bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 ${borderLeftClass} border-l-emerald-500 dark:from-emerald-950 dark:to-emerald-900 dark:border-emerald-800 dark:border-l-emerald-400`
                                  : `bg-gradient-to-br from-cyan-50 to-blue-100 border-cyan-200 ${borderLeftClass} border-l-cyan-600 dark:from-slate-800 dark:to-blue-950 dark:border-blue-900 dark:border-l-blue-400`
                              }`}>
                                
                                {/* Badge P/D */}
                                <div className={`absolute top-0.5 right-0.5 text-[0.42rem] font-extrabold px-0.5 py-[0.5px] rounded ${s.type === 'presentiel' ? 'text-emerald-700 bg-emerald-600/10 dark:text-emerald-300 dark:bg-emerald-500/20' : 'text-cyan-800 bg-cyan-700/10 dark:text-blue-300 dark:bg-blue-500/20'} ${isCompact ? 'hidden' : ''}`}>
                                  {s.type === 'presentiel' ? 'P' : 'D'}
                                </div>

                                <div className={`font-bold tracking-tight pr-3 ${s.type === 'presentiel' ? 'text-emerald-900 dark:text-emerald-100' : 'text-cyan-900 dark:text-blue-100'} ${moduleFontClass}`}>{s.module}</div>
                                <div className={`font-medium ${s.type === 'presentiel' ? 'text-emerald-700 dark:text-emerald-400' : 'text-cyan-800 dark:text-blue-300'} ${subFontClass}`}>{s.formateur} • {s.salle}</div>
                                {!hideFooter && (s.annee || s.filiere || s.groupe) && (
                                  <div className={`font-semibold uppercase tracking-wider border-t-[0.5px] ${s.type === 'presentiel' ? 'text-emerald-600 border-emerald-600/20 dark:border-emerald-400/20 dark:text-emerald-500' : 'text-cyan-700 border-blue-600/20 dark:border-blue-400/20 dark:text-blue-400'} ${footerFontClass}`}>
                                    {s.annee} {s.filiere && `• ${s.filiere}`} {s.groupe && `• ${s.groupe}`}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4 flex flex-col gap-4">
            {weekDays.map(weekDay => {
              const daySessions = filteredSessions.filter(s => s.day === weekDay.day).sort((a, b) => a.slotIdx - b.slotIdx);
              if (daySessions.length === 0) return null;
              
              return (
                <div key={weekDay.day} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="border-b-2 border-slate-200 dark:border-slate-700 pb-2 mb-3 flex justify-between text-slate-900 dark:text-slate-100">
                    <span>{weekDay.day}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{weekDay.date.getDate()}/{weekDay.date.getMonth() + 1}</span>
                  </h3>
                  <div className="flex flex-col gap-2">
                    {daySessions.map(s => (
                      <div key={s.id} className={`p-3 rounded-lg border-l-4 ${s.type === 'presentiel' ? 'bg-presentiel-bg border-presentiel-accent dark:bg-presentiel-darkBg dark:border-presentiel-text' : 'bg-distanciel-bg border-distanciel-accent dark:bg-distanciel-darkBg dark:border-brand-light'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-base">{timeSlots[s.slotIdx]}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${s.type === 'presentiel' ? 'bg-presentiel-accent/20 text-presentiel-text dark:bg-presentiel-text/20 dark:text-presentiel-text' : 'bg-distanciel-accent/20 text-distanciel-text dark:bg-brand-light/20 dark:text-brand-light'}`}>{s.type}</span>
                        </div>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">{s.module}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">👨‍🏫 {s.formateur} &nbsp; 🏫 {s.salle}</div>
                        {(s.annee || s.filiere || s.groupe) && <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">🎓 {s.annee} {s.filiere && `• ${s.filiere}`} {s.groupe && `• ${s.groupe}`}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {filteredSessions.length === 0 && <p className="text-center text-slate-500">Aucune séance pour cette semaine.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionnaireStagiaire;