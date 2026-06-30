import React from 'react';
import { useSelector } from 'react-redux';

const VueMensuelle = () => {
  const { sessions } = useSelector(state => state.schedule);
  const myGroup = 'DEV101'; 
  
  const mySessions = sessions.filter(s => s.groupe === myGroup);
  
  // Paramètres du calendrier (Ex: Juillet 2026)
  // Le 1er Juillet 2026 est un Mercredi.
  const daysInMonth = 31;
  const firstDayOffset = 2; // Lundi=0, Mardi=1, Mercredi=2
  
  const calendarCells = [];
  
  // Cellules vides avant le premier jour du mois
  for (let i = 0; i < firstDayOffset; i++) {
    calendarCells.push({ dayNumber: null, isCurrentMonth: false, sessions: [] });
  }

  // Jours du mois
  for (let d = 1; d <= daysInMonth; d++) {
    // Jour de la semaine (0 = Lundi, 6 = Dimanche)
    const dayOfWeekIndex = (firstDayOffset + d - 1) % 7;
    const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const currentDayName = weekDays[dayOfWeekIndex];

    // Simuler des séances pour ce jour
    const daySessions = mySessions.filter(s => {
      // Pour la démo : afficher la séance uniquement sur certains jours du mois correspondant à son jour de semaine
      return s.day === currentDayName && (d % 3 === 0 || d % 5 === 0);
    });

    calendarCells.push({ dayNumber: d, isCurrentMonth: true, sessions: daySessions });
  }

  // Remplir la dernière ligne pour avoir une grille complète (multiple de 7)
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push({ dayNumber: null, isCurrentMonth: false, sessions: [] });
  }

  const headerDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Calendrier</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Juillet 2026</p>
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
          <button className="px-2 text-slate-400 hover:text-sky-500 font-bold">&lt;</button>
          <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm min-w-[100px] text-center">Aujourd'hui</span>
          <button className="px-2 text-slate-400 hover:text-sky-500 font-bold">&gt;</button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded shadow-sm border border-slate-200 dark:border-slate-700 flex-1 flex flex-col overflow-hidden">
        {/* En-tête des jours */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
          {headerDays.map((day, idx) => (
            <div key={day} className={`py-3 text-center text-xs font-semibold text-slate-500 border-slate-200 dark:border-slate-700 ${idx < 6 ? 'border-r' : ''}`}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-slate-50 dark:bg-slate-900/30 gap-[1px]">
          {calendarCells.map((cell, idx) => (
            <div 
              key={idx} 
              className={`min-h-[120px] p-2 bg-white dark:bg-slate-800 flex flex-col ${!cell.isCurrentMonth ? 'opacity-40' : ''}`}
            >
              <div className="flex justify-end mb-1">
                {cell.dayNumber && (
                  <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${cell.dayNumber === 15 ? 'bg-sky-500 text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    {cell.dayNumber}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar flex-1">
                {cell.sessions.map((s, i) => (
                  <div 
                    key={i} 
                    className="px-2 py-1.5 rounded bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/50 hover:border-sky-300 transition-colors cursor-pointer"
                  >
                    <div className="text-[0.65rem] font-bold text-sky-700 dark:text-sky-400 mb-0.5 truncate">
                      {s.timeSlot.split(' - ')[0]}
                    </div>
                    <div className="text-[0.7rem] font-medium text-slate-700 dark:text-slate-300 truncate">
                      {s.module}
                    </div>
                    <div className="text-[0.6rem] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {s.salle}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VueMensuelle;
