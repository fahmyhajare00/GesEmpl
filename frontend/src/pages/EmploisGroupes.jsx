import React from 'react';
import { useSelector } from 'react-redux';
import Schedule from './Schedule';

const EmploisGroupes = () => {
  const { user } = useSelector(state => state.schedule);
  const myName = user?.name || "MED Med";
  
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Emplois des Groupes</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Consultez les emplois du temps des groupes que vous enseignez.</p>
        </div>
      </div>
      <Schedule 
        initialFormateur="all"
        formateurGroupView={true}
        myName={myName}
        hideStats={true}
        readOnly={true}
      />
    </div>
  );
};

export default EmploisGroupes;
