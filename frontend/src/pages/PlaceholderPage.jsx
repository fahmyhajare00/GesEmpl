import React from 'react';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 m-8">
      <span className="text-6xl block mb-6">🚧</span>
      <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-4">{title}</h1>
      <p className="text-slate-500 dark:text-slate-400 text-lg">Cette interface est en cours de construction.</p>
    </div>
  );
};

export default PlaceholderPage;
