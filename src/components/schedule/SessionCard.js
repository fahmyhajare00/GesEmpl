import React, { useState } from 'react';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useData } from '../../context/DataContext';

/**
 * SessionCard - Affiche le groupe et le module, et ouvre une modal complète au clic.
 */
const SessionCard = ({ seance, onDelete, modules = [], groupes = [], espaces = [], formateurs = [] }) => {
  const { moveSeance, jours, creneaux } = useData();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // États de déplacement
  const [moveJour, setMoveJour] = useState(seance.jour);
  // Trouver le creneau correspondant à l'heure de début
  const initialCreneau = creneaux.find(c => c.heure_debut.toLowerCase() === seance.heure_debut.toLowerCase())?.id || '';
  const [moveCreneau, setMoveCreneau] = useState(String(initialCreneau));
  const [moveErrors, setMoveErrors] = useState([]);
  const [moveSuccess, setMoveSuccess] = useState(false);

  const module = modules.find(m => m.id === Number(seance.module_id)) || {};
  const groupe = groupes.find(g => g.id === Number(seance.groupe_id)) || {};
  const espace = espaces.find(e => e.id === Number(seance.espace_id)) || {};
  const formateur = formateurs.find(f => f.id === Number(seance.formateur_id)) || {};

  // Thème de couleur de la carte
  let cardStyle = 'bg-sky-50 border-l-4 border-sky-500 text-sky-950 dark:bg-sky-900/30 dark:border-sky-400 dark:text-sky-100';
  let badgeVariant = 'success';

  if (seance.statut === 'En attente') {
    cardStyle = 'bg-amber-50 border-l-4 border-amber-500 text-amber-950 dark:bg-amber-900/30 dark:border-amber-400 dark:text-amber-100';
    badgeVariant = 'pending';
  } else if (seance.statut === 'Refusée') {
    cardStyle = 'bg-rose-50 border-l-4 border-rose-500 text-rose-950 dark:bg-rose-900/30 dark:border-rose-400 dark:text-rose-100';
    badgeVariant = 'danger';
  } else if (seance.statut === 'Suppression en attente') {
    cardStyle = 'bg-red-50 border-l-4 border-red-300 text-red-950 opacity-60 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 dark:opacity-80';
    badgeVariant = 'warning';
  }

  const handleMove = (e) => {
    e.preventDefault();
    setMoveErrors([]);
    setMoveSuccess(false);

    const targetCreneau = creneaux.find(c => c.id === Number(moveCreneau));
    if (!targetCreneau) {
      setMoveErrors(['Veuillez sélectionner un créneau horaire.']);
      return;
    }

    const result = moveSeance(seance.id, moveJour, targetCreneau.heure_debut, targetCreneau.heure_fin);
    if (result && !result.success) {
      setMoveErrors(result.errors || ['Conflit détecté lors du déplacement.']);
    } else {
      setMoveSuccess(true);
      setTimeout(() => {
        setIsDetailOpen(false);
        setMoveSuccess(false);
      }, 1200);
    }
  };

  return (
    <>
      {/* Carte affichée directement sur la grille (uniquement Module & Groupe) */}
      <div
        onClick={() => setIsDetailOpen(true)}
        className={`session-card p-3 rounded-lg text-xs shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${cardStyle}`}
      >
        <div className="font-bold line-clamp-2" title={module.nom_module}>
          {module.nom_module || 'Module inconnu'}
        </div>
        <div className="mt-1 text-[11px] font-semibold opacity-80 flex justify-between items-center">
          <span>{groupe.nom_groupe || 'Groupe inconnu'}</span>
          <span className="text-[10px] scale-90 px-1 bg-white/70 dark:bg-black/30 rounded text-gray-800 dark:text-gray-200">
            {seance.statut === 'Validée' ? '✓' : '⏳'}
          </span>
        </div>
      </div>

      {/* Modal de détail de la séance */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Détail de la Séance"
        size="md"
      >
        <div className="space-y-6">
          {/* Informations détaillées */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-700 space-y-3">
            <div>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium block">Module</span>
              <strong className="text-gray-800 dark:text-gray-100 text-sm">{module.nom_module}</strong>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium block">Groupe</span>
                <strong className="text-gray-700 dark:text-gray-300">{groupe.nom_groupe}</strong>
              </div>
              <div>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium block">Salle</span>
                <strong className="text-gray-700 dark:text-gray-300">{espace.nom_espace}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium block">Formateur</span>
                <strong className="text-gray-700 dark:text-gray-300">{formateur.prenom} {formateur.nom}</strong>
              </div>
              <div>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium block">Horaire actuel</span>
                <strong className="text-gray-700 dark:text-gray-300">{seance.jour} ({seance.heure_debut} - {seance.heure_fin})</strong>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">
                {seance.type_seance}
              </span>
              <Badge variant={badgeVariant}>
                {seance.statut}
              </Badge>
            </div>
          </div>

          {/* Section Déplacer la séance */}
          {seance.statut !== 'Suppression en attente' && (
            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">Déplacer cette séance</h4>
              
              {moveErrors.length > 0 && (
                <div className="bg-rose-50 dark:bg-rose-900/30 border-l-4 border-rose-500 p-3 rounded mb-3 text-xs text-rose-700 dark:text-rose-300">
                  {moveErrors.map((err, i) => <p key={i}>{err}</p>)}
                </div>
              )}

              {moveSuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-900/30 border-l-4 border-emerald-500 p-3 rounded mb-3 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  Demande de déplacement enregistrée. En attente de validation.
                </div>
              )}

              <form onSubmit={handleMove} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <Select
                  label="Nouveau Jour"
                  value={moveJour}
                  onChange={(e) => setMoveJour(e.target.value)}
                  options={jours.map(j => ({ value: j, label: j }))}
                />
                <Select
                  label="Nouveau Créneau"
                  value={moveCreneau}
                  onChange={(e) => setMoveCreneau(e.target.value)}
                  options={creneaux.map(c => ({ value: String(c.id), label: c.label }))}
                />
                <div className="sm:col-span-2 flex justify-end mt-2">
                  <Button type="submit" variant="secondary" size="sm">
                    Enregistrer le déplacement
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Actions : Demander suppression */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
            {seance.statut !== 'Suppression en attente' ? (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (window.confirm('Voulez-vous vraiment demander la suppression de cette séance au chef de pôle ?')) {
                    onDelete(seance.id);
                    setIsDetailOpen(false);
                  }
                }}
              >
                Demander suppression
              </Button>
            ) : (
              <span className="text-xs text-rose-500 font-semibold italic">
                * Demande de suppression en attente de validation du chef de pôle.
              </span>
            )}
            <Button onClick={() => setIsDetailOpen(false)} variant="secondary" size="sm">
              Fermer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SessionCard;
