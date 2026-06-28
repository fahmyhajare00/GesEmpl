// GESEMPL - Données Mockées Réalistes pour le CMC de Beni Mellal
// Contient les pôles, filières, groupes, formateurs, modules, espaces et séances.

export const poles = [
  { id: 1, nom_pole: "Digital & IA", description: "Pôle des technologies de l'information et intelligence artificielle", chef_pole_id: 11 },
  { id: 2, nom_pole: "Génie Civil", description: "Pôle du bâtiment et travaux publics", chef_pole_id: 12 },
  { id: 3, nom_pole: "Gestion & Commerce", description: "Pôle du management, comptabilité et commerce international", chef_pole_id: 13 },
  { id: 4, nom_pole: "Hôtellerie & Tourisme", description: "Pôle des arts culinaires et services hôteliers", chef_pole_id: 14 }
];

export const filieres = [
  { id: 1, nom_filiere: "Développement Digital", code_filiere: "DD", pole_id: 1, niveau: "Technicien Spécialisé" },
  { id: 2, nom_filiere: "Infrastructure Digitale", code_filiere: "ID", pole_id: 1, niveau: "Technicien Spécialisé" },
  { id: 3, nom_filiere: "Génie Civil", code_filiere: "GC", pole_id: 2, niveau: "Technicien Spécialisé" },
  { id: 4, nom_filiere: "Bâtiment / BTP", code_filiere: "BTP", pole_id: 2, niveau: "Technicien" },
  { id: 5, nom_filiere: "Gestion des Entreprises", code_filiere: "GE", pole_id: 3, niveau: "Technicien Spécialisé" },
  { id: 6, nom_filiere: "Commerce & Vente", code_filiere: "COM", pole_id: 3, niveau: "Technicien" },
  { id: 7, nom_filiere: "Cuisine & Gastronomie", code_filiere: "CUI", pole_id: 4, niveau: "Technicien" },
  { id: 8, nom_filiere: "Management Hôtelier", code_filiere: "MH", pole_id: 4, niveau: "Technicien Spécialisé" }
];

export const groupes = [
  { id: 1, nom_groupe: "DEV101", filiere_id: 1, niveau: "Technicien Spécialisé", effectif: 28, annee_formation: "1ère année" },
  { id: 2, nom_groupe: "DEV102", filiere_id: 1, niveau: "Technicien Spécialisé", effectif: 30, annee_formation: "1ère année" },
  { id: 3, nom_groupe: "DEV201", filiere_id: 1, niveau: "Technicien Spécialisé", effectif: 25, annee_formation: "2ème année" },
  { id: 4, nom_groupe: "INF101", filiere_id: 2, niveau: "Technicien Spécialisé", effectif: 27, annee_formation: "1ère année" },
  { id: 5, nom_groupe: "INF201", filiere_id: 2, niveau: "Technicien Spécialisé", effectif: 24, annee_formation: "2ème année" },
  { id: 6, nom_groupe: "GC101", filiere_id: 3, niveau: "Technicien Spécialisé", effectif: 32, annee_formation: "1ère année" },
  { id: 7, nom_groupe: "GC201", filiere_id: 3, niveau: "Technicien Spécialisé", effectif: 28, annee_formation: "2ème année" },
  { id: 8, nom_groupe: "BTP101", filiere_id: 4, niveau: "Technicien", effectif: 20, annee_formation: "1ère année" },
  { id: 9, nom_groupe: "GE101", filiere_id: 5, niveau: "Technicien Spécialisé", effectif: 35, annee_formation: "1ère année" },
  { id: 10, nom_groupe: "GE201", filiere_id: 5, niveau: "Technicien Spécialisé", effectif: 31, annee_formation: "2ème année" },
  { id: 11, nom_groupe: "COM101", filiere_id: 6, niveau: "Technicien", effectif: 26, annee_formation: "1ère année" },
  { id: 12, nom_groupe: "CUI101", filiere_id: 7, niveau: "Technicien", effectif: 22, annee_formation: "1ère année" },
  { id: 13, nom_groupe: "CUI201", filiere_id: 7, niveau: "Technicien", effectif: 18, annee_formation: "2ème année" },
  { id: 14, nom_groupe: "MH101", filiere_id: 8, niveau: "Technicien Spécialisé", effectif: 25, annee_formation: "1ère année" }
];

export const formateurs = [
  { id: 1, nom: "Bennani", prenom: "Ahmed", email: "ahmed.bennani@ofppt.ma", specialite: "Développement Digital & Algorithmique", pole_id: 1, volume_horaire_contractuel: 26, actif: true },
  { id: 2, nom: "El Alami", prenom: "Youssef", email: "youssef.alami@ofppt.ma", specialite: "Réseaux & Sécurité Informatique", pole_id: 1, volume_horaire_contractuel: 26, actif: true },
  { id: 3, nom: "Tahiri", prenom: "Nadia", email: "nadia.tahiri@ofppt.ma", specialite: "Génie Civil & Résistance des Matériaux", pole_id: 2, volume_horaire_contractuel: 30, actif: true },
  { id: 4, nom: "Mansouri", prenom: "Karim", email: "karim.mansouri@ofppt.ma", specialite: "BTP & Dessin de Bâtiment", pole_id: 2, volume_horaire_contractuel: 30, actif: true },
  { id: 5, nom: "Kadiri", prenom: "Amine", email: "amine.kadiri@ofppt.ma", specialite: "Comptabilité & Gestion Financière", pole_id: 3, volume_horaire_contractuel: 26, actif: true },
  { id: 6, nom: "Fassi", prenom: "Fatima", email: "fatima.fassi@ofppt.ma", specialite: "Marketing & Techniques de Vente", pole_id: 3, volume_horaire_contractuel: 26, actif: true },
  { id: 7, nom: "El Idrissi", prenom: "Rachid", email: "rachid.idrissi@ofppt.ma", specialite: "Art Culinaire & Cuisine Marocaine", pole_id: 4, volume_horaire_contractuel: 30, actif: true },
  { id: 8, nom: "Ouazzani", prenom: "Sanaa", email: "sanaa.ouazzani@ofppt.ma", specialite: "Management Hôtelier & Réception", pole_id: 4, volume_horaire_contractuel: 26, actif: true }
];

export const modules = [
  // Digital
  { id: 1, nom_module: "Algorithmique & Structures de Données", code_module: "M101", filiere_id: 1, volume_horaire_total: 80, niveau: "Technicien Spécialisé" },
  { id: 2, nom_module: "Développement Web Front-end (React)", code_module: "M102", filiere_id: 1, volume_horaire_total: 120, niveau: "Technicien Spécialisé" },
  { id: 3, nom_module: "Bases de Données Relationnelles (SQL)", code_module: "M103", filiere_id: 1, volume_horaire_total: 90, niveau: "Technicien Spécialisé" },
  { id: 4, nom_module: "Introduction aux Réseaux", code_module: "M201", filiere_id: 2, volume_horaire_total: 80, niveau: "Technicien Spécialisé" },
  { id: 5, nom_module: "Administration Système Linux", code_module: "M202", filiere_id: 2, volume_horaire_total: 100, niveau: "Technicien Spécialisé" },
  // Génie Civil
  { id: 6, nom_module: "Résistance des Matériaux (RDM)", code_module: "M301", filiere_id: 3, volume_horaire_total: 110, niveau: "Technicien Spécialisé" },
  { id: 7, nom_module: "Technologie du Béton", code_module: "M302", filiere_id: 3, volume_horaire_total: 70, niveau: "Technicien Spécialisé" },
  { id: 8, nom_module: "Topographie", code_module: "M303", filiere_id: 3, volume_horaire_total: 90, niveau: "Technicien Spécialisé" },
  { id: 9, nom_module: "Sécurité sur Chantiers", code_module: "M401", filiere_id: 4, volume_horaire_total: 40, niveau: "Technicien" },
  // Gestion & Commerce
  { id: 10, nom_module: "Comptabilité Générale", code_module: "M501", filiere_id: 5, volume_horaire_total: 100, niveau: "Technicien Spécialisé" },
  { id: 11, nom_module: "Fiscalité de l'Entreprise", code_module: "M502", filiere_id: 5, volume_horaire_total: 80, niveau: "Technicien Spécialisé" },
  { id: 12, nom_module: "Techniques de Négociation", code_module: "M601", filiere_id: 6, volume_horaire_total: 60, niveau: "Technicien" },
  // Hôtellerie
  { id: 13, nom_module: "Gastronomie Marocaine", code_module: "M701", filiere_id: 7, volume_horaire_total: 120, niveau: "Technicien" },
  { id: 14, nom_module: "Hygiène & Sécurité Alimentaire", code_module: "M702", filiere_id: 7, volume_horaire_total: 50, niveau: "Technicien" },
  { id: 15, nom_module: "Gestion des Hébergements", code_module: "M801", filiere_id: 8, volume_horaire_total: 90, niveau: "Technicien Spécialisé" }
];

export const espaces = [
  { id: 1, nom_espace: "Salle Informatique 1", type_espace: "Salle informatique", capacite: 30, equipements: "30 PC, Vidéoprojecteur", pole_id: 1, actif: true },
  { id: 2, nom_espace: "Salle Informatique 2", type_espace: "Salle informatique", capacite: 30, equipements: "30 PC, Tableau Interactif", pole_id: 1, actif: true },
  { id: 3, nom_espace: "Labo IA / Cloud", type_espace: "Salle informatique", capacite: 25, equipements: "25 PC High-End, Serveur local", pole_id: 1, actif: true },
  { id: 4, nom_espace: "Salle de cours D101", type_espace: "Salle de cours", capacite: 40, equipements: "Vidéoprojecteur", pole_id: 1, actif: true },
  { id: 5, nom_espace: "Salle de cours D102", type_espace: "Salle de cours", capacite: 40, equipements: "Tableau classique", pole_id: 1, actif: true },
  { id: 6, nom_espace: "Atelier Bâtiment A", type_espace: "Atelier", capacite: 24, equipements: "Matériel topographique, Équipement béton", pole_id: 2, actif: true },
  { id: 7, nom_espace: "Salle de cours C201", type_espace: "Salle de cours", capacite: 35, equipements: "Vidéoprojecteur", pole_id: 2, actif: true },
  { id: 8, nom_espace: "Salle de cours G101", type_espace: "Salle de cours", capacite: 35, equipements: "Vidéoprojecteur", pole_id: 3, actif: true },
  { id: 9, nom_espace: "Salle de cours G102", type_espace: "Salle de cours", capacite: 35, equipements: "Tableau", pole_id: 3, actif: true },
  { id: 10, nom_espace: "Atelier Cuisine Pro", type_espace: "Atelier", capacite: 16, equipements: "Fours, plaques induction, postes de travail pro", pole_id: 4, actif: true },
  { id: 11, nom_espace: "Hôtel d'Application (Réception)", type_espace: "Espace commun", capacite: 20, equipements: "Comptoir d'accueil, Système PMS", pole_id: 4, actif: true },
  { id: 12, nom_espace: "Médiathèque", type_espace: "Médiathèque", capacite: 50, equipements: "Livres, PC en libre-service, WiFi", pole_id: 1, actif: true }
];

// Semaine courante par défaut pour les tests
export const currentWeek = "2026-W26";

export const seances = [
  // Séances du formateur principal (Ahmed Bennani - ID 1) - Semaine Courante (2026-W26)
  { id: 1, groupe_id: 1, formateur_id: 1, module_id: 1, espace_id: 1, jour: "Lundi", heure_debut: "8h30", heure_fin: "11h", semaine: "2026-W26", type_seance: "Présentiel", statut: "Validée" },
  { id: 2, groupe_id: 1, formateur_id: 1, module_id: 2, espace_id: 1, jour: "Lundi", heure_debut: "11h", heure_fin: "13h30", semaine: "2026-W26", type_seance: "Présentiel", statut: "Validée" },
  { id: 3, groupe_id: 3, formateur_id: 1, module_id: 2, espace_id: 2, jour: "Mardi", heure_debut: "13h30", heure_fin: "16h", semaine: "2026-W26", type_seance: "Présentiel", statut: "Validée" },
  { id: 4, groupe_id: 3, formateur_id: 1, module_id: 3, espace_id: 2, jour: "Mardi", heure_debut: "16h", heure_fin: "18h30", semaine: "2026-W26", type_seance: "Présentiel", statut: "Validée" },
  { id: 5, groupe_id: 2, formateur_id: 1, module_id: 1, espace_id: 4, jour: "Mercredi", heure_debut: "8h30", heure_fin: "11h", semaine: "2026-W26", type_seance: "Présentiel", statut: "Validée" },
  { id: 6, groupe_id: 1, formateur_id: 1, module_id: 2, espace_id: 12, jour: "Jeudi", heure_debut: "13h30", heure_fin: "16h", semaine: "2026-W26", type_seance: "Distanciel", statut: "Validée" },
  { id: 7, groupe_id: 2, formateur_id: 1, module_id: 2, espace_id: 3, jour: "Vendredi", heure_debut: "11h", heure_fin: "13h30", semaine: "2026-W26", type_seance: "Présentiel", statut: "En attente" },
  { id: 8, groupe_id: 3, formateur_id: 1, module_id: 3, espace_id: 2, jour: "Samedi", heure_debut: "8h30", heure_fin: "11h", semaine: "2026-W26", type_seance: "Présentiel", statut: "En attente" },
  
  // Séances des autres formateurs (pour remplir l'emploi du temps des pôles/salles)
  { id: 9, groupe_id: 4, formateur_id: 2, module_id: 4, espace_id: 2, jour: "Lundi", heure_debut: "8h30", heure_fin: "11h", semaine: "2026-W26", type_seance: "Présentiel", statut: "Validée" },
  { id: 10, groupe_id: 5, formateur_id: 2, module_id: 5, espace_id: 3, jour: "Mercredi", heure_debut: "13h30", heure_fin: "16h", semaine: "2026-W26", type_seance: "Présentiel", statut: "Validée" },
  { id: 11, groupe_id: 6, formateur_id: 3, module_id: 6, espace_id: 6, jour: "Mardi", heure_debut: "8h30", heure_fin: "11h", semaine: "2026-W26", type_seance: "Présentiel", statut: "Validée" },
  { id: 12, groupe_id: 7, formateur_id: 3, module_id: 7, espace_id: 7, jour: "Mardi", heure_debut: "11h", heure_fin: "13h30", semaine: "2026-W26", type_seance: "Présentiel", statut: "Validée" },
  { id: 13, groupe_id: 9, formateur_id: 5, module_id: 10, espace_id: 8, jour: "Jeudi", heure_debut: "8h30", heure_fin: "11h", semaine: "2026-W26", type_seance: "Présentiel", statut: "Validée" },
  { id: 14, groupe_id: 10, formateur_id: 5, module_id: 11, espace_id: 9, jour: "Vendredi", heure_debut: "13h30", heure_fin: "16h", semaine: "2026-W26", type_seance: "Présentiel", statut: "Validée" },
  { id: 15, groupe_id: 12, formateur_id: 7, module_id: 13, espace_id: 10, jour: "Vendredi", heure_debut: "8h30", heure_fin: "11h", semaine: "2026-W26", type_seance: "Présentiel", statut: "Validée" },
  { id: 16, groupe_id: 13, formateur_id: 7, module_id: 14, espace_id: 10, jour: "Lundi", heure_debut: "13h30", heure_fin: "16h", semaine: "2026-W26", type_seance: "Présentiel", statut: "Validée" }
];

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
