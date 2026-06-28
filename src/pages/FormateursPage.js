import React from 'react';
import { useData } from '../context/DataContext';

/**
 * FormateursPage - Liste des formateurs avec charge horaire.
 */
const FormateursPage = () => {
  const { formateurs, poles } = useData();

  const getInitials = (f) => `${f.prenom[0]}${f.nom[0]}`.toUpperCase();

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Formateurs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Annuaire des formateurs du CMC de Beni Mellal et suivi du volume horaire hebdomadaire contractuel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formateurs.map((formateur) => {
          const pole = poles.find(p => p.id === formateur.pole_id) || {};
          
          return (
            <div key={formateur.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition flex gap-4">
              {/* Avatar cercle */}
              <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {getInitials(formateur)}
              </div>

              {/* Détails */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-base truncate">
                  {formateur.prenom} {formateur.nom}
                </h3>
                <p className="text-xs text-sky-600 font-medium mt-0.5">{formateur.specialite}</p>
                
                <div className="mt-3 space-y-1 text-xs text-gray-500">
                  <p className="truncate"><span className="text-gray-400">Email:</span> {formateur.email}</p>
                  <p><span className="text-gray-400">Pôle:</span> {pole.nom_pole}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-400">Contrat hebdo :</span>
                    <span className="text-gray-700">{formateur.volume_horaire_contractuel}h</span>
                  </div>
                  {/* Barre de progression simple */}
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full w-[70%]" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormateursPage;
