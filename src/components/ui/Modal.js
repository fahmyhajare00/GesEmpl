import React, { useEffect } from 'react';

/**
 * Modal — Composant modale réutilisable avec fond sombre et animation.
 *
 * Gère le verrouillage du défilement du body lorsque la modale est ouverte
 * et propose plusieurs tailles prédéfinies.
 *
 * @param {boolean}  isOpen   — Contrôle l'affichage de la modale
 * @param {function} onClose  — Fonction appelée pour fermer la modale
 * @param {string}   title    — Titre affiché dans l'en-tête
 * @param {React.ReactNode} children — Contenu de la modale
 * @param {'sm'|'md'|'lg'|'xl'} size — Taille de la modale (défaut: 'md')
 */

// Correspondance taille → classe Tailwind de largeur maximale
const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const maxWidth = sizeMap[size] || sizeMap.md;

  // Verrouiller le défilement du body quand la modale est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Nettoyage au démontage du composant
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Ne rien rendre si la modale est fermée
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Fond sombre semi-transparent */}
      <div
        className={`
          absolute inset-0 bg-black/50
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* Contenu de la modale */}
      <div
        className={`
          relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full ${maxWidth}
          transform transition-all duration-300
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête avec titre et bouton de fermeture */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Fermer"
          >
            {/* Icône X en SVG */}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Corps de la modale avec défilement vertical si nécessaire */}
        <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
