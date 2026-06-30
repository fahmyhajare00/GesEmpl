import React from 'react';

const AbsencesMissions = () => {
  // Données factices pour l'historique des absences et missions
  const historique = [
    { id: 1, type: 'Absence', dateDebut: '2026-06-15', dateFin: '2026-06-16', motif: 'Raison de santé', statut: 'Validée', typeColor: 'rose', statutColor: 'emerald' },
    { id: 2, type: 'Surveillance', dateDebut: '2026-06-20', dateFin: '2026-06-20', motif: 'Examen de fin de module', statut: 'Validée', typeColor: 'sky', statutColor: 'emerald' },
    { id: 3, type: 'Mission', dateDebut: '2026-07-05', dateFin: '2026-07-06', motif: 'Formation pédagogique', statut: 'En attente', typeColor: 'amber', statutColor: 'amber' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto h-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">Mes Absences & Missions</h1>
          <p className="text-slate-600 dark:text-slate-400">Historique de vos absences, missions et surveillances.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date de Début</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date de Fin</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Motif / Description</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {historique.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-${item.typeColor}-100 text-${item.typeColor}-700 dark:bg-${item.typeColor}-900/30 dark:text-${item.typeColor}-400`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 font-medium">{item.dateDebut}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 font-medium">{item.dateFin}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{item.motif}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-${item.statutColor}-200 bg-${item.statutColor}-50 text-${item.statutColor}-700 dark:border-${item.statutColor}-800 dark:bg-${item.statutColor}-900/20 dark:text-${item.statutColor}-400`}>
                      <span className={`w-1.5 h-1.5 rounded-full bg-${item.statutColor}-500`}></span>
                      {item.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {historique.length === 0 && (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            Aucun historique trouvé.
          </div>
        )}
      </div>
    </div>
  );
};

export default AbsencesMissions;
