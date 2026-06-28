import React from 'react';

/**
 * StatsCard — Carte de statistiques réutilisable.
 *
 * Affiche une valeur numérique mise en avant avec une bordure colorée à gauche,
 * un titre descriptif en dessous et une icône décorative à droite.
 *
 * @param {string}  title  — Libellé de la statistique (ex: "Séances validées")
 * @param {string|number} value — Valeur numérique à afficher
 * @param {React.ReactNode} icon — Icône React (ex: <FiCalendar />)
 * @param {'blue'|'green'|'orange'|'purple'|'red'} color — Thème de couleur
 */

// Correspondance couleur → classes Tailwind pour le texte
const textColorMap = {
  blue: 'text-sky-500',
  green: 'text-emerald-500',
  orange: 'text-amber-500',
  purple: 'text-violet-500',
  red: 'text-rose-500',
};

// Correspondance couleur → classes Tailwind pour la bordure gauche
const borderColorMap = {
  blue: 'border-l-sky-500',
  green: 'border-l-emerald-500',
  orange: 'border-l-amber-500',
  purple: 'border-l-violet-500',
  red: 'border-l-rose-500',
};

// Correspondance couleur → fond léger pour l'icône
const iconBgMap = {
  blue: 'bg-sky-50 dark:bg-sky-900/30',
  green: 'bg-emerald-50 dark:bg-emerald-900/30',
  orange: 'bg-amber-50 dark:bg-amber-900/30',
  purple: 'bg-violet-50 dark:bg-violet-900/30',
  red: 'bg-rose-50 dark:bg-rose-900/30',
};

const StatsCard = ({ title, value, icon, color = 'blue', onClick }) => {
  const textColor = textColorMap[color] || textColorMap.blue;
  const borderColor = borderColorMap[color] || borderColorMap.blue;
  const iconBg = iconBgMap[color] || iconBgMap.blue;

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm 
        transition-all duration-200 border-l-4 ${borderColor}
        ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : 'hover:shadow-md'}
      `}
    >
      <div className="flex items-center justify-between">
        {/* Partie gauche : valeur + titre */}
        <div>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{title}</p>
        </div>

        {/* Partie droite : icône */}
        {icon && (
          <div className={`${iconBg} ${textColor} p-3 rounded-xl text-xl`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
