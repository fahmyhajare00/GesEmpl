import React from 'react';
import { useData } from '../context/DataContext';
import Badge from '../components/ui/Badge';
import { FiUsers } from 'react-icons/fi';

/**
 * SallesEspacesPage - Page listant les salles et espaces pédagogiques.
 */
const SallesEspacesPage = () => {
  const { espaces, poles } = useData();

  const getSpaceTypeVariant = (type) => {
    switch (type.toLowerCase()) {
      case 'salle informatique':
        return 'info';
      case 'atelier':
        return 'warning';
      case 'salle de cours':
        return 'success';
      default:
        return 'pending';
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Salles & Espaces</h1>
        <p className="text-sm text-gray-500 mt-1">
          Consultez la liste des espaces d'apprentissage et ateliers technologiques disponibles au CMC.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {espaces.map((espace) => {
          const pole = poles.find(p => p.id === espace.pole_id) || {};
          return (
            <div key={espace.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800 text-base">{espace.nom_espace}</h3>
                <Badge variant={getSpaceTypeVariant(espace.type_space || espace.type_espace)}>
                  {espace.type_space || espace.type_espace}
                </Badge>
              </div>

              <div className="space-y-2 mt-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <FiUsers className="text-gray-400 w-4 h-4" />
                  <span>Capacité d'accueil : <strong className="text-gray-800">{espace.capacite} places</strong></span>
                </div>
                <div>
                  <span className="text-gray-400">Équipements : </span>
                  <span className="text-gray-700">{espace.equipements || 'Standard'}</span>
                </div>
                <div className="pt-2 border-t border-gray-50 mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">Rattaché au pôle :</span>
                  <span className="font-semibold text-gray-700">{pole.nom_pole || 'Commun'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SallesEspacesPage;
