import React from 'react';

const modules = [
  { name: 'Arabe', mht: 20, coef: 1, efm: 'NON' },
  { name: 'Français', mht: 115, coef: 2, efm: 'NON' },
  { name: 'Anglais technique', mht: 50, coef: 2, efm: 'NON' },
  { name: 'Culture entrepreneuriale', mht: 30, coef: 1, efm: 'NON' },
  { name: 'Compétences comportementales', mht: 30, coef: 2, efm: 'NON' },
  { name: 'Entrepreneuriat-PIE 1', mht: 72, coef: 1, efm: 'NON' },
  { name: 'Culture et techniques avancées du numérique', mht: 40, coef: 1, efm: 'NON' },
  { name: 'Métier et formation', mht: 30, coef: 1, efm: 'NON' },
  { name: 'Droit fondamental', mht: 60, coef: 1, efm: 'NON' },
  { name: 'Management des organisations', mht: 90, coef: 3, efm: 'OUI' },
  { name: 'Comptabilité générale 1', mht: 120, coef: 3, efm: 'OUI' },
  { name: 'Gestion électronique des données', mht: 40, coef: 1, efm: 'NON' },
  { name: 'Marketing', mht: 90, coef: 3, efm: 'OUI' },
  { name: 'Comptabilité générale 2', mht: 70, coef: 2, efm: 'OUI' },
  { name: 'Écrits professionnels', mht: 60, coef: 1, efm: 'NON' },
  { name: 'Statistique', mht: 80, coef: 2, efm: 'NON' },
  { name: 'Logiciel de Gestion Commerciale, Comptable', mht: 60, coef: 1, efm: 'NON' },
]

export default function MesModules() {
  return (
    <section className="mt-[18px] p-[18px] rounded-[22px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[0_24px_60px_rgba(15,23,42,0.12)] transition-all duration-300 dark:shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-[18px]">
        <h2 className="m-0 text-[20px] font-bold text-slate-800 dark:text-white">Mes modules</h2>
      </div>

      <div className="w-full overflow-x-auto mt-4">
        <table className="w-full border-collapse min-w-[720px]">
          <thead>
            <tr>
              <th className="text-left font-bold text-[13px] uppercase tracking-[0.08em] p-4 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">Module</th>
              <th className="text-left font-bold text-[13px] uppercase tracking-[0.08em] p-4 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">MHT</th>
              <th className="text-left font-bold text-[13px] uppercase tracking-[0.08em] p-4 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">Coef</th>
              <th className="text-left font-bold text-[13px] uppercase tracking-[0.08em] p-4 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">EFM Régional</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module.name} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="p-4 border-b border-slate-100 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 text-[14px] min-w-[260px]">{module.name}</td>
                <td className="p-4 border-b border-slate-100 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 text-[14px] font-medium">{module.mht}</td>
                <td className="p-4 border-b border-slate-100 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 text-[14px] font-medium">{module.coef}</td>
                <td className="p-4 border-b border-slate-100 dark:border-slate-700/50 text-[14px]">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wider ${
                    module.efm === 'OUI' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {module.efm}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
