import React, { createContext, useContext, useState } from 'react';
import mockData, { 
  seances as initialSeances, 
  poles, 
  filieres, 
  groupes, 
  formateurs, 
  modules, 
  espaces, 
  creneaux, 
  jours,
  currentWeek as defaultWeek
} from '../data/mockData';
import { detectConflicts } from '../utils/conflictDetector';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [seances, setSeances] = useState(initialSeances);
  const [currentWeek, setCurrentWeek] = useState(defaultWeek);

  // Filtre les séances pour un formateur donné dans la semaine courante
  const getSeancesByFormateur = (formateurId) => {
    return seances.filter(s => s.formateur_id === Number(formateurId) && s.semaine === currentWeek);
  };

  // Filtre les séances pour un groupe donné dans la semaine courante
  const getSeancesByGroupe = (groupeId) => {
    return seances.filter(s => s.groupe_id === Number(groupeId) && s.semaine === currentWeek);
  };

  // Filtre les séances pour un pôle donné dans la semaine courante
  const getSeancesByPole = (poleId) => {
    const pFiliereIds = filieres.filter(f => f.pole_id === Number(poleId)).map(f => f.id);
    const pGroupeIds = groupes.filter(g => pFiliereIds.includes(g.filiere_id)).map(g => g.id);
    return seances.filter(s => pGroupeIds.includes(s.groupe_id) && s.semaine === currentWeek);
  };

  // Filtre les séances pour un espace donné dans la semaine courante
  const getSeancesByEspace = (espaceId) => {
    return seances.filter(s => s.espace_id === Number(espaceId) && s.semaine === currentWeek);
  };

  // Détection de conflits
  const checkConflicts = (seanceData) => {
    return detectConflicts(seanceData, seances);
  };

  // Ajoute une séance avec statut 'En attente'
  const addSeance = (seanceData) => {
    const conflicts = checkConflicts(seanceData);
    if (conflicts.length > 0) {
      return { success: false, errors: conflicts.map(c => c.message) };
    }

    const newSeance = {
      ...seanceData,
      id: Date.now(),
      semaine: currentWeek,
      statut: 'En attente'
    };

    setSeances(prev => [...prev, newSeance]);
    return { success: true };
  };

  // Demande la suppression d'une séance (mise en statut 'Suppression en attente')
  const deleteSeance = (seanceId) => {
    setSeances(prev => prev.map(s => {
      if (s.id === seanceId) {
        // Si elle était déjà en attente de création, on peut la supprimer directement
        if (s.statut === 'En attente') {
          return null;
        }
        // Sinon, demande de suppression au chef de pôle
        return { ...s, statut: 'Suppression en attente' };
      }
      return s;
    }).filter(Boolean));
  };

  // Navigation dans les semaines
  const nextWeek = () => {
    const parts = currentWeek.split('-W');
    const year = Number(parts[0]);
    const week = Number(parts[1]);
    const nextW = week === 52 ? 1 : week + 1;
    const nextY = week === 52 ? year + 1 : year;
    setCurrentWeek(`${nextY}-W${String(nextW).padStart(2, '0')}`);
  };

  const prevWeek = () => {
    const parts = currentWeek.split('-W');
    const year = Number(parts[0]);
    const week = Number(parts[1]);
    const prevW = week === 1 ? 52 : week - 1;
    const prevY = week === 1 ? year - 1 : year;
    setCurrentWeek(`${prevY}-W${String(prevW).padStart(2, '0')}`);
  };

  // Déplace/Modifie une séance (et la passe en statut 'En attente' pour validation)
  const moveSeance = (seanceId, newDay, heureDebut, heureFin) => {
    const existing = seances.find(s => s.id === seanceId);
    if (!existing) return { success: false, errors: ['Séance introuvable.'] };

    const targetData = {
      ...existing,
      jour: newDay,
      heure_debut: heureDebut,
      heure_fin: heureFin
    };

    const conflicts = checkConflicts(targetData);
    if (conflicts.length > 0) {
      return { success: false, errors: conflicts.map(c => c.message) };
    }

    setSeances(prev => prev.map(s => {
      if (s.id === seanceId) {
        return {
          ...s,
          jour: newDay,
          heure_debut: heureDebut,
          heure_fin: heureFin,
          statut: 'En attente'
        };
      }
      return s;
    }));

    return { success: true };
  };

  const value = {
    seances,
    currentWeek,
    setCurrentWeek,
    poles,
    filieres,
    groupes,
    formateurs,
    modules,
    espaces,
    creneaux,
    jours,
    getSeancesByFormateur,
    getSeancesByGroupe,
    getSeancesByPole,
    getSeancesByEspace,
    addSeance,
    deleteSeance,
    moveSeance,
    checkConflicts,
    nextWeek,
    prevWeek
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData doit être utilisé à l'intérieur d'un DataProvider");
  }
  return context;
}
