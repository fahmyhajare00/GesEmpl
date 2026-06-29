import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import StatsCard from '../components/ui/StatsCard';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ScheduleGrid from '../components/schedule/ScheduleGrid';
import SessionModal from '../components/schedule/SessionModal';
import { exportSchedulePDF } from '../utils/pdfExport';
import {
  FiCalendar,
  FiUsers,
  FiClock,
  FiAlertCircle,
  FiPlus,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
} from 'react-icons/fi';

/**
 * DashboardPage - Tableau de bord principal du formateur.
 */
const DashboardPage = () => {
  // Fake user since auth was removed
  const currentUser = { id: 1, prenom: 'Ahmed', nom: 'Benani', pole_id: 1 };
  const {
    seances,
    poles,
    filieres,
    modules,
    formateurs,
    espaces,
    groupes,
    jours,
    creneaux,
    currentWeek,
    getSeancesByFormateur,
    getSeancesByGroupe,
    getSeancesByPole,
    getSeancesByEspace,
    addSeance,
    deleteSeance,
    nextWeek,
    prevWeek
  } = useData();

  // --- État de la vue sélectionnée ---
  // Peut être: 'formateur' (par défaut), 'groupe', 'pole', 'espace'
  const [viewType, setViewType] = useState('formateur');

  // --- État des filtres ---
  const [selectedPole, setSelectedPole] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedFormateur, setSelectedFormateur] = useState(currentUser?.id || 1);
  const [selectedGroupe, setSelectedGroupe] = useState('');
  const [selectedSalle, setSelectedSalle] = useState('');

  // --- Modal de session ---
  const [showModal, setShowModal] = useState(false);
  const [prefilledSlot, setPrefilledSlot] = useState(null);

  // --- Filtre de statut (ex: 'En attente') ---
  const [statusFilter, setStatusFilter] = useState(null);

  const handleCellClick = (jour, creneau) => {
    setPrefilledSlot({ jour, creneau: creneau.id });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPrefilledSlot(null);
  };

  // Synchroniser le formateur sélectionné avec l'utilisateur connecté s'il change
  React.useEffect(() => {
    if (currentUser) {
      setSelectedFormateur(currentUser.id);
    }
  }, [currentUser]);

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setViewType('formateur');
    setSelectedPole('');
    setSelectedFiliere('');
    setSelectedModule('');
    setSelectedFormateur(currentUser?.id || 1);
    setSelectedGroupe('');
    setSelectedSalle('');
    setStatusFilter(null);
  };

  // --- Filières filtrées par pôle sélectionné ---
  const filteredFilieres = useMemo(() => {
    if (!selectedPole) return filieres;
    return filieres.filter((f) => f.pole_id === Number(selectedPole));
  }, [filieres, selectedPole]);

  // --- Modules filtrés par filière sélectionnée ---
  const filteredModules = useMemo(() => {
    if (!selectedFiliere) return modules;
    return modules.filter((m) => m.filiere_id === Number(selectedFiliere));
  }, [modules, selectedFiliere]);

  // --- Groupes filtrés par filière sélectionnée ---
  const filteredGroupesList = useMemo(() => {
    if (!selectedFiliere) return groupes;
    return groupes.filter((g) => g.filiere_id === Number(selectedFiliere));
  }, [groupes, selectedFiliere]);

  // --- Séances affichées dans la grille (basé sur le type de vue) ---
  const displayedSeances = useMemo(() => {
    let list = [];

    if (viewType === 'formateur' && selectedFormateur) {
      list = getSeancesByFormateur(selectedFormateur);
      if (selectedModule) {
        list = list.filter(s => s.module_id === Number(selectedModule));
      }
    } else if (viewType === 'groupe' && selectedGroupe) {
      list = getSeancesByGroupe(selectedGroupe);
    } else if (viewType === 'pole' && selectedPole) {
      list = getSeancesByPole(selectedPole);
    } else if (viewType === 'espace' && selectedSalle) {
      list = getSeancesByEspace(selectedSalle);
    } else {
      // Par défaut, retourner les séances du formateur courant
      list = getSeancesByFormateur(currentUser?.id || 1);
    }

    if (statusFilter === 'pending') {
      list = list.filter(s => s.statut === 'En attente' || s.statut === 'Suppression en attente');
    } else {
      list = list.filter(s => s.statut === 'Validée');
    }

    return list;
  }, [viewType, selectedFormateur, selectedGroupe, selectedPole, selectedSalle, selectedModule, currentUser, currentWeek, seances, statusFilter, getSeancesByFormateur, getSeancesByGroupe, getSeancesByPole, getSeancesByEspace]);

  // --- Statistiques individuelles du formateur courant pour cette semaine ---
  const stats = useMemo(() => {
    const currentFormateurId = currentUser?.id || 1;
    const weekSeances = seances.filter(
      (s) => s.formateur_id === currentFormateurId && s.semaine === currentWeek
    );

    const uniqueGroupes = new Set(weekSeances.map((s) => s.groupe_id));
    const totalHours = weekSeances.length * 2.5; // chaque créneau fait 2h30
    const enAttente = weekSeances.filter((s) => s.statut === 'En attente' || s.statut === 'Suppression en attente').length;

    return {
      seancesCount: weekSeances.length,
      groupesCount: uniqueGroupes.size,
      heures: totalHours,
      enAttente,
    };
  }, [seances, currentUser, currentWeek]);

  // --- Compteurs pour badges de la grille courante ---
  const sessionCounts = useMemo(() => {
    const presentiel = displayedSeances.filter((s) => s.type_seance === 'Présentiel').length;
    const distanciel = displayedSeances.filter((s) => s.type_seance === 'Distanciel').length;
    const totalHours = displayedSeances.length * 2.5;
    return { presentiel, distanciel, totalHours };
  }, [displayedSeances]);

  // Libellé textuel pour la semaine courante
  const weekLabel = useMemo(() => {
    // Ex: "2026-W26" -> "Semaine 26 - 2026"
    const parts = currentWeek.split('-W');
    if (parts.length === 2) {
      return `Semaine ${parts[1]} (${parts[0]})`;
    }
    return currentWeek;
  }, [currentWeek]);

  // Gestion de l'ajout de séance
  const handleAddSeance = (seanceData) => {
    return addSeance(seanceData);
  };

  // Gestion du déplacement de séance par drag & drop (passe en 'En attente' pour validation chef de pôle)
  const handleMoveSeance = (seanceId, newJour, heureDebut, heureFin) => {
    const result = moveSeance(seanceId, newJour, heureDebut, heureFin);
    if (result && !result.success) {
      alert('Conflit détecté : ' + (result.errors || []).join(' | '));
    }
  };

  // Export PDF
  const handleExportPDF = () => {
    let title = "Emploi du Temps";
    if (viewType === 'formateur') {
      const f = formateurs.find(form => form.id === Number(selectedFormateur));
      title = `EDT Formateur - ${f ? f.prenom + ' ' + f.nom : ''}`;
    } else if (viewType === 'groupe') {
      const g = groupes.find(gr => gr.id === Number(selectedGroupe));
      title = `EDT Groupe - ${g ? g.nom_groupe : ''}`;
    } else if (viewType === 'pole') {
      const p = poles.find(pol => pol.id === Number(selectedPole));
      title = `EDT Pole - ${p ? p.nom_pole : ''}`;
    } else if (viewType === 'espace') {
      const e = espaces.find(esp => esp.id === Number(selectedSalle));
      title = `EDT Salle - ${e ? e.nom_espace : ''}`;
    }

    exportSchedulePDF(
      `${title} (${currentWeek})`,
      displayedSeances,
      jours.map((j, i) => ({ id: i, nom: j })), // structure jour attendue par pdfExport
      creneaux,
      (id) => (modules.find(m => m.id === id) || {}).nom_module || '',
      (id) => (groupes.find(g => g.id === id) || {}).nom_groupe || '',
      (id) => (espaces.find(e => e.id === id) || {}).nom_espace || ''
    );
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* ===== Cartes de statistiques ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Séances cette semaine"
          value={stats.seancesCount}
          icon={<FiCalendar />}
          onClick={() => {
            resetFilters();
            setViewType('formateur');
          }}
        />
        <StatsCard
          title="Groupes assignés"
          value={stats.groupesCount}
          icon={<FiUsers />}
          onClick={() => {
            resetFilters();
            setViewType('groupe');
          }}
        />
        <StatsCard
          title="Heures de cours"
          value={`${stats.heures}h`}
          icon={<FiClock />}
          onClick={() => {
            resetFilters();
            setViewType('formateur');
          }}
        />
        <StatsCard
          title="Modifications à valider"
          value={stats.enAttente}
          icon={<FiAlertCircle />}
          onClick={() => {
            resetFilters();
            setViewType('formateur');
            setStatusFilter('pending');
          }}
        />
      </div>

      {/* ===== Barre de filtres et Angle de consultation ===== */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 space-y-4 transition-colors duration-200">
        {/* Choix de l'angle de vue */}
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg w-fit transition-colors duration-200">
          <button
            onClick={() => { setViewType('formateur'); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${viewType === 'formateur' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Par Formateur
          </button>
          <button
            onClick={() => { setViewType('groupe'); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${viewType === 'groupe' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Par Groupe
          </button>
          <button
            onClick={() => { setViewType('pole'); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${viewType === 'pole' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Par Pôle
          </button>
          <button
            onClick={() => { setViewType('espace'); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${viewType === 'espace' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Par Espace / Salle
          </button>
        </div>

        {/* Message de filtre actif */}
        {statusFilter === 'pending' && (
          <div className="bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-3 py-2 rounded-lg text-sm flex items-center justify-between">
            <span>Affichage des <strong>modifications à valider</strong> uniquement.</span>
            <button onClick={() => setStatusFilter(null)} className="text-sky-500 hover:text-sky-700 font-bold ml-4">
              ✕
            </button>
          </div>
        )}

        {/* Filtres de sélection correspondants */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {viewType === 'formateur' && (
            <Select
              label="Formateur"
              value={String(selectedFormateur)}
              onChange={(e) => setSelectedFormateur(Number(e.target.value))}
              options={formateurs.map((f) => ({ value: String(f.id), label: `${f.prenom} ${f.nom}` }))}
            />
          )}

          {viewType === 'groupe' && (
            <>
              <Select
                label="Filière"
                value={selectedFiliere}
                onChange={(e) => { setSelectedFiliere(e.target.value); setSelectedGroupe(''); }}
                options={filieres.map((f) => ({ value: String(f.id), label: f.nom_filiere }))}
                placeholder="Sélectionner la filière..."
              />
              <Select
                label="Groupe d'apprenants"
                value={selectedGroupe}
                onChange={(e) => setSelectedGroupe(Number(e.target.value))}
                options={filteredGroupesList.map((g) => ({ value: String(g.id), label: g.nom_groupe }))}
                placeholder="Choisir un groupe..."
                className={!selectedFiliere ? 'opacity-60' : ''}
              />
            </>
          )}

          {viewType === 'pole' && (
            <Select
              label="Pôle du CMC"
              value={selectedPole}
              onChange={(e) => setSelectedPole(Number(e.target.value))}
              options={poles.map((p) => ({ value: String(p.id), label: p.nom_pole }))}
              placeholder="Sélectionner le pôle..."
            />
          )}

          {viewType === 'espace' && (
            <Select
              label="Espace / Salle"
              value={selectedSalle}
              onChange={(e) => setSelectedSalle(Number(e.target.value))}
              options={espaces.map((es) => ({ value: String(es.id), label: es.nom_espace }))}
              placeholder="Sélectionner la salle..."
            />
          )}

          {viewType === 'formateur' && (
            <Select
              label="Module"
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              options={modules.map((m) => ({ value: String(m.id), label: m.nom_module }))}
              placeholder="Tous les modules"
            />
          )}
        </div>

        {/* Badges récapitulatifs et actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success">Présentiel : {sessionCounts.presentiel}</Badge>
            <Badge variant="info">Distanciel : {sessionCounts.distanciel}</Badge>
            <Badge variant="pending">Σ {sessionCounts.totalHours}h</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" onClick={resetFilters} className="dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
              <FiRefreshCw className="w-3.5 h-3.5" />
              Réinitialiser
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExportPDF} disabled={viewType === 'groupe' && !selectedGroupe || viewType === 'pole' && !selectedPole || viewType === 'espace' && !selectedSalle}>
              <FiDownload className="w-3.5 h-3.5" />
              Exporter PDF
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
              <FiPlus className="w-3.5 h-3.5" />
              Ajouter une séance
            </Button>
          </div>
        </div>
      </div>

      {/* ===== Navigation hebdomadaire ===== */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <button
            onClick={prevWeek}
            className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition"
          >
            <FiChevronLeft className="w-4 h-4" />
            <span>Semaine précédente</span>
          </button>

          <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{weekLabel}</span>

          <button
            onClick={nextWeek}
            className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition"
          >
            <span>Semaine suivante</span>
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ===== Grille de l'emploi du temps ===== */}
      {viewType === 'groupe' && !selectedGroupe ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 text-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 transition-colors duration-200">
          Veuillez sélectionner une filière puis un groupe pour afficher son emploi du temps.
        </div>
      ) : viewType === 'pole' && !selectedPole ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 text-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 transition-colors duration-200">
          Veuillez sélectionner un pôle pour afficher son emploi du temps global.
        </div>
      ) : viewType === 'espace' && !selectedSalle ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 text-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 transition-colors duration-200">
          Veuillez sélectionner une salle pour afficher son planning d'occupation.
        </div>
      ) : (
        <ScheduleGrid
          seances={displayedSeances}
          onDeleteSeance={deleteSeance}
          modules={modules}
          groupes={groupes}
          espaces={espaces}
          formateurs={formateurs}
          jours={jours}
          creneaux={creneaux}
          onCellClick={handleCellClick}
          onMoveSeance={handleMoveSeance}
        />
      )}

      {/* ===== Modal d'ajout de séance ===== */}
      <SessionModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleAddSeance}
        formateur={currentUser || { id: 1, pole_id: 1 }}
        defaultJour={prefilledSlot?.jour}
        defaultCreneau={prefilledSlot?.creneau}
      />
    </div>
  );
};

export default DashboardPage;
