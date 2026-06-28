import React from 'react';

/**
 * Button — Composant bouton réutilisable avec variantes et tailles.
 *
 * Supporte plusieurs styles visuels (primary, secondary, danger, success, ghost),
 * trois tailles (sm, md, lg), un état désactivé et une icône optionnelle.
 *
 * @param {React.ReactNode} children  — Contenu du bouton (texte)
 * @param {function}        onClick   — Gestionnaire de clic
 * @param {'primary'|'secondary'|'danger'|'success'|'ghost'} variant — Style visuel
 * @param {'sm'|'md'|'lg'}  size      — Taille du bouton
 * @param {boolean}         disabled  — État désactivé
 * @param {string}          className — Classes CSS supplémentaires
 * @param {React.ReactNode} icon      — Icône à afficher avant le texte
 */

// Correspondance variante → classes Tailwind
const variantStyles = {
  primary: 'bg-sky-500 hover:bg-sky-600 text-white shadow-sm hover:shadow',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm hover:shadow',
  success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
};

// Correspondance taille → classes Tailwind
const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
}) => {
  const variantClass = variantStyles[variant] || variantStyles.primary;
  const sizeClass = sizeStyles[size] || sizeStyles.md;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg font-medium
        transition-all duration-200
        ${variantClass}
        ${sizeClass}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Icône optionnelle avant le texte */}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
