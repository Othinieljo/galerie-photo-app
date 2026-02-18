"use client";

import type { UnsplashPhoto } from "@/types";
import { ImageCard } from "./ImageCard";

interface ImageGridProps {
  photos: UnsplashPhoto[];
  isLiked: (id: string) => boolean;
  onLikeToggle: (id: string) => void;
}

export function ImageGrid({ photos, isLiked, onLikeToggle }: ImageGridProps) {
  // Les 6 premières images sont au-dessus du pli et sont chargées en priorité pour une meilleure LCP
  const ABOVE_THE_FOLD_COUNT = 6;

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo, index) => (
        <ImageCard
          key={photo.id}
          photo={photo}
          index={index}
          isLiked={isLiked(photo.id)}
          onLikeToggle={() => onLikeToggle(photo.id)}
          priority={index < ABOVE_THE_FOLD_COUNT}
        />
      ))}
    </div>
  );
}
