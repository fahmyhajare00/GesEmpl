import type { Filiere, Formateur, Module, Pole, Salle, Seance, User } from "./types";

export const poles: Pole[] = [
  { id: "p1", name: "Gestion & Commerce" },
  { id: "p2", name: "Digital & Intelligence Artificielle" },
  { id: "p3", name: "Industrie / BTP & Artisanat" },
  { id: "p4", name: "Logistique & Transport" },
  { id: "p5", name: "Tourisme & Hôtellerie" },
  { id: "p6", name: "Agriculture" },
  { id: "p7", name: "Services à la Personne (SAP)" },
];

export const filieres: Filiere[] = [
  { id: "f1", name: "Comptabilité", poleId: "p1" },
  { id: "f2", name: "Commerce", poleId: "p1" },
  { id: "f3", name: "Développement Web", poleId: "p2" },
  { id: "f4", name: "Réseaux", poleId: "p2" },
  { id: "f5", name: "Mécanique", poleId: "p3" },
];

export const modules: Module[] = [
  { id: "m1", name: "Comptabilité Générale", filiereId: "f1" },
  { id: "m2", name: "Fiscalité", filiereId: "f1" },
  { id: "m3", name: "Marketing", filiereId: "f2" },
  { id: "m4", name: "React Avancé", filiereId: "f3" },
  { id: "m5", name: "Node.js", filiereId: "f3" },
  { id: "m6", name: "Cisco CCNA", filiereId: "f4" },
  { id: "m7", name: "Usinage", filiereId: "f5" },
];

export const formateurs: Formateur[] = [
  { id: "fo1", name: "Benali", poleId: "p1" },
  { id: "fo2", name: "Cherkaoui", poleId: "p1" },
  { id: "fo3", name: "El Idrissi", poleId: "p1" },
  { id: "fo4", name: "Tazi", poleId: "p2" },
  { id: "fo5", name: "Bennis", poleId: "p2" },
  { id: "fo6", name: "Saidi", poleId: "p2" },
  { id: "fo7", name: "Amrani", poleId: "p3" },
  { id: "fo8", name: "Filali", poleId: "p3" },
];

export const salles: Salle[] = [
  { id: "s1", name: "Salle 01", poleId: "p1", capacity: 25 },
  { id: "s2", name: "Salle 02", poleId: "p1", capacity: 30 },
  { id: "s3", name: "Salle 03", poleId: "p1", capacity: 20 },
  { id: "s4", name: "Labo Info 1", poleId: "p2", capacity: 24 },
  { id: "s5", name: "Labo Info 2", poleId: "p2", capacity: 24 },
  { id: "s6", name: "Atelier A", poleId: "p3", capacity: 18 },
];

// Week of 2026-05-25 (Lun) .. 2026-05-30 (Sam)
const D = (d: number) => `2026-05-${String(d).padStart(2, "0")}`;

export const seances: Seance[] = [
  { id: "se1", moduleId: "m1", filiereId: "f1", formateurId: "fo1", salleId: "s1", groupe: "G1", date: D(25), creneau: "8H30-11H", mode: "presentiel", statut: "validee" },
  { id: "se2", moduleId: "m2", filiereId: "f1", formateurId: "fo2", salleId: "s2", groupe: "G2", date: D(25), creneau: "11H-13H30", mode: "presentiel", statut: "validee" },
  { id: "se3", moduleId: "m3", filiereId: "f2", formateurId: "fo3", salleId: "s1", groupe: "G1", date: D(25), creneau: "13H30-16H", mode: "distanciel", statut: "validee" },
  { id: "se4", moduleId: "m1", filiereId: "f1", formateurId: "fo1", salleId: "s3", groupe: "G3", date: D(26), creneau: "8H30-11H", mode: "presentiel", statut: "en_attente" },
  { id: "se5", moduleId: "m2", filiereId: "f1", formateurId: "fo2", salleId: "s2", groupe: "G2", date: D(26), creneau: "8H30-11H", mode: "presentiel", statut: "validee" },
  { id: "se6", moduleId: "m3", filiereId: "f2", formateurId: "fo3", salleId: "s1", groupe: "G1", date: D(26), creneau: "16H-18H30", mode: "reutilise", statut: "validee" },
  { id: "se7", moduleId: "m4", filiereId: "f3", formateurId: "fo4", salleId: "s4", groupe: "G1", date: D(27), creneau: "8H30-11H", mode: "presentiel", statut: "validee" },
  { id: "se8", moduleId: "m5", filiereId: "f3", formateurId: "fo5", salleId: "s5", groupe: "G2", date: D(27), creneau: "11H-13H30", mode: "distanciel", statut: "validee" },
  { id: "se9", moduleId: "m6", filiereId: "f4", formateurId: "fo6", salleId: "s4", groupe: "G1", date: D(28), creneau: "13H30-16H", mode: "presentiel", statut: "en_attente" },
  { id: "se10", moduleId: "m1", filiereId: "f1", formateurId: "fo1", salleId: "s1", groupe: "G1", date: D(28), creneau: "8H30-11H", mode: "presentiel", statut: "validee" },
  { id: "se11", moduleId: "m2", filiereId: "f1", formateurId: "fo2", salleId: "s2", groupe: "G2", date: D(29), creneau: "11H-13H30", mode: "presentiel", statut: "validee" },
  { id: "se12", moduleId: "m3", filiereId: "f2", formateurId: "fo3", salleId: "s3", groupe: "G3", date: D(29), creneau: "13H30-16H", mode: "distanciel", statut: "validee" },
  { id: "se13", moduleId: "m7", filiereId: "f5", formateurId: "fo7", salleId: "s6", groupe: "G1", date: D(29), creneau: "16H-18H30", mode: "presentiel", statut: "validee" },
  { id: "se14", moduleId: "m4", filiereId: "f3", formateurId: "fo4", salleId: "s4", groupe: "G1", date: D(30), creneau: "8H30-11H", mode: "presentiel", statut: "en_attente" },
  { id: "se15", moduleId: "m1", filiereId: "f1", formateurId: "fo1", salleId: "s1", groupe: "G2", date: D(25), creneau: "8H30-11H", mode: "presentiel", statut: "validee" },
];

export const currentUser: User = {
  id: "u1",
  name: "MED Med",
  role: "dir_pedagogique",
  initial: "M",
  roleLabel: "DIRECTEUR PÉDAGOGIQUE",
};
