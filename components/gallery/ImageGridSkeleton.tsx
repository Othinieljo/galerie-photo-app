"use client";

import { ImageCardSkeleton } from "./ImageCardSkeleton";

export function ImageGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ImageCardSkeleton key={`skeleton-${index}`} index={index} />
      ))}
    </div>
  );
}
