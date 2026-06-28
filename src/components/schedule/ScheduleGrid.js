import React from 'react';
import SessionCard from './SessionCard';

/**
 * ScheduleGrid - Grille de l'emploi du temps hebdomadaire.
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
  onCellClick
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed min-w-[800px]">
          {/* En-tête des créneaux horaires */}
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <th className="w-[120px] py-4 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                JOURS
              </th>
              {creneaux.map((c) => (
                <th key={c.id} className="py-4 px-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-l border-gray-100 dark:border-gray-700">
                  <div className="font-bold text-gray-700 dark:text-gray-300">{c.label}</div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal mt-0.5">{c.heure_debut} - {c.heure_fin}</div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Lignes pour chaque jour de la semaine */}
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {jours.map((jour, idx) => (
              <tr key={jour} className={idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/30 dark:bg-gray-800/60'}>
                {/* Libellé du Jour */}
                <td className="py-4 px-4 font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide bg-gray-50/50 dark:bg-gray-900/30">
                  {jour}
                </td>

                {/* Créneaux pour le jour donné */}
                {creneaux.map((c) => {
                  // Filtrer les séances correspondantes à ce jour et ce créneau
                  const matchingSeances = seances.filter(
                    (s) => s.jour.toLowerCase() === jour.toLowerCase() &&
                           s.heure_debut.toLowerCase() === c.heure_debut.toLowerCase()
                  );

                  return (
                    <td key={c.id} className="p-2 border-l border-gray-100 dark:border-gray-700 min-h-[100px] align-top">
                      <div className="flex flex-col gap-2 h-full justify-center">
                        {matchingSeances.length > 0 ? (
                          matchingSeances.map((seance) => (
                            <SessionCard
                              key={seance.id}
                              seance={seance}
                              onDelete={onDeleteSeance}
                              modules={modules}
                              groupes={groupes}
                              espaces={espaces}
                              formateurs={formateurs}
                            />
                          ))
                        ) : (
                          <div 
                            onClick={() => onCellClick && onCellClick(jour, c)}
                            className="w-full h-full min-h-[60px] flex items-center justify-center border border-dashed border-transparent rounded-lg hover:border-sky-300 dark:hover:border-sky-500 hover:bg-sky-50/30 dark:hover:bg-sky-900/20 transition cursor-pointer text-[10px] text-gray-300 dark:text-gray-600 hover:text-sky-600 dark:hover:text-sky-400 font-medium group py-4"
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
    </div>
  );
};

export default ScheduleGrid;
