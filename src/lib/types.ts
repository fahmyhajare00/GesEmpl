export type Creneau = "8H30-11H" | "11H-13H30" | "13H30-16H" | "16H-18H30";
export type Mode = "presentiel" | "distanciel" | "reutilise";
export type Statut = "validee" | "en_attente";
export type Role = "dir_pedagogique" | "chef_pole" | "formateur";

export interface Pole { id: string; name: string }
export interface Filiere { id: string; name: string; poleId: string }
export interface Module { id: string; name: string; filiereId: string }
export interface Formateur { id: string; name: string; poleId: string }
export interface Salle { id: string; name: string; poleId: string; capacity: number }
export interface User { id: string; name: string; role: Role; poleId?: string; initial: string; roleLabel: string }

export interface Seance {
  id: string;
  moduleId: string;
  filiereId: string;
  formateurId: string;
  salleId: string;
  groupe: string;
  date: string; // YYYY-MM-DD
  creneau: Creneau;
  mode: Mode;
  statut: Statut;
}

export const CRENEAUX: { id: Creneau; label: string; range: string }[] = [
  { id: "8H30-11H", label: "Matin", range: "8H30 – 11H" },
  { id: "11H-13H30", label: "Fin matin", range: "11H – 13H30" },
  { id: "13H30-16H", label: "Après-midi", range: "13H30 – 16H" },
  { id: "16H-18H30", label: "Soir", range: "16H – 18H30" },
];

export const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
