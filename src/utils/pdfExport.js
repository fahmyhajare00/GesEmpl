import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Exporte un emploi du temps en PDF.
 * Crée un tableau avec les jours en lignes et les créneaux horaires en colonnes.
 *
 * @param {string} title - Le titre du document PDF
 * @param {Array} seances - Les séances à afficher
 * @param {Array} jours - La liste des jours de la semaine
 * @param {Array} creneaux - La liste des créneaux horaires
 * @param {Function} getModuleName - Fonction pour obtenir le nom d'un module par son ID
 * @param {Function} getGroupeName - Fonction pour obtenir le nom d'un groupe par son ID
 * @param {Function} getEspaceName - Fonction pour obtenir le nom d'un espace par son ID
 */
export function exportSchedulePDF(
  title,
  seances,
  jours,
  creneaux,
  getModuleName,
  getGroupeName,
  getEspaceName
) {
  // Créer un nouveau document PDF en orientation paysage
  const doc = new jsPDF('landscape', 'mm', 'a4');

  // Ajouter le titre en haut du document
  doc.setFontSize(16);
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, {
    align: 'center',
  });

  // En-têtes de colonnes : première colonne = "Jour", puis les créneaux horaires
  const headers = [
    'Jour',
    ...creneaux.map((c) => `${c.heure_debut} - ${c.heure_fin}`),
  ];

  // Construire les lignes du tableau : une ligne par jour
  const body = jours.map((jour) => {
    const row = [jour.nom];

    // Pour chaque créneau, chercher la séance correspondante
    creneaux.forEach((creneau) => {
      const seance = seances.find(
        (s) =>
          s.jour_id === jour.id &&
          s.heure_debut === creneau.heure_debut &&
          s.heure_fin === creneau.heure_fin
      );

      if (seance) {
        // Afficher les informations de la séance dans la cellule
        const moduleName = getModuleName(seance.module_id);
        const groupeName = getGroupeName(seance.groupe_id);
        const espaceName = getEspaceName(seance.espace_id);
        row.push(`${moduleName}\n${groupeName}\n${espaceName}`);
      } else {
        // Cellule vide si pas de séance
        row.push('');
      }
    });

    return row;
  });

  // Générer le tableau avec jspdf-autotable
  doc.autoTable({
    head: [headers],
    body: body,
    startY: 25,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: 'middle',
      halign: 'center',
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    columnStyles: {
      0: {
        fontStyle: 'bold',
        halign: 'left',
        fillColor: [236, 240, 241],
      },
    },
    alternateRowStyles: {
      fillColor: [249, 249, 249],
    },
  });

  // Sauvegarder le fichier PDF
  doc.save(`${title}.pdf`);
}
