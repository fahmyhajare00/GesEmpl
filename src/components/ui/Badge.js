import React from 'react';

/**
 * Badge — Composant badge/étiquette avec variantes de couleur.
 *
 * Utilisé pour afficher des statuts (validé, en attente, refusé, etc.)
 * sous forme de petites pastilles colorées.
 *
 * @param {React.ReactNode} children — Contenu du badge (texte)
 * @param {'success'|'warning'|'danger'|'info'|'pending'} variant — Variante de style
 */

// Correspondance variante → classes Tailwind (fond clair + texte foncé)
const variantStyles = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
  info: 'bg-sky-100 text-sky-700',
  pending: 'bg-orange-100 text-orange-700',
};

const Badge = ({ children, variant = 'info' }) => {
  const styles = variantStyles[variant] || variantStyles.info;

  return (
    <span
      className={`
        inline-flex items-center rounded-full px-3 py-1
        text-xs font-semibold ${styles}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
