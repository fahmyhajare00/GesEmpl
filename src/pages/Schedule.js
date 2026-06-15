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
      <section className="stats-dashboard">
        <div className="stat-card">
          <div className="stat-number">{totalFormateursPole}</div>
          <div className="stat-label">Formateurs actifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalSeancesSemaine}</div>
          <div className="stat-label">Séances cette semaine</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalSallesPole}</div>
          <div className="stat-label">Salles utilisées</div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer', border: pendingSessions.length > 0 ? '1px solid #f59e0b' : '' }} onClick={() => setIsPendingModalOpen(true)}>
          <div className="stat-number" style={{ color: pendingSessions.length > 0 ? '#f59e0b' : '' }}>{pendingSessions.length}</div>
          <div className="stat-label">Séances à accepter</div>
        </div>
      </section>

      <section className="filters-section">
        <div className="filters-grid">
          <div className="filters-row-selectors" style={{ display: 'flex', flexWrap: 'nowrap', gap: '12px', width: '100%', overflowX: 'auto', paddingBottom: '8px' }}>
            <div className="filter-group" style={{ minWidth: '130px' }}>
              <label>Pôle</label>
              <select value={filterPole} onChange={(e) => setFilterPole(e.target.value)}>
                <option value="all">Tous les pôles</option>
                {config.poles.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            
            <div className="filter-group" style={{ minWidth: '140px' }}>
              <label>Module</label>
              <select value={filterModule} onChange={(e) => setFilterModule(e.target.value)}>
                <option value="all">Tous les modules</option>
                {listModules.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            
            <div className="filter-group" style={{ minWidth: '140px' }}>
              <label>Année</label>
              <select value={filterAnnee} onChange={(e) => setFilterAnnee(e.target.value)}>
                <option value="all">Toutes les années</option>
                {listAnnees.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            
            <div className="filter-group" style={{ minWidth: '140px' }}>
              <label>Filière</label>
              <select value={filterFiliere} onChange={(e) => setFilterFiliere(e.target.value)}>
                <option value="all">Toutes les filières</option>
                {listFilieres.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            
            <div className="filter-group" style={{ minWidth: '150px' }}>
              <label>Formateur</label>
              <select value={filterFormateur} onChange={(e) => setFilterFormateur(e.target.value)}>
                <option value="all">Tous les formateurs</option>
                {listFormateurs.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="filter-group" style={{ minWidth: '140px' }}>
              <label>Salle</label>
              <select value={filterSalle} onChange={(e) => setFilterSalle(e.target.value)}>
                <option value="all">Toutes les salles</option>
                {listSalles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          
          <div className="filters-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px', alignItems: 'center' }}>
            <div className="session-type-badge presentiel-badge">
              {totalPresentiel} Présentiel
            </div>
            <div className="session-type-badge distanciel-badge">
              {totalDistanciel} Distanciel
            </div>
            <button className="btn-reset-filters" onClick={handleResetFilters}>
              ↻ Réinitialiser
            </button>
            
            <div className="total-hours-badge">
              Σ {totalHeures}h
            </div>
            <button className="btn-pdf" onClick={handleExportPDF}>
              ⬇ PDF
            </button>

            <button className="btn-new-session" onClick={() => setIsModalOpen(true)}>
              + Nouvelle séance
            </button>
          </div>
        </div>
      </section>

      <section className="week-bar">
        <div className="week-nav-side">
          <button className="btn-reset-filters" style={{ padding: '8px 16px', borderRadius: '20px' }} onClick={previousWeek}>
            ← Semaine précédente
          </button>
        </div>
        <div className="week-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span className="week-range" style={{ fontSize: '1rem', background: 'transparent', color: '#0f172a' }}>{currentWeek.label}</span>
          <div className="week-days">
            {weekDays.map((wd, idx) => (
              <div key={idx} className={`week-day-badge ${idx === new Date().getDay() - 1 ? 'active' : ''}`}>
                {wd.day.slice(0, 3)} {wd.date.getDate()}
              </div>
            ))}
          </div>
        </div>
        <div className="week-nav-side" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-reset-filters" style={{ padding: '8px 16px', borderRadius: '20px' }} onClick={nextWeek}>
            Semaine suivante →
          </button>
        </div>
      </section>

      <div className="table-wrapper">
        {viewMode === 'grid' ? (
          <table className="schedule-table">
            <thead>
              <tr>
                <th className="day-col-head">Jours</th>
                {timeSlots.map(slot => (
                  <th key={slot} className="time-header">{slot}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekDays.map((weekDay) => (
                <tr key={weekDay.day}>
                  <td className="day-col">
                    <div>{weekDay.day}</div>
                    <div style={{ fontSize: '0.5rem', opacity: 0.7 }}>{weekDay.date.getDate()}/{weekDay.date.getMonth() + 1}</div>
                  </td>
                  {timeSlots.map((slot, sIdx) => {
                    const cellSessions = filteredSessions.filter(s => s.day === weekDay.day && s.slotIdx === sIdx);
                    return (
                      <td key={sIdx} className="cell-interactive" onClick={() => handleOpenAdd(weekDay.day, sIdx)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, weekDay.day, sIdx)}>
                        <div className="cell-content">
                          {cellSessions.map(s => (
                            <div key={s.id} className={`session-card ${s.type}`} draggable onDragStart={(e) => handleDragStart(e, s.id)} onClick={(e) => handleOpenEdit(e, s)}>
                              <button className="btn-delete-circle" onClick={(e) => { e.stopPropagation(); if(window.confirm("Supprimer ?")) dispatch(removeSession(s.id)); }}>✕</button>
                              <div className="module-name">{s.module}</div>
                              <div className="sub-info">{s.formateur} • {s.salle}</div>
                              {(s.annee || s.filiere) && <div className="sub-info-extra">{s.annee} {s.filiere && `• ${s.filiere}`}</div>}
                            </div>
                          ))}
                        </div>
                        <div className="add-hint">+</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="agenda-list" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {weekDays.map(weekDay => {
              const daySessions = filteredSessions.filter(s => s.day === weekDay.day).sort((a, b) => a.slotIdx - b.slotIdx);
              if (daySessions.length === 0) return null;
              
              return (
                <div key={weekDay.day} className="agenda-day" style={{ background: 'var(--bg-card)', borderRadius: '8px', padding: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                  <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)' }}>
                    <span>{weekDay.day}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{weekDay.date.getDate()}/{weekDay.date.getMonth() + 1}</span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {daySessions.map(s => (
                      <div key={s.id} className={`session-card ${s.type}`} style={{ padding: '12px', cursor: 'pointer' }} onClick={(e) => handleOpenEdit(e, s)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1rem' }}>{timeSlots[s.slotIdx]}</span>
                          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: s.type === 'presentiel' ? 'var(--presentiel)' : 'var(--distanciel)', color: s.type === 'presentiel' ? 'var(--presentiel-text)' : 'var(--distanciel-text)' }}>{s.type}</span>
                        </div>
                        <div className="module-name" style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{s.module}</div>
                        <div className="sub-info" style={{ fontSize: '0.9rem' }}>👨‍🏫 {s.formateur} &nbsp; 🏫 {s.salle}</div>
                        {(s.annee || s.filiere) && <div className="sub-info-extra" style={{ fontSize: '0.8rem', marginTop: '4px' }}>🎓 {s.annee} {s.filiere && `• ${s.filiere}`}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {filteredSessions.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Aucune séance pour cette semaine.</p>}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{editingSession ? 'Modifier la Séance' : 'Nouvelle Séance'}</h2>
            <form onSubmit={handleSave} className="modal-grid-form">
              <div className="form-group full">
                <label>Module</label>
                <select required className="form-input" value={formData.module} onChange={e => setFormData({...formData, module: e.target.value})}>
                  <option value="" disabled>Sélectionner un module</option>
                  {listModules.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Formateur</label>
                <select required className="form-input" value={formData.formateur} onChange={e => setFormData({...formData, formateur: e.target.value})}>
                  <option value="" disabled>Sélectionner un formateur</option>
                  {listFormateurs.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>
                {formData.type === 'presentiel' ? 'Salle' : 'Lien'}
                </label>

                {formData.type === 'presentiel' ? (
                <select
                  required
                  className="form-input"
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
                  className="form-input"
                  placeholder="https://meet.google.com/..."
                  value={formData.lien}
                  onChange={e => setFormData({...formData, lien: e.target.value})}
                  required
                />
              )}
              </div>
              <div className="form-group">
                <label>Pôle</label>
                <select className="form-input" value={formData.pole} onChange={e => setFormData({...formData, pole: e.target.value})}>
                  {config.poles.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Type</label>
                <div className="type-toggle-group">
                  <button type="button" className={`toggle-btn ${formData.type === 'presentiel' ? 'active' : ''}`} onClick={() => setFormData({...formData, type: 'presentiel'})}>Présentiel</button>
                  <button type="button" className={`toggle-btn ${formData.type === 'distanciel' ? 'active' : ''}`} onClick={() => setFormData({...formData, type: 'distanciel'})}>Distance</button>
                </div>
              </div>
              <div className="form-group">
                <label>Année</label>
                <select className="form-input" value={formData.annee || ''} onChange={e => setFormData({...formData, annee: e.target.value})}>
                  <option value="">Sélectionner</option>
                  {config.annees.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Filière</label>
                <select className="form-input" value={formData.filiere || ''} onChange={e => setFormData({...formData, filiere: e.target.value})}>
                  <option value="">Sélectionner</option>
                  {config.filieres.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group full">
                <label>Date</label>
                <input type="date" className="form-input" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="modal-footer full">
                <button type="button" className="btn-secondary" onClick={handleClose}>Annuler</button>
                <button type="submit" className="btn-primary">{editingSession ? 'Mettre à jour' : 'Ajouter la séance'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isPendingModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPendingModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h2 className="modal-title">Séances en attente de validation</h2>
            {pendingSessions.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>Aucune séance en attente.</p>
            ) : (
              <div className="pending-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingSessions.map(s => (
                  <div key={s.id} style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{s.module}</div>
                      <div style={{ fontSize: '0.85rem', color: '#475569' }}>{s.formateur} • {s.salle} • {s.day} ({timeSlots[s.slotIdx]})</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => { dispatch(removeSession(s.id)); }} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Refuser</button>
                      <button onClick={() => { dispatch(acceptSession(s.id)); }} style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Accepter</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-footer full" style={{ marginTop: '20px' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsPendingModalOpen(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;