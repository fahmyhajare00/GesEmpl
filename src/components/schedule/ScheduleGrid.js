import React, { useState } from 'react';
import SessionCard from './SessionCard';

/**
 * ScheduleGrid - Grille de l'emploi du temps hebdomadaire avec drag & drop.
 * Le formateur peut glisser une séance d'une cellule vers une autre.
 * La séance passe en statut "En attente" et nécessite validation du chef de pôle.
 */
const ScheduleGrid = ({ 
  seances = [], 
  onDeleteSeance, 
  modules, 
  groupes, 
  espaces, 
  formateurs, 
  jours, 
  creneaux,
  onCellClick,
  onMoveSeance,
}) => {
  const [draggedSeanceId, setDraggedSeanceId] = useState(null);
  const [dragOverCell, setDragOverCell] = useState(null); // { jour, creneauId }

  // ---- Drag handlers (sur la carte) ----
  const handleDragStart = (e, seanceId) => {
    setDraggedSeanceId(seanceId);
    e.dataTransfer.effectAllowed = 'move';
    // Légère opacité pour indiquer le drag
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedSeanceId(null);
    setDragOverCell(null);
  };

  // ---- Drop zone handlers (sur les cellules) ----
  const handleDragOver = (e, jour, creneauId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCell({ jour, creneauId });
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e, targetJour, targetCreneau) => {
    e.preventDefault();
    setDragOverCell(null);

    if (!draggedSeanceId) return;

    const seance = seances.find(s => s.id === draggedSeanceId);
    if (!seance) return;

    // Vérifier que ce n'est pas la même cellule
    const isSameCell =
      seance.jour.toLowerCase() === targetJour.toLowerCase() &&
      seance.heure_debut.toLowerCase() === targetCreneau.heure_debut.toLowerCase();

    if (isSameCell) return;

    // Appeler la fonction de déplacement fournie par le parent
    if (onMoveSeance) {
      onMoveSeance(draggedSeanceId, targetJour, targetCreneau.heure_debut, targetCreneau.heure_fin);
    }

    setDraggedSeanceId(null);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed min-w-[800px]">
          {/* En-tête des créneaux horaires */}
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <th className="w-[120px] py-4 px-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                JOURS
              </th>
              {creneaux.map((c) => (
                <th key={c.id} className="py-4 px-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-l border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-700 dark:text-slate-300">{c.label}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal mt-0.5">{c.heure_debut} - {c.heure_fin}</div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Lignes pour chaque jour */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {jours.map((jour, idx) => (
              <tr key={jour} className={idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/30 dark:bg-slate-800/60'}>
                {/* Libellé du Jour */}
                <td className="py-4 px-4 font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wide bg-slate-50/50 dark:bg-slate-900/30">
                  {jour}
                </td>

                {/* Cellules créneaux */}
                {creneaux.map((c) => {
                  const matchingSeances = seances.filter(
                    (s) =>
                      s.jour.toLowerCase() === jour.toLowerCase() &&
                      s.heure_debut.toLowerCase() === c.heure_debut.toLowerCase()
                  );

                  const isDropTarget =
                    draggedSeanceId !== null &&
                    dragOverCell?.jour === jour &&
                    dragOverCell?.creneauId === c.id;

                  return (
                    <td
                      key={c.id}
                      className={`p-2 border-l border-slate-100 dark:border-slate-700 min-h-[100px] align-top transition-colors duration-150 ${
                        isDropTarget
                          ? 'bg-sky-50 dark:bg-sky-900/30 ring-2 ring-inset ring-sky-400'
                          : ''
                      }`}
                      onDragOver={(e) => handleDragOver(e, jour, c.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, jour, c)}
                    >
                      <div className="flex flex-col gap-2 h-full justify-center">
                        {matchingSeances.length > 0 ? (
                          matchingSeances.map((seance) => (
                            <div
                              key={seance.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, seance.id)}
                              onDragEnd={handleDragEnd}
                              className="cursor-grab active:cursor-grabbing"
                            >
                              <SessionCard
                                seance={seance}
                                onDelete={onDeleteSeance}
                                modules={modules}
                                groupes={groupes}
                                espaces={espaces}
                                formateurs={formateurs}
                              />
                            </div>
                          ))
                        ) : (
                          <div
                            onClick={() => onCellClick && onCellClick(jour, c)}
                            className="w-full h-full min-h-[60px] flex items-center justify-center border border-dashed border-transparent rounded-lg hover:border-sky-300 dark:hover:border-sky-500 hover:bg-sky-50/30 dark:hover:bg-sky-900/20 transition cursor-pointer text-[10px] text-slate-300 dark:text-slate-600 hover:text-sky-600 dark:hover:text-sky-400 font-medium group py-4"
                          >
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                              + Ajouter
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Légende drag & drop */}
      {draggedSeanceId && (
        <div className="px-4 py-2 bg-sky-50 dark:bg-sky-900/30 border-t border-sky-200 dark:border-sky-800 text-xs text-sky-700 dark:text-sky-300 font-medium flex items-center gap-2">
          <span>🎯</span>
          <span>Glissez la séance vers le créneau souhaité. La modification sera soumise au chef de pôle pour validation.</span>
        </div>
      )}
    </div>
  );
};

export default ScheduleGrid;
