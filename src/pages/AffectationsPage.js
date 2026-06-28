import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';

/**
 * AffectationsPage - Vue récapitulative globale des séances.
 */
const AffectationsPage = () => {
  const { seances, modules, groupes, formateurs, espaces, poles, filieres } = useData();
  const [selectedPole, setSelectedPole] = useState('');
  const [selectedStatut, setSelectedStatut] = useState('');

  // Filtrer les séances selon le pôle et le statut
  const filteredSeances = seances.filter(s => {
    // Si filtré par pôle, retrouver le pôle du groupe/filière de la séance
    if (selectedPole) {
      const gp = groupes.find(g => g.id === s.groupe_id) || {};
      const fil = filieres.find(f => f.id === gp.filiere_id) || {};
      if (fil.pole_id !== Number(selectedPole)) return false;
    }

    if (selectedStatut && s.statut !== selectedStatut) return false;

    return true;
  });

  const getStatutBadgeVariant = (statut) => {
    switch (statut) {
      case 'Validée':
        return 'success';
      case 'En attente':
        return 'pending';
      case 'Refusée':
        return 'danger';
      default:
        return 'warning';
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Affectations & Suivi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Suivi en temps réel de toutes les séances planifiées et de leur statut de validation.
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3">
          <Select
            value={selectedPole}
            onChange={(e) => setSelectedPole(e.target.value)}
            options={poles.map(p => ({ value: String(p.id), label: p.nom_pole }))}
            placeholder="Tous les pôles"
            className="w-[180px]"
          />
          <Select
            value={selectedStatut}
            onChange={(e) => setSelectedStatut(e.target.value)}
            options={[
              { value: 'Validée', label: 'Validée' },
              { value: 'En attente', label: 'En attente' },
              { value: 'Refusée', label: 'Refusée' },
              { value: 'Suppression en attente', label: 'Suppression en attente' }
            ]}
            placeholder="Tous les statuts"
            className="w-[180px]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-gray-100 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Créneau</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Groupe</th>
                <th className="py-3 px-4">Formateur</th>
                <th className="py-3 px-4">Salle</th>
                <th className="py-3 px-4 text-center">Type</th>
                <th className="py-3 px-4 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredSeances.length > 0 ? (
                filteredSeances.map((s) => {
                  const mod = modules.find(m => m.id === s.module_id) || {};
                  const gp = groupes.find(g => g.id === s.groupe_id) || {};
                  const form = formateurs.find(f => f.id === s.formateur_id) || {};
                  const esp = espaces.find(e => e.id === s.espace_id) || {};

                  return (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-800">
                        {s.jour} <span className="text-[10px] text-gray-400 font-normal block mt-0.5">{s.heure_debut} - {s.heure_fin}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-700">{mod.nom_module}</td>
                      <td className="py-3.5 px-4">{gp.nom_groupe}</td>
                      <td className="py-3.5 px-4">{form.prenom} {form.nom}</td>
                      <td className="py-3.5 px-4">{esp.nom_espace}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-semibold">
                          {s.type_seance}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant={getStatutBadgeVariant(s.statut)}>
                          {s.statut}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400 italic">
                    Aucune séance ne correspond aux critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AffectationsPage;
