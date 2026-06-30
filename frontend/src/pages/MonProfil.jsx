import React from 'react';

const MonProfil = () => {
  // Informations factices pour le stagiaire connecté
  const stagiaire = {
    nom: 'Ahmed Bennis',
    cef: '1029384756',
    email: 'ahmed.bennis@ofppt-edu.ma',
    telephone: '+212 6 00 00 00 00',
    groupe: 'DEV101',
    filiere: 'Développement Web',
    annee: '1ère Année',
    pole: 'Digital',
    dateInscription: '01 Septembre 2025',
    absences: 2,
    moyenne: 14.5
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">Mon Profil</h1>
        <p className="text-slate-600 dark:text-slate-400">Consultez vos informations personnelles et académiques.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne de gauche : Carte de profil */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-sky-500 to-indigo-600"></div>
            <div className="px-6 pb-6 relative">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 mx-auto -mt-12 flex items-center justify-center text-3xl font-bold text-slate-500 shadow-md">
                {stagiaire.nom.charAt(0)}
              </div>
              <div className="text-center mt-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{stagiaire.nom}</h2>
                <p className="text-sky-500 font-medium text-sm mt-1">Stagiaire</p>
                <div className="inline-block mt-3 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold">
                  CEF: {stagiaire.cef}
                </div>
              </div>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-700 p-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Groupe</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{stagiaire.groupe}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Pôle</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{stagiaire.pole}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne de droite : Informations détaillées */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations de contact */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-xl">📞</span> Coordonnées
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Email institutionnel</label>
                <div className="font-medium text-slate-700 dark:text-slate-300">{stagiaire.email}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Téléphone</label>
                <div className="font-medium text-slate-700 dark:text-slate-300">{stagiaire.telephone}</div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button className="text-sky-500 hover:text-sky-600 text-sm font-bold transition-colors">
                Demander une modification
              </button>
            </div>
          </div>

          {/* Parcours académique */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-xl">🎓</span> Parcours Académique
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Filière</label>
                <div className="font-medium text-slate-700 dark:text-slate-300">{stagiaire.filiere}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Niveau d'étude</label>
                <div className="font-medium text-slate-700 dark:text-slate-300">{stagiaire.annee}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Date d'inscription</label>
                <div className="font-medium text-slate-700 dark:text-slate-300">{stagiaire.dateInscription}</div>
              </div>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-800/20 border border-rose-200 dark:border-rose-800/50 rounded-xl p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">Absences</div>
                <div className="text-3xl font-black text-rose-700 dark:text-rose-300">{stagiaire.absences} <span className="text-sm font-medium">heures</span></div>
              </div>
              <div className="w-12 h-12 bg-rose-200 dark:bg-rose-800/50 rounded-full flex items-center justify-center text-xl">
                ⚠️
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Moyenne</div>
                <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{stagiaire.moyenne}<span className="text-sm font-medium">/20</span></div>
              </div>
              <div className="w-12 h-12 bg-emerald-200 dark:bg-emerald-800/50 rounded-full flex items-center justify-center text-xl">
                📈
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonProfil;
