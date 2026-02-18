"use client";

import { motion } from "framer-motion";

interface LikeButtonProps {
  isLiked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function LikeButton({ isLiked, onToggle, disabled }: LikeButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      whileTap={{ scale: 0.92 }}
      className="like-button relative rounded-full bg-[var(--ds-card)]/90 p-1.5 shadow-[var(--ds-shadow-md)] backdrop-blur-sm transition-colors hover:bg-[var(--ds-card)] disabled:opacity-50 sm:p-2"
      aria-label={isLiked ? "Ne plus aimer cette photo" : "Aimer cette photo"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.5}
        className="size-4 text-[var(--ds-error)] sm:size-5"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </motion.button>
  );
}
