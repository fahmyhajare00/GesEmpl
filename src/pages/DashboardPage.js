import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import SessionModal from '../components/schedule/SessionModal';
import { exportSchedulePDF } from '../utils/pdfExport';

// Mocked authenticated trainer (Will be replaced by Laravel Auth)
const CURRENT_FORMATEUR = { id: 1, prenom: 'Ahmed', nom: 'Benani', pole_id: 1 };

/* ─────────────────────────────────────────────
   Session Detail Popup Component (Enhanced UX)
───────────────────────────────────────────── */
const DetailPopup = ({ seance, modules, groupes, espaces, onClose, onDelete }) => {
  const mod = modules.find(m => m.id === seance.module_id) || {};
  const gIds = seance.groupes_ids || (seance.groupe_id ? [seance.groupe_id] : []);
  const grpNames = gIds.map(id => (groupes.find(g => g.id === id) || {}).nom_groupe).filter(Boolean).join(' + ') || '—';
  const esp = espaces.find(e => e.id === seance.espace_id) || {};
  const isPending = seance.statut === 'En attente';
  const isDelPending = seance.statut === 'Suppression en attente';
  const isPresentiel = seance.type_seance === 'Présentiel';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm border border-slate-100 dark:border-slate-700 animate-slideUp overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Bandeau supérieur décoratif */}
        <div className={`h-12 w-full ${isPresentiel ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-cyan-400 to-blue-500'}`} />

        {/* Header avec Avatar / Icône */}
        <div className="px-6 pb-4 relative">
          <div className={`absolute -top-6 left-6 w-12 h-12 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-sm ${isPresentiel ? 'bg-emerald-100 text-emerald-600' : 'bg-cyan-100 text-cyan-600'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <button onClick={onClose} className="absolute top-2 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition-colors dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="pt-8">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">{mod.nom_module || 'Séance'}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{seance.jour}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{seance.heure_debut} - {seance.heure_fin}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-2 space-y-4">
          
          {/* Statut badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-1 rounded-md text-[0.65rem] font-bold uppercase tracking-wider
              ${isPresentiel ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'}`}>
              {seance.type_seance}
            </span>
            {isDelPending ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.65rem] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Suppression
              </span>
            ) : isPending ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.65rem] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                En attente
              </span>
            ) : null}
          </div>

          {/* Grid d'infos */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Groupes
              </p>
              <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{grpNames}</p>
            </div>
            <div>
              <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                Salle
              </p>
              <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{esp.nom_espace || '—'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Formateur
              </p>
              <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{CURRENT_FORMATEUR.prenom} {CURRENT_FORMATEUR.nom}</p>
            </div>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="px-6 py-4 mt-2 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {isDelPending ? (
            <p className="text-xs text-red-500 font-medium">Demande de suppression envoyée</p>
          ) : (
            <button
              onClick={() => {
                if (window.confirm('Voulez-vous demander la suppression de cette séance au chef de pôle ?')) {
                  onDelete(seance.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors shadow-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Dashboard Page for the Trainer
───────────────────────────────────────────── */
const DashboardPage = () => {
  const {
    seances,
    filieres,
    modules,
    espaces,
    groupes,
    jours,
    creneaux,
    currentWeek,
    getSeancesByFormateur,
    addSeance,
    deleteSeance,
    moveSeance,
    nextWeek,
    prevWeek,
  } = useData();

  // --- Filtres ---
  const [filterModule, setFilterModule] = useState('all');
  const [filterFiliere, setFilterFiliere] = useState('all');
  const [filterSalle, setFilterSalle] = useState('all');

  // --- Modal ajout séance ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [prefilledSlot, setPrefilledSlot] = useState(null);

  // --- Popup détail séance ---
  const [selectedSeance, setSelectedSeance] = useState(null);

  // --- Drag & Drop ---
  const [draggedSeanceId, setDraggedSeanceId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [moveNotif, setMoveNotif] = useState(null); // { type: 'success'|'error', msg }

  // --- Calculate week days with corresponding dates ---
  const weekDays = useMemo(() => {
    const [yearStr, weekStr] = currentWeek.split('-W');
    const year = Number(yearStr);
    const week = Number(weekStr);
    const jan4 = new Date(year, 0, 4);
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + (week - 1) * 7);
    return jours.map((jour, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return { jour, date: d };
    });
  }, [currentWeek, jours]);

  const weekLabel = useMemo(() => {
    if (!weekDays.length) return '';
    const fmt = d => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    return `${fmt(weekDays[0].date)} - ${fmt(weekDays[weekDays.length - 1].date)}`;
  }, [weekDays]);

  const todayDayIdx = new Date().getDay() - 1;

  // --- Sessions for the currently authenticated trainer ---
  const mySeances = useMemo(() => {
    let list = getSeancesByFormateur(CURRENT_FORMATEUR.id).filter(
      s => s.statut === 'Validée' || s.statut === 'En attente' || s.statut === 'Suppression en attente'
    );
    if (filterModule !== 'all') list = list.filter(s => s.module_id === Number(filterModule));
    if (filterFiliere !== 'all') {
      const gIdsForFiliere = groupes.filter(g => g.filiere_id === Number(filterFiliere)).map(g => g.id);
      list = list.filter(s => {
        const sgIds = s.groupes_ids || (s.groupe_id ? [s.groupe_id] : []);
        return sgIds.some(id => gIdsForFiliere.includes(id));
      });
    }
    if (filterSalle !== 'all') list = list.filter(s => s.espace_id === Number(filterSalle));
    return list;
  }, [seances, currentWeek, filterModule, filterFiliere, filterSalle, groupes, getSeancesByFormateur]);

  // --- Stats ---
  const stats = useMemo(() => {
    const all = getSeancesByFormateur(CURRENT_FORMATEUR.id);
    const validated = all.filter(s => s.statut === 'Validée');
    const presentiel = mySeances.filter(s => s.type_seance === 'Présentiel').length;
    const distanciel = mySeances.filter(s => s.type_seance === 'Distanciel').length;
    const enAttente = all.filter(s => s.statut === 'En attente' || s.statut === 'Suppression en attente').length;
    return {
      seances: validated.length,
      heures: validated.length * 2.5,
      presentiel,
      distanciel,
      enAttente,
    };
  }, [seances, currentWeek, mySeances, getSeancesByFormateur]);

  // --- Drag & Drop ---
  const handleDragStart = (e, seanceId) => {
    setDraggedSeanceId(seanceId);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e, jour, creneauId) => {
    e.preventDefault();
    setDropTarget({ jour, creneauId });
  };
  const handleDragLeave = () => setDropTarget(null);
  const handleDrop = (e, jour, creneauId) => {
    e.preventDefault();
    setDropTarget(null);
    if (!draggedSeanceId) return;
    const targetCreneau = creneaux.find(c => c.id === creneauId);
    if (!targetCreneau) return;
    const result = moveSeance(draggedSeanceId, jour, targetCreneau.heure_debut, targetCreneau.heure_fin);
    if (result && !result.success) {
      setMoveNotif({ type: 'error', msg: result.errors?.[0] || 'Conflit détecté, déplacement impossible.' });
    } else {
      setMoveNotif({ type: 'success', msg: 'Déplacement enregistré — en attente de validation du chef de pôle.' });
    }
    setTimeout(() => setMoveNotif(null), 4000);
    setDraggedSeanceId(null);
  };
  const handleDragEnd = () => { setDraggedSeanceId(null); setDropTarget(null); };

  const listModules = [...new Set(getSeancesByFormateur(CURRENT_FORMATEUR.id).map(s => s.module_id))];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }} className="text-slate-900 dark:text-slate-50 relative pb-10">

      {/* ===== Notification déplacement en toast ===== */}
      {moveNotif && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-bold flex items-center gap-2 animate-slideUp
          ${moveNotif.type === 'success' ? 'bg-white text-emerald-700 border-emerald-200' : 'bg-white text-red-700 border-red-200'}`}>
          <span className={`w-2 h-2 rounded-full ${moveNotif.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          {moveNotif.msg}
        </div>
      )}

      {/* ===== Stats Cards ===== */}
      <section className="flex gap-4 mb-5">
        {[
          { value: stats.seances, label: 'Séances cette semaine' },
          { value: `${stats.heures}h`, label: 'Heures de cours' },
          { value: groupes.length, label: 'Groupes disponibles' },
          { value: stats.enAttente, label: 'Séances à valider', highlight: stats.enAttente > 0 },
        ].map((card, i) => (
          <div key={i}
            className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-6 flex flex-col justify-center shadow-sm border border-slate-200 dark:border-slate-700 border-t-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ borderTopColor: card.highlight ? '#f59e0b' : undefined }}
          >
            <div
              className="text-[2.5rem] font-extrabold leading-none mb-2"
              style={!card.highlight ? { background: 'linear-gradient(135deg,#0ea5e9,#0369a1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: '#f59e0b' }}
            >
              {card.value}
            </div>
            <div className="text-[0.85rem] text-slate-500 dark:text-slate-400 font-medium">{card.label}</div>
          </div>
        ))}
      </section>

      {/* ===== Filtres ===== */}
      <section className="bg-white/95 backdrop-blur-md rounded-xl p-3 px-4 mb-3 shadow-sm border border-slate-200 dark:bg-slate-800/95 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-3">
          {/* Selects */}
          {[
            { label: 'Module', val: filterModule, set: setFilterModule, opts: listModules.map(mid => { const m = modules.find(x => x.id === mid); return m ? { v: String(mid), l: m.nom_module } : null; }).filter(Boolean), all: 'Tous les modules' },
            { label: 'Filière', val: filterFiliere, set: setFilterFiliere, opts: filieres.map(f => ({ v: String(f.id), l: f.nom_filiere })), all: 'Toutes les filières' },
            { label: 'Salle', val: filterSalle, set: setFilterSalle, opts: espaces.map(e => ({ v: String(e.id), l: e.nom_espace })), all: 'Toutes les salles' },
          ].map(({ label, val, set, opts, all }) => (
            <div key={label} className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-[0.55rem] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
              <select
                className="px-2 py-1 rounded border border-slate-200 bg-white text-[0.7rem] text-slate-900 outline-none cursor-pointer hover:border-sky-200 focus:border-sky-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                value={val}
                onChange={e => set(e.target.value)}
              >
                <option value="all">{all}</option>
                {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          ))}

          {/* Badges & actions */}
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <span className="px-3 py-1 rounded-full text-[0.7rem] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">{stats.presentiel} Présentiel</span>
            <span className="px-3 py-1 rounded-full text-[0.7rem] font-semibold bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">{stats.distanciel} Distanciel</span>
            <span className="px-3 py-1 rounded-full text-[0.7rem] font-semibold bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">Σ {stats.heures}h</span>
            <button
              onClick={() => { setFilterModule('all'); setFilterFiliere('all'); setFilterSalle('all'); }}
              className="px-2.5 py-1 rounded text-[0.65rem] font-semibold bg-slate-100 border border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
            >
              ↻ Reset
            </button>
            <button
              onClick={() => { setPrefilledSlot(null); setShowAddModal(true); }}
              className="inline-flex items-center gap-1.5 bg-gradient-to-br from-sky-400 to-blue-700 text-white px-3.5 py-1.5 rounded-lg text-[0.8rem] font-semibold shadow-[0_4px_10px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(37,99,235,0.35)] transition-all"
            >
              + Nouvelle séance
            </button>
            <button
              onClick={() => exportSchedulePDF(`EDT Formateur - ${CURRENT_FORMATEUR.prenom} ${CURRENT_FORMATEUR.nom} (${currentWeek})`, mySeances, jours.map((j, i) => ({ id: i, nom: j })), creneaux, id => (modules.find(m => m.id === id) || {}).nom_module || '', id => (groupes.find(g => g.id === id) || {}).nom_groupe || '', id => (espaces.find(e => e.id === id) || {}).nom_espace || '')}
              className="px-2.5 py-1.5 rounded-lg border-2 border-slate-200 text-slate-700 text-[0.8rem] font-semibold hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 transition-all"
            >
              ⬇ PDF
            </button>
          </div>
        </div>
      </section>

      {/* ===== Navigation semaine ===== */}
      <section className="bg-white/95 backdrop-blur-md rounded-xl p-2 px-4 mb-4 shadow-sm border border-slate-200 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
        <button
          onClick={prevWeek}
          className="px-4 py-2 bg-gradient-to-br from-sky-400 to-blue-700 rounded-full text-white text-[0.8rem] font-semibold hover:-translate-y-px hover:shadow-md transition-all shadow-sm"
        >
          ← Semaine précédente
        </button>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[0.85rem] font-semibold text-slate-900 bg-blue-50 px-3 py-1 rounded-full dark:bg-slate-700 dark:text-slate-200">
            {weekLabel}
          </span>
          <div className="flex gap-1">
            {weekDays.map((wd, i) => (
              <div key={i} className={`px-2 py-1 rounded-md text-[0.7rem] font-medium border transition-colors
                ${i === todayDayIdx
                  ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'}`}>
                {wd.jour.slice(0, 3)} {wd.date.getDate()}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={nextWeek}
          className="px-4 py-2 bg-gradient-to-br from-sky-400 to-blue-700 rounded-full text-white text-[0.8rem] font-semibold hover:-translate-y-px hover:shadow-md transition-all shadow-sm"
        >
          Semaine suivante →
        </button>
      </section>

      {/* ===== Grille emploi du temps ===== */}
      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed text-[0.7rem] min-w-[700px]">
            <thead>
              <tr>
                <th className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 border-b-2 border-slate-200 text-[0.65rem] text-slate-500 font-bold uppercase tracking-wide dark:from-slate-900 dark:to-slate-800 dark:border-slate-700 dark:text-slate-400 w-[100px]">
                  Jours
                </th>
                {creneaux.map(c => (
                  <th key={c.id} className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 border-b-2 border-slate-200 text-[0.65rem] text-slate-500 font-bold uppercase tracking-wide dark:from-slate-900 dark:to-slate-800 dark:border-slate-700 dark:text-slate-400 text-center">
                    <div className="text-slate-700 dark:text-slate-200">{c.label}</div>
                    <div className="text-[0.5rem] font-normal opacity-60 mt-0.5">{c.heure_debut} – {c.heure_fin}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekDays.map((wd, dayIdx) => (
                <tr key={wd.jour} className={dayIdx % 2 === 0 ? '' : 'bg-slate-50/40 dark:bg-slate-800/60'}>
                  {/* Colonne jour */}
                  <td className="font-bold text-center bg-gradient-to-br from-slate-50 to-slate-100 border-r-2 border-slate-200 text-slate-700 dark:text-slate-300 text-[0.7rem] uppercase tracking-wide p-2 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700">
                    <div>{wd.jour}</div>
                    <div className="text-[0.5rem] opacity-70 mt-0.5">{wd.date.getDate()}/{wd.date.getMonth() + 1}</div>
                  </td>

                  {/* Cellules des créneaux */}
                  {creneaux.map(c => {
                    const cellSeances = mySeances.filter(
                      s => s.jour.toLowerCase() === wd.jour.toLowerCase() &&
                           s.heure_debut.toLowerCase() === c.heure_debut.toLowerCase()
                    );
                    const isDropTarget = dropTarget?.jour?.toLowerCase() === wd.jour.toLowerCase() && dropTarget?.creneauId === c.id;

                    return (
                      <td
                        key={c.id}
                        className={`h-[95px] border border-slate-100 dark:border-slate-700 relative p-0 align-top cursor-pointer group transition-colors
                          ${isDropTarget
                            ? 'bg-sky-100 dark:bg-sky-900/40 border-2 border-sky-400 border-dashed'
                            : 'bg-white dark:bg-transparent hover:bg-sky-50 dark:hover:bg-slate-800/50'}`}
                        onClick={() => cellSeances.length === 0 && (setPrefilledSlot({ jour: wd.jour, creneau: c.id }), setShowAddModal(true))}
                        onDragOver={e => handleDragOver(e, wd.jour, c.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={e => handleDrop(e, wd.jour, c.id)}
                      >
                        {cellSeances.length > 0 ? (
                          <div className={cellSeances.length > 1 ? 'grid grid-cols-2 gap-0.5 h-full p-0.5' : 'w-full h-full'}>
                            {cellSeances.map(s => {
                              const isPresentiel = s.type_seance === 'Présentiel';
                              const isPending = s.statut === 'En attente';
                              const isDelPending = s.statut === 'Suppression en attente';
                              const isCompact = cellSeances.length > 1;
                              const mod = modules.find(m => m.id === s.module_id) || {};
                              const gIds = s.groupes_ids || (s.groupe_id ? [s.groupe_id] : []);
                              const grpNames = gIds.map(id => (groupes.find(g => g.id === id) || {}).nom_groupe).filter(Boolean).join(' + ') || '—';
                              const esp = espaces.find(e => e.id === s.espace_id) || {};

                              return (
                                <div
                                  key={s.id}
                                  draggable
                                  onDragStart={e => handleDragStart(e, s.id)}
                                  onDragEnd={handleDragEnd}
                                  onClick={e => { e.stopPropagation(); setSelectedSeance(s); }}
                                  className={`relative w-full h-full flex flex-col justify-center cursor-pointer transition-all duration-200 overflow-hidden select-none
                                    group/card
                                    ${isCompact ? 'p-1' : 'p-2'}
                                    ${isDelPending ? 'opacity-50 border-dashed border-2' : 'border-t border-b'}
                                    ${isPresentiel
                                      ? `bg-gradient-to-br from-emerald-50/80 to-green-100/80 hover:from-emerald-100 hover:to-green-200 dark:from-emerald-950 dark:to-emerald-900
                                         border-emerald-200 dark:border-emerald-800
                                         ${isCompact ? 'border-l-2 border-l-emerald-500' : 'border-l-4 border-l-emerald-500 dark:border-l-emerald-400'}`
                                      : `bg-gradient-to-br from-cyan-50/80 to-blue-100/80 hover:from-cyan-100 hover:to-blue-200 dark:from-slate-800 dark:to-blue-950
                                         border-cyan-200 dark:border-blue-900
                                         ${isCompact ? 'border-l-2 border-l-cyan-600' : 'border-l-4 border-l-cyan-600 dark:border-l-blue-400'}`
                                    }`}
                                >
                                  {/* Badge point "En attente" */}
                                  {isPending && (
                                    <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white shadow-sm animate-pulse" title="En attente de validation"></div>
                                  )}
                                  {isDelPending && (
                                    <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white shadow-sm" title="Suppression en attente"></div>
                                  )}
                                  
                                  {/* Indicateur P/D si non compact et validé */}
                                  {!isPending && !isDelPending && !isCompact && (
                                    <div className={`absolute top-1 right-1 text-[0.45rem] font-extrabold px-1 py-px rounded opacity-60
                                      ${isPresentiel ? 'text-emerald-700 bg-emerald-600/20' : 'text-cyan-800 bg-cyan-700/20'}`}>
                                      {isPresentiel ? 'P' : 'D'}
                                    </div>
                                  )}

                                  {/* Contenu textuel */}
                                  <div className={`font-bold tracking-tight leading-tight w-11/12 truncate
                                    ${isPresentiel ? 'text-emerald-900 dark:text-emerald-100' : 'text-cyan-900 dark:text-blue-100'}
                                    ${isCompact ? 'text-[0.55rem]' : 'text-[0.7rem] mb-0.5'}`}>
                                    {mod.nom_module || '—'}
                                  </div>
                                  <div className={`font-semibold truncate opacity-80
                                    ${isPresentiel ? 'text-emerald-800 dark:text-emerald-400' : 'text-cyan-800 dark:text-blue-300'}
                                    ${isCompact ? 'text-[0.45rem]' : 'text-[0.6rem]'}`}>
                                    {grpNames}
                                  </div>
                                  {!isCompact && (
                                    <div className={`font-medium truncate opacity-70 text-[0.55rem] mt-0.5
                                      ${isPresentiel ? 'text-emerald-800' : 'text-cyan-800'}`}>
                                      {esp.nom_espace}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          // Cellule vide avec le `+` sur le côté (en bas à droite)
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center text-[12px] font-bold shadow-sm hover:bg-blue-200 transition-colors">
                              +
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-[0.65rem] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> En attente (création/déplacement)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Suppression en attente</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-200 border-l-2 border-emerald-500 inline-block"></span> Présentiel</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-cyan-200 border-l-2 border-cyan-600 inline-block"></span> Distanciel</span>
      </div>

      {/* ===== Session Details Popup ===== */}
      {selectedSeance && (
        <DetailPopup
          seance={selectedSeance}
          modules={modules}
          groupes={groupes}
          espaces={espaces}
          onClose={() => setSelectedSeance(null)}
          onDelete={(id) => { deleteSeance(id); setSelectedSeance(null); }}
        />
      )}

      {/* ===== Add Session Modal ===== */}
      <SessionModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setPrefilledSlot(null); }}
        onSubmit={addSeance}
        formateur={CURRENT_FORMATEUR}
        defaultJour={prefilledSlot?.jour}
        defaultCreneau={prefilledSlot?.creneau}
      />
    </div>
  );
};

export default DashboardPage;
