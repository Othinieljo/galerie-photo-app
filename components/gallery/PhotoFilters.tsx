"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export type FilterOrderBy = "latest" | "oldest" | "popular" | "views";
export type FilterColor = "all" | "black_and_white" | "black" | "white" | "yellow" | "orange" | "red" | "purple" | "magenta" | "green" | "teal" | "blue";
export type FilterOrientation = "all" | "landscape" | "portrait" | "squarish";

interface PhotoFiltersProps {
  onFiltersChange: (filters: {
    orderBy: FilterOrderBy;
    color: FilterColor;
    orientation: FilterOrientation;
  }) => void;
}

export function PhotoFilters({ onFiltersChange }: PhotoFiltersProps) {
  const [orderBy, setOrderBy] = useState<FilterOrderBy>("latest");
  const [color, setColor] = useState<FilterColor>("all");
  const [orientation, setOrientation] = useState<FilterOrientation>("all");

  const handleOrderByChange = (value: FilterOrderBy) => {
    setOrderBy(value);
    onFiltersChange({ orderBy: value, color, orientation });
  };

  const handleColorChange = (value: FilterColor) => {
    setColor(value);
    onFiltersChange({ orderBy, color: value, orientation });
  };

  const handleOrientationChange = (value: FilterOrientation) => {
    setOrientation(value);
    onFiltersChange({ orderBy, color, orientation: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 flex flex-col gap-3 rounded-[var(--ds-radius)] bg-[var(--ds-card)] p-3 shadow-[var(--ds-shadow-md)] border border-[var(--ds-border)] sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:p-4"
    >
      {/* Ordre */}
      <div className="flex w-full flex-1 items-center gap-2 sm:w-auto sm:min-w-0">
        <label className="text-xs font-medium text-[var(--ds-text)] whitespace-nowrap sm:text-sm">
          Trier par:
        </label>
        <select
          value={orderBy}
          onChange={(e) => handleOrderByChange(e.target.value as FilterOrderBy)}
          className="flex-1 rounded-[var(--ds-radius-sm)] border border-[var(--ds-border)] bg-[var(--ds-input-bg)] px-2 py-1.5 text-xs text-[var(--ds-text)] focus:border-[var(--ds-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--ds-accent-focus-ring)] sm:flex-none sm:px-3 sm:text-sm"
        >
          <option value="latest">Plus récentes</option>
          <option value="oldest">Plus anciennes</option>
          <option value="popular">Populaires</option>
          <option value="views">Plus vues</option>
        </select>
      </div>

      {/* Couleur */}
      <div className="flex w-full flex-1 items-center gap-2 sm:w-auto sm:min-w-0">
        <label className="text-xs font-medium text-[var(--ds-text)] whitespace-nowrap sm:text-sm">
          Couleur:
        </label>
        <select
          value={color}
          onChange={(e) => handleColorChange(e.target.value as FilterColor)}
          className="flex-1 rounded-[var(--ds-radius-sm)] border border-[var(--ds-border)] bg-[var(--ds-input-bg)] px-2 py-1.5 text-xs text-[var(--ds-text)] focus:border-[var(--ds-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--ds-accent-focus-ring)] sm:flex-none sm:px-3 sm:text-sm"
        >
          <option value="all">Toutes</option>
          <option value="black_and_white">Noir et blanc</option>
          <option value="black">Noir</option>
          <option value="white">Blanc</option>
          <option value="yellow">Jaune</option>
          <option value="orange">Orange</option>
          <option value="red">Rouge</option>
          <option value="purple">Violet</option>
          <option value="magenta">Magenta</option>
          <option value="green">Vert</option>
          <option value="teal">Sarcelle</option>
          <option value="blue">Bleu</option>
        </select>
      </div>

      {/* Orientation */}
      <div className="flex w-full flex-1 items-center gap-2 sm:w-auto sm:min-w-0">
        <label className="text-xs font-medium text-[var(--ds-text)] whitespace-nowrap sm:text-sm">
          Orientation:
        </label>
        <select
          value={orientation}
          onChange={(e) => handleOrientationChange(e.target.value as FilterOrientation)}
          className="flex-1 rounded-[var(--ds-radius-sm)] border border-[var(--ds-border)] bg-[var(--ds-input-bg)] px-2 py-1.5 text-xs text-[var(--ds-text)] focus:border-[var(--ds-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--ds-accent-focus-ring)] sm:flex-none sm:px-3 sm:text-sm"
        >
          <option value="all">Toutes</option>
          <option value="landscape">Paysage</option>
          <option value="portrait">Portrait</option>
          <option value="squarish">Carré</option>
        </select>
      </div>
    </motion.div>
  );
}
