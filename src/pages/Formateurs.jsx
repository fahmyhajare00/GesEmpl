import React from 'react';
import { Link } from 'react-router-dom';

export default function Formateurs() {
  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Formateurs</h1>
        <Link to="/" className="inline-block bg-slate-100 text-slate-800 px-3 py-2 rounded-lg text-sm font-semibold no-underline border border-slate-200 transition-all hover:bg-slate-200 hover:-translate-y-px dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600">
          ⬅ Emploi du temps
        </Link>
      </div>

      <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <thead className="bg-gradient-to-br from-brand to-brand-hover text-white">
          <tr>
            <th className="p-3.5 text-left text-sm font-bold tracking-wide">Nom</th>
            <th className="p-3.5 text-left text-sm font-bold tracking-wide">Spécialité</th>
            <th className="p-3.5 text-left text-sm font-bold tracking-wide">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr className="transition-all cursor-pointer hover:bg-slate-50 hover:scale-[1.01] dark:hover:bg-slate-700/50">
            <td className="p-3.5 text-[0.95rem] text-slate-600 border-b border-slate-100 dark:text-slate-300 dark:border-slate-700">A. Karim</td>
            <td className="p-3.5 text-[0.95rem] text-slate-600 border-b border-slate-100 dark:text-slate-300 dark:border-slate-700">React / Frontend</td>
            <td className="p-3.5 text-[0.95rem] text-slate-600 border-b border-slate-100 dark:text-slate-300 dark:border-slate-700">karim@mail.com</td>
          </tr>
          <tr className="transition-all cursor-pointer hover:bg-slate-50 hover:scale-[1.01] dark:hover:bg-slate-700/50">
            <td className="p-3.5 text-[0.95rem] text-slate-600 border-b border-slate-100 dark:text-slate-300 dark:border-slate-700">S. Rami</td>
            <td className="p-3.5 text-[0.95rem] text-slate-600 border-b border-slate-100 dark:text-slate-300 dark:border-slate-700">UI/UX Design</td>
            <td className="p-3.5 text-[0.95rem] text-slate-600 border-b border-slate-100 dark:text-slate-300 dark:border-slate-700">rami@mail.com</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}