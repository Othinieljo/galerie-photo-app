"use client";

/**
 * ErrorState Component
 * 
 * Composant réutilisable pour afficher les erreurs avec :
 * - Message d'erreur clair et accessible (role="alert")
 * - Bouton de retry optionnel avec état de chargement
 * - Animations d'entrée/sortie fluides
 * - Design responsive (mobile-first)
 * 
 * @param message - Message d'erreur à afficher
 * @param onRetry - Callback optionnel pour réessayer l'action
 * @param isRetrying - État de chargement pendant le retry
 * 
 * @component
 */

import { motion } from "framer-motion";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({ message, onRetry, isRetrying }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center gap-3 rounded-[var(--ds-radius)] border border-[var(--ds-error-border)] bg-[var(--ds-error-bg)] p-4 text-center sm:gap-4 sm:p-6"
      role="alert"
    >
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <svg
          className="h-4 w-4 flex-shrink-0 text-[var(--ds-error)] sm:h-5 sm:w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-xs font-medium text-[var(--ds-error)] break-words sm:text-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="w-full rounded-[var(--ds-radius)] bg-[var(--ds-error-bg)] px-3 py-1.5 text-xs font-medium text-[var(--ds-error)] transition-all hover:opacity-90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--ds-error-border)] sm:w-auto sm:px-4 sm:py-2 sm:text-sm"
        >
          {isRetrying ? "Nouvelle tentative..." : "Réessayer"}
        </button>
      )}
    </motion.div>
  );
}
