import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Select from '../components/ui/Select';

/**
 * ModulesPage - Page de consultation du référentiel des modules.
 */
const ModulesPage = () => {
  const { modules, filieres } = useData();
  const [selectedFiliere, setSelectedFiliere] = useState('');

  const filteredModules = selectedFiliere
    ? modules.filter(m => m.filiere_id === Number(selectedFiliere))
    : modules;

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modules d'Enseignement</h1>
          <p className="text-sm text-gray-500 mt-1">
            Visualisez le référentiel des modules par filière et leur volume horaire total.
          </p>
        </div>

        {/* Filtre Filière */}
        <Select
          value={selectedFiliere}
          onChange={(e) => setSelectedFiliere(e.target.value)}
          options={filieres.map(f => ({ value: String(f.id), label: `${f.code_filiere} - ${f.nom_filiere}` }))}
          placeholder="Filtrer par filière..."
          className="w-full sm:w-[250px]"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-gray-100 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Libellé du Module</th>
                <th className="py-3 px-4">Filière / Niveau</th>
                <th className="py-3 px-4 text-center">Volume Horaire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredModules.map((module) => {
                const filiere = filieres.find(f => f.id === module.filiere_id) || {};
                return (
                  <tr key={module.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5 px-4 font-bold text-sky-600">{module.code_module}</td>
                    <td className="py-3.5 px-4 font-medium text-gray-800">{module.nom_module}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-700">{filiere.nom_filiere}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{module.niveau}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-gray-800">
                      {module.volume_horaire_total} heures
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModulesPage;
