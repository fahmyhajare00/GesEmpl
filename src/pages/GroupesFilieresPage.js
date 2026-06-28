import React from 'react';
import { useData } from '../context/DataContext';
import Badge from '../components/ui/Badge';

/**
 * GroupesFilieresPage - Page de consultation des groupes et filières.
 */
const GroupesFilieresPage = () => {
  const { groupes, filieres, poles } = useData();

  // Regrouper les filières par pôle
  const filieresByPole = (poleId) => {
    return filieres.filter(f => f.pole_id === poleId);
  };

  // Obtenir les groupes pour une filière donnée
  const groupesByFiliere = (filiereId) => {
    return groupes.filter(g => g.filiere_id === filiereId);
  };

  const getNiveauBadgeVariant = (niveau) => {
    if (niveau.includes('Spécialisé')) return 'info';
    if (niveau.includes('Technicien')) return 'success';
    return 'warning';
  };

  return (
    <div className="space-y-8 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Groupes & Filières</h1>
        <p className="text-sm text-gray-500 mt-1">
          Consultez l'organisation pédagogique du CMC : pôles, filières et groupes d'apprenants.
        </p>
      </div>

      {poles.map((pole) => {
        const poleFilieres = filieresByPole(pole.id);
        if (poleFilieres.length === 0) return null;

        return (
          <div key={pole.id} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-700 border-b pb-2 flex items-center gap-2">
              <span className="w-3 h-3 bg-sky-500 rounded-full" />
              Pôle {pole.nom_pole}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {poleFilieres.map((filiere) => {
                const filiereGroupes = groupesByFiliere(filiere.id);

                return (
                  <div key={filiere.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-sky-500 bg-sky-50 px-2 py-0.5 rounded">
                          {filiere.code_filiere}
                        </span>
                        <h3 className="font-bold text-gray-800 mt-1 text-sm">{filiere.nom_filiere}</h3>
                      </div>
                      <Badge variant={getNiveauBadgeVariant(filiere.niveau)}>
                        {filiere.niveau}
                      </Badge>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-50">
                      <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                        Groupes ({filiereGroupes.length})
                      </h4>
                      {filiereGroupes.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {filiereGroupes.map((groupe) => (
                            <div key={groupe.id} className="bg-gray-50 rounded-lg p-2.5 border border-gray-100 flex flex-col justify-between">
                              <span className="font-bold text-gray-700 text-xs">{groupe.nom_groupe}</span>
                              <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                                <span>{groupe.effectif} apprenants</span>
                                <span>{groupe.annee_formation}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Aucun groupe affecté pour le moment.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GroupesFilieresPage;
