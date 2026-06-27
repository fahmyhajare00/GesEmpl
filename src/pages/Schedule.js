import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSession, removeSession, moveSession, acceptSession, updateConfig, addToConfig, removeFromConfig } from '../store';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../index.css';

const Schedule = () => {
  const { user, sessions, config } = useSelector(state => state.schedule);
  const dispatch = useDispatch();
  const [filterPole, setFilterPole] = useState('all');
  const [filterFormateur, setFilterFormateur] = useState('all');
  const [filterSalle, setFilterSalle] = useState('all');
  const [filterModule, setFilterModule] = useState('all');
  const [filterAnnee, setFilterAnnee] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [filterFiliere, setFilterFiliere] = useState('all');
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    return getWeekRange(today);
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeCell, setActiveCell] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({ 
    module: '', formateur: '', salle: '',lien: '', pole: 'Digital', type: 'presentiel',
    annee: '', filiere: '', date: ''
  });
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
      return mP && mF && mS && mModule && mAnnee && mDate && mFiliere;
    });
  }, [sessions, currentWeekKey, filterPole, filterFormateur, filterSalle, filterModule, filterAnnee, filterDate, filterFiliere]);

  const pendingSessions = useMemo(() => sessions.filter(s => s.status === 'pending'), [sessions]);

  // --- CALCUL DU TOTAL DES HEURES ---
  const totalHeures = useMemo(() => {
    return filteredSessions.length * config.sessionDuration;
  }, [filteredSessions, config.sessionDuration]);

  const totalPresentiel = useMemo(() => filteredSessions.filter(s => s.type === 'presentiel').length, [filteredSessions]);
  const totalDistanciel = useMemo(() => filteredSessions.filter(s => s.type === 'distanciel').length, [filteredSessions]);

  const listFormateurs = config.formateurs;
  const listSalles = config.salles;
  const listModules = [...new Set(sessions.map(s => s.module))];
  const listAnnees = config.annees;
  const listFilieres = config.filieres;
  const timeSlots = config.timeSlots || [];

  // --- STATS DYNAMIQUES DASHBOARD ---
  const totalFormateursPole = listFormateurs.length;
  const totalSallesPole = listSalles.length;
  const totalSeancesSemaine = filteredSessions.length;

  // --- ACTIONS ---
  const handleOpenAdd = (day, slotIdx) => {
    setEditingSession(null);
    setActiveCell({ day, slotIdx });
    setFormData({ 
      module: '', formateur: '', salle: '', pole: 'Digital', type: 'presentiel',
      annee: '', filiere: '', date: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e, session) => {
    e.stopPropagation();
    setEditingSession(session);
    setFormData({ ...session });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingSession(null);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const targetDay = editingSession ? editingSession.day : activeCell?.day;
    const targetSlotIdx = editingSession ? editingSession.slotIdx : activeCell?.slotIdx;

    if (targetDay !== undefined && targetSlotIdx !== undefined) {
      const conflict = sessions.find(s => 
        s.id !== editingSession?.id && 
        s.day === targetDay && 
        s.slotIdx === targetSlotIdx && 
        (s.formateur === formData.formateur || s.salle === formData.salle)
      );

      if (conflict) {
        alert(`⚠️ Conflit détecté !\n${conflict.formateur === formData.formateur ? 'Ce formateur' : 'Cette salle'} est déjà assigné(e) à une autre séance (${conflict.module}).`);
        return;
      }
    }

    if (editingSession) {
      dispatch(removeSession(editingSession.id));
      dispatch(addSession({ ...formData, id: editingSession.id, weekKey: currentWeekKey }));
    } else {
      dispatch(addSession({ ...formData, id: Date.now(), ...activeCell, weekKey: currentWeekKey }));
    }
    handleClose();
  };

  const handleResetFilters = () => {
    setFilterPole('all');
    setFilterFormateur('all');
    setFilterSalle('all');
    setFilterModule('all');
    setFilterAnnee('all');
    setFilterDate('');
    setFilterFiliere('all');
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

  const handleDragStart = (e, sessionId) => e.dataTransfer.setData("sessionId", sessionId);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, targetDay, targetSlotIdx) => {
    e.preventDefault();
    const sessionId = Number(e.dataTransfer.getData("sessionId"));
    dispatch(moveSession({ id: sessionId, day: targetDay, slotIdx: targetSlotIdx }));
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

  return (
    <div className="app-container">
      <section className="flex gap-4 mb-5">
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
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-6 flex flex-col justify-center shadow-sm border border-slate-200 dark:border-slate-700 border-t-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer" style={{ borderTopColor: pendingSessions.length > 0 ? '#f59e0b' : 'var(--border-color)' }} onClick={() => setIsPendingModalOpen(true)}>
          <div className="text-[2.5rem] font-extrabold leading-none mb-2" style={{ color: pendingSessions.length > 0 ? '#f59e0b' : 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text', backgroundImage: pendingSessions.length === 0 ? 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)' : 'none' }}>{pendingSessions.length}</div>
          <div className="text-[0.85rem] text-slate-500 dark:text-slate-400 font-medium">Séances à accepter</div>
        </div>
      </section>

      <section className="bg-white/95 backdrop-blur-md rounded-xl p-3 px-4 mb-3 shadow-sm border border-slate-200 dark:bg-slate-800/95 dark:border-slate-700">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-nowrap gap-3 w-full overflow-x-auto pb-2">
            <div className="flex-1 min-w-[130px] flex flex-col gap-1">
              <label className="text-[0.55rem] font-bold text-slate-500 uppercase tracking-wide">Pôle</label>
              <select className="px-2 py-1 rounded border border-slate-200 bg-white text-[0.7rem] text-slate-900 outline-none cursor-pointer transition-colors hover:border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={filterPole} onChange={(e) => setFilterPole(e.target.value)}>
                <option value="all">Tous les pôles</option>
                {config.poles.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            
            <div className="flex-1 min-w-[140px] flex flex-col gap-1">
              <label className="text-[0.55rem] font-bold text-slate-500 uppercase tracking-wide">Module</label>
              <select className="px-2 py-1 rounded border border-slate-200 bg-white text-[0.7rem] text-slate-900 outline-none cursor-pointer transition-colors hover:border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={filterModule} onChange={(e) => setFilterModule(e.target.value)}>
                <option value="all">Tous les modules</option>
                {listModules.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            
            <div className="flex-1 min-w-[140px] flex flex-col gap-1">
              <label className="text-[0.55rem] font-bold text-slate-500 uppercase tracking-wide">Année</label>
              <select className="px-2 py-1 rounded border border-slate-200 bg-white text-[0.7rem] text-slate-900 outline-none cursor-pointer transition-colors hover:border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={filterAnnee} onChange={(e) => setFilterAnnee(e.target.value)}>
                <option value="all">Toutes les années</option>
                {listAnnees.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            
            <div className="flex-1 min-w-[140px] flex flex-col gap-1">
              <label className="text-[0.55rem] font-bold text-slate-500 uppercase tracking-wide">Filière</label>
              <select className="px-2 py-1 rounded border border-slate-200 bg-white text-[0.7rem] text-slate-900 outline-none cursor-pointer transition-colors hover:border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={filterFiliere} onChange={(e) => setFilterFiliere(e.target.value)}>
                <option value="all">Toutes les filières</option>
                {listFilieres.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            
            <div className="flex-1 min-w-[150px] flex flex-col gap-1">
              <label className="text-[0.55rem] font-bold text-slate-500 uppercase tracking-wide">Formateur</label>
              <select className="px-2 py-1 rounded border border-slate-200 bg-white text-[0.7rem] text-slate-900 outline-none cursor-pointer transition-colors hover:border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={filterFormateur} onChange={(e) => setFilterFormateur(e.target.value)}>
                <option value="all">Tous les formateurs</option>
                {listFormateurs.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="flex-1 min-w-[140px] flex flex-col gap-1">
              <label className="text-[0.55rem] font-bold text-slate-500 uppercase tracking-wide">Salle</label>
              <select className="px-2 py-1 rounded border border-slate-200 bg-white text-[0.7rem] text-slate-900 outline-none cursor-pointer transition-colors hover:border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={filterSalle} onChange={(e) => setFilterSalle(e.target.value)}>
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
            <button className="px-2.5 py-1 bg-gradient-to-br from-red-50 to-red-100 border-[1.5px] border-red-500 rounded text-red-500 text-[0.65rem] font-semibold cursor-pointer transition-colors whitespace-nowrap h-[26px] hover:bg-red-500 hover:text-white dark:bg-slate-800 dark:border-slate-700 dark:hover:border-red-500" onClick={handleExportPDF}>
              ⬇ PDF
            </button>

            <button className="inline-flex items-center gap-1.5 bg-gradient-to-br from-sky-400 to-blue-700 text-white border-none px-3.5 py-2 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all shadow-[0_4px_10px_rgba(37,99,235,0.25)] hover:bg-gradient-to-br hover:from-blue-700 hover:to-blue-800 hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(37,99,235,0.35)] active:translate-y-0 active:shadow-[0_3px_8px_rgba(37,99,235,0.25)] focus:outline-none focus:ring-2 focus:ring-blue-500/30" onClick={() => setIsModalOpen(true)}>
              + Nouvelle séance
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
                      <td key={sIdx} className="h-[85px] border border-slate-100 relative p-[3px] transition-colors bg-white hover:bg-sky-50 hover:border-sky-200 cursor-pointer hover:shadow-[inset_0_0_0_1px_#bae6fd] group align-top dark:bg-transparent dark:border-slate-700 dark:hover:bg-slate-800/50" onClick={() => handleOpenAdd(weekDay.day, sIdx)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, weekDay.day, sIdx)}>
                        <div className="flex flex-col gap-[2px] h-full min-h-[60px]" data-count={cellSessions.length}>
                          {cellSessions.map(s => (
                            <div key={s.id} className={`relative rounded-lg cursor-grab transition-all duration-300 ease-out shadow-sm border flex-shrink-0 overflow-hidden hover:shadow-md hover:-translate-y-1 active:cursor-grabbing active:scale-95 group/card ${
                              s.type === 'presentiel'
                                ? 'bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 border-l-[4px] border-l-emerald-500 dark:from-emerald-950 dark:to-emerald-900 dark:border-emerald-800 dark:border-l-emerald-400 p-2'
                                : 'bg-gradient-to-br from-cyan-50 to-blue-100 border-cyan-200 border-l-[4px] border-l-cyan-600 dark:from-slate-800 dark:to-blue-950 dark:border-blue-900 dark:border-l-blue-400 p-2'
                            }`} draggable onDragStart={(e) => handleDragStart(e, s.id)} onClick={(e) => handleOpenEdit(e, s)}>
                              
                              {/* Badge P/D (disappears on hover) */}
                              <div className={`absolute top-1 right-1 text-[0.45rem] font-extrabold px-1 py-[1px] rounded transition-opacity duration-200 ${s.type === 'presentiel' ? 'text-emerald-700 bg-emerald-600/10 dark:text-emerald-300 dark:bg-emerald-500/20' : 'text-cyan-800 bg-cyan-700/10 dark:text-blue-300 dark:bg-blue-500/20'} group-hover/card:opacity-0`}>
                                {s.type === 'presentiel' ? 'P' : 'D'}
                              </div>

                              {/* Delete Button (appears on hover) */}
                              <button 
                                className="absolute top-1 right-1 w-5 h-5 rounded flex items-center justify-center bg-red-100 text-red-600 border border-red-200 opacity-0 group-hover/card:opacity-100 transition-all duration-200 hover:bg-red-500 hover:text-white dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white z-10"
                                onClick={(e) => { e.stopPropagation(); if(window.confirm("Voulez-vous vraiment supprimer cette séance ?")) dispatch(removeSession(s.id)); }}
                                title="Supprimer la séance"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-[12px] w-[12px]" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>

                              <div className={`font-bold tracking-tight leading-tight pr-4 ${s.type === 'presentiel' ? 'text-emerald-900 dark:text-emerald-100' : 'text-cyan-900 dark:text-blue-100'} text-[0.65rem] mb-0.5`}>{s.module}</div>
                              <div className={`font-medium ${s.type === 'presentiel' ? 'text-emerald-700 dark:text-emerald-400' : 'text-cyan-800 dark:text-blue-300'} text-[0.55rem]`}>{s.formateur} • {s.salle}</div>
                              {(s.annee || s.filiere) && <div className={`font-semibold uppercase tracking-wider mt-1 pt-1 border-t-[0.5px] ${s.type === 'presentiel' ? 'text-emerald-600 border-emerald-600/20 dark:border-emerald-400/20 dark:text-emerald-500' : 'text-cyan-700 border-blue-600/20 dark:border-blue-400/20 dark:text-blue-400'} text-[0.45rem]`}>{s.annee} {s.filiere && `• ${s.filiere}`}</div>}
                            </div>
                          ))}
                        </div>
                        <div className="absolute bottom-[3px] right-[5px] text-slate-400 text-[0.9rem] font-light opacity-0 transition-opacity w-[18px] h-[18px] flex items-center justify-center bg-brand-light rounded-full text-brand group-hover:opacity-100">+</div>
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
                      <div key={s.id} className={`p-3 cursor-pointer rounded-lg border-l-4 ${s.type === 'presentiel' ? 'bg-presentiel-bg border-presentiel-accent dark:bg-presentiel-darkBg dark:border-presentiel-text' : 'bg-distanciel-bg border-distanciel-accent dark:bg-distanciel-darkBg dark:border-brand-light'}`} onClick={(e) => handleOpenEdit(e, s)}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-base">{timeSlots[s.slotIdx]}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${s.type === 'presentiel' ? 'bg-presentiel-accent/20 text-presentiel-text dark:bg-presentiel-text/20 dark:text-presentiel-text' : 'bg-distanciel-accent/20 text-distanciel-text dark:bg-brand-light/20 dark:text-brand-light'}`}>{s.type}</span>
                        </div>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">{s.module}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">👨‍🏫 {s.formateur} &nbsp; 🏫 {s.salle}</div>
                        {(s.annee || s.filiere) && <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">🎓 {s.annee} {s.filiere && `• ${s.filiere}`}</div>}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[1000] animate-fadeIn" onClick={handleClose}>
          <div className="bg-white dark:bg-slate-800 w-[400px] max-w-[90%] p-5 rounded-xl shadow-xl animate-slideUp border border-white/30 dark:border-slate-700" onClick={e => e.stopPropagation()}>
            <h2 className="mt-0 mb-4 text-lg font-bold tracking-tight bg-gradient-to-br from-brand to-purple-600 bg-clip-text text-transparent">{editingSession ? 'Modifier la Séance' : 'Nouvelle Séance'}</h2>
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-wide">Module</label>
                <select required className="px-2 py-1.5 rounded-md border-1.5 border-slate-200 text-xs text-slate-900 outline-none transition-colors bg-white hover:border-brand-light focus:border-brand focus:ring-2 focus:ring-brand/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={formData.module} onChange={e => setFormData({...formData, module: e.target.value})}>
                  <option value="" disabled>Sélectionner un module</option>
                  {listModules.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-wide">Formateur</label>
                <select required className="px-2 py-1.5 rounded-md border-1.5 border-slate-200 text-xs text-slate-900 outline-none transition-colors bg-white hover:border-brand-light focus:border-brand focus:ring-2 focus:ring-brand/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={formData.formateur} onChange={e => setFormData({...formData, formateur: e.target.value})}>
                  <option value="" disabled>Sélectionner un formateur</option>
                  {listFormateurs.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-wide">
                {formData.type === 'presentiel' ? 'Salle' : 'Lien'}
                </label>

                {formData.type === 'presentiel' ? (
                <select
                  required
                  className="px-2 py-1.5 rounded-md border-1.5 border-slate-200 text-xs text-slate-900 outline-none transition-colors bg-white hover:border-brand-light focus:border-brand focus:ring-2 focus:ring-brand/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                  value={formData.salle}
                  onChange={e => setFormData({...formData, salle: e.target.value})}
                 >
                <option value="">Sélectionner une salle</option>
                {listSalles
                    .filter(salle => {
                      const targetDay = editingSession
                        ? editingSession.day
                        : activeCell?.day;

                      const targetSlotIdx = editingSession
                        ? editingSession.slotIdx
                        : activeCell?.slotIdx;

                      return !sessions.some(sess =>
                        sess.id !== editingSession?.id &&
                        sess.day === targetDay &&
                        sess.slotIdx === targetSlotIdx &&
                        sess.salle === salle
                      );
                    })
                    .map(salle => (
                      <option key={salle} value={salle}>
                        {salle}
                      </option>
                  ))}
               </select>
                          ) : (
                <input
                  type="url"
                  className="px-2 py-1.5 rounded-md border-1.5 border-slate-200 text-xs text-slate-900 outline-none transition-colors bg-white hover:border-brand-light focus:border-brand focus:ring-2 focus:ring-brand/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                  placeholder="https://meet.google.com/..."
                  value={formData.lien}
                  onChange={e => setFormData({...formData, lien: e.target.value})}
                  required
                />
              )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-wide">Pôle</label>
                <select className="px-2 py-1.5 rounded-md border-1.5 border-slate-200 text-xs text-slate-900 outline-none transition-colors bg-white hover:border-brand-light focus:border-brand focus:ring-2 focus:ring-brand/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={formData.pole} onChange={e => setFormData({...formData, pole: e.target.value})}>
                  {config.poles.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-wide">Type</label>
                <div className="flex bg-slate-100 p-0.5 rounded gap-0.5 dark:bg-slate-900">
                  <button type="button" className={`flex-1 border-none py-1 px-1.5 rounded-sm text-[0.65rem] font-semibold cursor-pointer bg-transparent transition-colors text-slate-500 hover:bg-white/50 ${formData.type === 'presentiel' ? 'bg-white shadow-sm font-bold text-brand dark:bg-slate-800 dark:text-brand-light' : ''}`} onClick={() => setFormData({...formData, type: 'presentiel'})}>Présentiel</button>
                  <button type="button" className={`flex-1 border-none py-1 px-1.5 rounded-sm text-[0.65rem] font-semibold cursor-pointer bg-transparent transition-colors text-slate-500 hover:bg-white/50 ${formData.type === 'distanciel' ? 'bg-white shadow-sm font-bold text-brand dark:bg-slate-800 dark:text-brand-light' : ''}`} onClick={() => setFormData({...formData, type: 'distanciel'})}>Distance</button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-wide">Année</label>
                <select className="px-2 py-1.5 rounded-md border-1.5 border-slate-200 text-xs text-slate-900 outline-none transition-colors bg-white hover:border-brand-light focus:border-brand focus:ring-2 focus:ring-brand/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={formData.annee || ''} onChange={e => setFormData({...formData, annee: e.target.value})}>
                  <option value="">Sélectionner</option>
                  {config.annees.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-wide">Filière</label>
                <select className="px-2 py-1.5 rounded-md border-1.5 border-slate-200 text-xs text-slate-900 outline-none transition-colors bg-white hover:border-brand-light focus:border-brand focus:ring-2 focus:ring-brand/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={formData.filiere || ''} onChange={e => setFormData({...formData, filiere: e.target.value})}>
                  <option value="">Sélectionner</option>
                  {config.filieres.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-wide">Date</label>
                <input type="date" className="px-2 py-1.5 rounded-md border-1.5 border-slate-200 text-xs text-slate-900 outline-none transition-colors bg-white hover:border-brand-light focus:border-brand focus:ring-2 focus:ring-brand/10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="flex justify-end gap-2 mt-3.5 col-span-2">
                <button type="button" className="px-3.5 py-1.5 rounded font-semibold text-xs cursor-pointer transition-colors bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" onClick={handleClose}>Annuler</button>
                <button type="submit" className="px-3.5 py-1.5 rounded font-semibold text-xs cursor-pointer transition-colors bg-gradient-to-br from-brand to-blue-500 text-white shadow-sm border-none hover:-translate-y-px hover:shadow-md">{editingSession ? 'Mettre à jour' : 'Ajouter la séance'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isPendingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[1000] animate-fadeIn" onClick={() => setIsPendingModalOpen(false)}>
          <div className="bg-white dark:bg-slate-800 w-[600px] max-w-[90%] p-5 rounded-xl shadow-xl animate-slideUp border border-white/30 dark:border-slate-700" onClick={e => e.stopPropagation()}>
            <h2 className="mt-0 mb-4 text-lg font-bold tracking-tight bg-gradient-to-br from-brand to-purple-600 bg-clip-text text-transparent">Séances en attente de validation</h2>
            {pendingSessions.length === 0 ? (
              <p className="text-center text-slate-500 py-5">Aucune séance en attente.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingSessions.map(s => (
                  <div key={s.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center dark:bg-slate-900/50 dark:border-slate-700">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">{s.module}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{s.formateur} • {s.salle} • {s.day} ({timeSlots[s.slotIdx]})</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { dispatch(removeSession(s.id)); }} className="bg-red-500 text-white border-none py-1.5 px-3 rounded cursor-pointer hover:bg-red-600 transition-colors">Refuser</button>
                      <button onClick={() => { dispatch(acceptSession(s.id)); }} className="bg-emerald-500 text-white border-none py-1.5 px-3 rounded cursor-pointer hover:bg-emerald-600 transition-colors">Accepter</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-5">
              <button type="button" className="px-3.5 py-1.5 rounded font-semibold text-xs cursor-pointer transition-colors bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" onClick={() => setIsPendingModalOpen(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;