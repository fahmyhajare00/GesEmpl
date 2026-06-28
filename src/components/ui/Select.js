import React from 'react';

/**
 * Select — Composant de sélection stylisé avec label optionnel.
 *
 * Affiche un menu déroulant avec une liste d'options,
 * un placeholder par défaut et un label descriptif au-dessus.
 *
 * @param {string}   label       — Libellé au-dessus du select (optionnel)
 * @param {string}   value       — Valeur actuellement sélectionnée
 * @param {function} onChange    — Fonction appelée lors d'un changement
 * @param {Array<{value: string, label: string}>} options — Liste des options
 * @param {string}   placeholder — Texte du placeholder (optionnel)
 * @param {string}   className   — Classes CSS supplémentaires (optionnel)
 */
const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Sélectionner...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label descriptif (affiché uniquement si fourni) */}
      {label && (
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Menu déroulant stylisé */}
      <select
        value={value}
        onChange={onChange}
        className="
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg
          px-3 py-2 text-sm text-gray-700 dark:text-gray-200
          focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500
          transition-all duration-200
          appearance-none cursor-pointer
          bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')]
          bg-no-repeat bg-[center_right_0.75rem]
          pr-8
        "
      >
        {/* Option placeholder par défaut */}
        <option value="" disabled>
          {placeholder}
        </option>

        {/* Options dynamiques */}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
