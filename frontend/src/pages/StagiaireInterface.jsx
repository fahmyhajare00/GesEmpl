import React from 'react';
import Schedule from './Schedule';

const StagiaireInterface = () => {
  const myGroup = 'DEV101'; // Simulated logged-in user's group

  return (
    <div className="h-full w-full">
      <div className="mb-4 px-4">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Mon Emploi du Temps</h1>
        <p className="text-slate-600 dark:text-slate-300">Groupe : <span className="font-bold text-sky-500">{myGroup}</span></p>
      </div>
      <Schedule 
        fixedGroupe={myGroup}
        hideFilters={true}
        hideStats={true}
        readOnly={true}
      />
    </div>
  );
};

export default StagiaireInterface;
