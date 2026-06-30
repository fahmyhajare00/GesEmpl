import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DirecteurPedagogique = () => {
  const { sessions, config } = useSelector(state => state.schedule);
  
  const totalSessions = sessions.length;
  const validatedSessions = sessions.filter(s => s.status !== 'en_attente' && s.status !== 'refusee' && s.status !== 'pending').length;
  const poles = config?.poles || [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">Espace Directeur Pédagogique</h1>
        <p className="text-slate-600 dark:text-slate-300">Vue d'ensemble et supervision de l'établissement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Séances</h3>
          <p className="text-4xl font-black text-slate-800 dark:text-white">{totalSessions}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-2">Séances Validées</h3>
          <p className="text-4xl font-black text-slate-800 dark:text-white">{validatedSessions}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-bold text-sky-500 uppercase tracking-wider mb-2">Pôles Actifs</h3>
          <p className="text-4xl font-black text-slate-800 dark:text-white">{poles.length}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Statut par Pôle</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {poles.map(pole => {
          const poleSessions = sessions.filter(s => s.pole === pole && s.status !== 'en_attente' && s.status !== 'refusee' && s.status !== 'pending').length;
          return (
            <div key={pole} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl font-black text-slate-400">
                  {pole.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">{pole}</h4>
                  <p className="text-sm text-slate-500">{poleSessions} séance(s) programmée(s)</p>
                </div>
              </div>
              <Link 
                to={`/planning?pole=${encodeURIComponent(pole)}`}
                className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-bold text-sm transition-colors no-underline text-center"
              >
                Voir détails
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DirecteurPedagogique;
