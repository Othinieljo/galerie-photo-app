"use client";

import { Spinner } from "@/components/ui/Spinner";
import { ImageGridSkeleton } from "./ImageGridSkeleton";

interface InfiniteScrollProps {
  sentinelRef: (node: HTMLDivElement | null) => void;
  loading: boolean;
  hasMore: boolean;
  children: React.ReactNode;
}

export function InfiniteScroll({
  sentinelRef,
  loading,
  hasMore,
  children,
}: InfiniteScrollProps) {
  return (
    <div className="flex flex-col gap-6">
      {children}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex min-h-[120px] flex-col items-center justify-center gap-4 py-8"
          aria-live="polite"
          aria-busy={loading}
        >
          {loading && (
            <>
              <Spinner className="text-[var(--ds-accent)]" />
              <p className="text-sm text-[var(--ds-text-muted)]">
                Chargement des photos...
              </p>
              <ImageGridSkeleton count={3} />
            </>
          )}
        </div>
      )}
      {!hasMore && (
        <div className="py-8 text-center">
          <p className="text-sm text-[var(--ds-text-muted)]">
            ✨ Toutes les photos ont été chargées
          </p>
        </div>
      )}
    </div>
  );
}
