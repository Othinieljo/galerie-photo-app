"use client";

/**
 * ImageCard Component
 * 
 * Carte d'affichage d'une photo Unsplash avec :
 * - Image optimisée avec Next.js Image (lazy loading, responsive)
 * - Overlay de détails au survol (auteur, description, stats)
 * - Bouton like/unlike 
 * - Gestion d'erreur de chargement d'image
 * - Animation d'entrée avec délai progressif pour effet cascade
 * 
 * @param photo - Données de la photo Unsplash
 * @param isLiked - État actuel du like pour cette photo
 * @param onLikeToggle - Callback pour toggle le like
 * @param index - Index dans la grille (pour animation delay)
 * @param priority - Si true, charge l'image en priorité (LCP optimization)
 * 
 * @component
 */

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { UnsplashPhoto } from "@/types";
import { LikeButton } from "./LikeButton";
import { ImageDetailsOverlay } from "./ImageDetailsOverlay";

interface ImageCardProps {
  photo: UnsplashPhoto;
  isLiked: boolean;
  onLikeToggle: () => void;
  index: number;
  priority?: boolean;
}

export function ImageCard({ photo, isLiked, onLikeToggle, index, priority = false }: ImageCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const alt = photo.alt_description ?? `Photo par ${photo.user?.name ?? "Unsplash"}`;
  const imageUrl = photo.urls?.regular || photo.urls?.small || "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index % 6 * 0.05 }}
      className="group relative aspect-[4/3] overflow-hidden rounded-[var(--ds-radius)] bg-[var(--ds-border)] shadow-[var(--ds-shadow-md)] cursor-pointer"
      style={{ position: "relative" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imageUrl && !imageError ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          onError={() => {
            console.error("Image load error:", photo.id, imageUrl);
            setImageError(true);
          }}
        />
      ) : (
        // UI de secours en cas d'erreur de chargement
        <div className="flex h-full w-full items-center justify-center bg-[var(--ds-border)] text-[var(--ds-text-muted)]">
          <span className="text-sm">Image non disponible</span>
        </div>
      )}
      
      {/* Overlay de détails affiché au survol (pointer-events: none pour ne pas bloquer le like) */}
      <ImageDetailsOverlay photo={photo} isVisible={isHovered} />
      
      {/* Bouton like positionné en absolu (z-index élevé pour rester au-dessus de l'overlay) */}
      <div className="absolute right-1.5 top-1.5 z-20 sm:right-2 sm:top-2">
        <LikeButton isLiked={isLiked} onToggle={onLikeToggle} />
      </div>
    </motion.article>
  );
}
