/**
 * Détecteur de conflits pour les séances.
 * Vérifie les chevauchements de formateur, groupe et espace.
 */

/**
 * Vérifie si deux plages horaires se chevauchent.
 * Gère le format "8h30", "11h", "13H30", etc.
 * @param {string} debut1 - Heure de début de la première plage
 * @param {string} fin1 - Heure de fin de la première plage
 * @param {string} debut2 - Heure de début de la deuxième plage
 * @param {string} fin2 - Heure de fin de la deuxième plage
 * @returns {boolean} true si les plages se chevauchent
 */
function isTimeOverlap(debut1, fin1, debut2, fin2) {
  // Convertir les heures en minutes pour faciliter la comparaison
  const toMinutes = (time) => {
    if (!time) return 0;
    const lowerTime = time.toLowerCase().replace(':', 'h');
    const parts = lowerTime.split('h');
    const h = Number(parts[0]) || 0;
    const m = parts[1] ? Number(parts[1]) : 0;
    return h * 60 + m;
  };

  const start1 = toMinutes(debut1);
  const end1 = toMinutes(fin1);
  const start2 = toMinutes(debut2);
  const end2 = toMinutes(fin2);

  // Chevauchement si une plage commence avant que l'autre ne se termine
  return start1 < end2 && start2 < end1;
}

/**
 * Détecte les conflits entre une nouvelle séance et les séances existantes.
 * @param {object} newSeance - La nouvelle séance à vérifier
 * @param {Array} existingSeances - Les séances existantes
 * @returns {Array} Tableau d'objets {type, message} décrivant les conflits, ou tableau vide
 */
export function detectConflicts(newSeance, existingSeances) {
  const conflicts = [];

  const jourNom = newSeance.jour;

  for (const seance of existingSeances) {
    // Ignorer la même séance (en cas de modification)
    if (seance.id && seance.id === newSeance.id) continue;

    // Ignorer les séances dans une autre semaine (s'il y a lieu)
    if (seance.semaine && newSeance.semaine && seance.semaine !== newSeance.semaine) continue;

    // Vérifier seulement les séances du même jour
    if (seance.jour.toLowerCase() !== newSeance.jour.toLowerCase()) continue;

    // Vérifier le chevauchement horaire
    const overlap = isTimeOverlap(
      newSeance.heure_debut,
      newSeance.heure_fin,
      seance.heure_debut,
      seance.heure_fin
    );

    if (!overlap) continue;

    // Conflit de formateur : même formateur, même jour, même créneau
    if (seance.formateur_id === newSeance.formateur_id) {
      conflicts.push({
        type: 'formateur',
        message: `Conflit formateur : Vous avez déjà une séance le ${jourNom} de ${seance.heure_debut} à ${seance.heure_fin}.`,
      });
    }

    // Conflit de groupe : même groupe, même jour, même créneau
    if (seance.groupe_id === newSeance.groupe_id) {
      conflicts.push({
        type: 'groupe',
        message: `Conflit groupe : Le groupe sélectionné a déjà une séance le ${jourNom} de ${seance.heure_debut} à ${seance.heure_fin}.`,
      });
    }

    // Conflit d'espace : même espace, même jour, même créneau
    if (seance.espace_id === newSeance.espace_id) {
      conflicts.push({
        type: 'espace',
        message: `Conflit espace : La salle/espace est déjà occupé(e) le ${jourNom} de ${seance.heure_debut} à ${seance.heure_fin}.`,
      });
    }
  }

  // Filtrer les doublons de message si nécessaire (par exemple si une séance provoque 2 conflits)
  return conflicts;
}
