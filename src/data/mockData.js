// Fichier prêt à recevoir les vraies données de votre équipe
// Structure requise pour l'application

export const poles = [];
export const filieres = [];
export const groupes = [];
export const formateurs = [];
export const modules = [];
export const espaces = [];
export const seances = [];

export const currentWeek = "2026-W26";

export const creneaux = [
  { id: 1, label: "8H30 - 11H", heure_debut: "8h30", heure_fin: "11h" },
  { id: 2, label: "11H - 13H30", heure_debut: "11h", heure_fin: "13h30" },
  { id: 3, label: "13H30 - 16H", heure_debut: "13h30", heure_fin: "16h" },
  { id: 4, label: "16H - 18H30", heure_debut: "16h", heure_fin: "18h30" }
];

export const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export default {
  poles,
  filieres,
  groupes,
  formateurs,
  modules,
  espaces,
  seances,
  creneaux,
  jours,
  currentWeek
};
