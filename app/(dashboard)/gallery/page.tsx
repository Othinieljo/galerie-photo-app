"use client";

/**
 * GalleryPage Component
 * 
 * Page principale de la galerie de photos Unsplash.
 * Gère :
 * - Les filtres de recherche (ordre, couleur, orientation)
 * - Le chargement infini des photos avec infinite scroll
 * - Les états de chargement, erreur, et vide
 * - L'affichage des informations utilisateur dans le header
 * 
 * @component
 */

import { useState } from "react";
import { useInfinitePhotos } from "@/lib/hooks/useInfinitePhotos";
import { useLikes } from "@/lib/hooks/useLikes";
import { ImageGrid } from "@/components/gallery/ImageGrid";
import { InfiniteScroll } from "@/components/gallery/InfiniteScroll";
import { PhotoFilters, type FilterOrderBy, type FilterColor, type FilterOrientation } from "@/components/gallery/PhotoFilters";
import { ImageGridSkeleton } from "@/components/gallery/ImageGridSkeleton";
import { UserInfo } from "@/components/gallery/UserInfo";
import { ErrorState } from "@/components/ui/ErrorState";
import { Spinner } from "@/components/ui/Spinner";

export default function GalleryPage() {
  const [filters, setFilters] = useState<{
    orderBy: FilterOrderBy;
    color: FilterColor;
    orientation: FilterOrientation;
  }>({
    orderBy: "latest",
    color: "all",
    orientation: "all",
  });

  // Hook personnalisé pour le chargement infini des photos avec gestion d'erreurs
  const { photos, loading, refreshing, error, hasMore, sentinelRef, retry } = useInfinitePhotos(filters);
  
  // Hook pour gérer les likes (lecture et toggle)
  const { isLiked, toggleLike } = useLikes();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-[var(--ds-border)] bg-[var(--ds-card)]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
          <h1 className="text-base font-semibold text-foreground sm:text-lg">Galerie</h1>
          <UserInfo />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
        <PhotoFilters onFiltersChange={setFilters} />

        {/* Error state with retry */}
        {error && (
          <div className="mb-4 sm:mb-6">
            <ErrorState message={error} onRetry={retry} isRetrying={loading} />
          </div>
        )}

        {/* Initial loading state */}
        {photos.length === 0 && !error && refreshing && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 sm:gap-4 sm:py-16">
            <Spinner className="text-[var(--ds-accent)]" />
            <p className="text-xs text-[var(--ds-text-muted)] sm:text-sm">
              Chargement des photos...
            </p>
            <ImageGridSkeleton count={6} />
          </div>
        )}

        {/* Empty state */}
        {photos.length === 0 && !error && !refreshing && !loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <svg
              className="h-12 w-12 text-[var(--ds-text-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-[var(--ds-text-muted)]">Aucune photo disponible</p>
            <p className="text-xs text-[var(--ds-text-muted)]">
              Essayez de modifier les filtres
            </p>
          </div>
        )}

        {/* Photo grid with infinite scroll */}
        {photos.length > 0 && (
          <InfiniteScroll
            sentinelRef={sentinelRef}
            loading={loading}
            hasMore={hasMore}
          >
            <ImageGrid
              photos={photos}
              isLiked={isLiked}
              onLikeToggle={toggleLike}
            />
          </InfiniteScroll>
        )}
      </main>
    </div>
  );
}
