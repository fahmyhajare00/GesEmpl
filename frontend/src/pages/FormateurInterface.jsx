import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Schedule from './Schedule';

const FormateurInterface = () => {
  const { user } = useSelector(state => state.schedule);
  const myName = user?.name || 'MED Med';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    alert('Votre déclaration a été envoyée avec succès et est en attente de validation.');
  };

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-end mb-4 px-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">Espace Formateur</h1>
          <p className="text-slate-600 dark:text-slate-300">Bienvenue, <span className="font-bold text-emerald-500">{myName}</span></p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm transition-colors"
        >
          + Signaler une absence
        </button>
      </div>
      <Schedule 
        fixedFormateur={myName}
        hideFilters={true}
        formateurMode={true}
        myName={myName}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[1000] animate-fadeIn" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-slate-800 w-[500px] max-w-[90%] p-6 rounded-xl shadow-xl animate-slideUp border border-white/30 dark:border-slate-700" onClick={e => e.stopPropagation()}>
            <h2 className="mt-0 mb-6 text-xl font-bold text-slate-800 dark:text-white">Signaler une absence</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Type de déclaration</label>
                <select required className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                  <option value="absence">Absence</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Date de début</label>
                  <input type="date" required className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Date de fin</label>
                  <input type="date" required className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Motif ou Description</label>
                <textarea required rows="3" className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="Précisez la raison ou le lieu de la mission..."></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors">
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-md transition-all">
                  Soumettre la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormateurInterface;
