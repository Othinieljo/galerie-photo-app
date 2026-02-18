"use client";

import { motion } from "framer-motion";

interface ImageCardSkeletonProps {
  index: number;
}

export function ImageCardSkeleton({ index }: ImageCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="aspect-[4/3] overflow-hidden rounded-[var(--ds-radius)] bg-[var(--ds-border)] shadow-[var(--ds-shadow-md)]"
    >
      <div className="relative h-full w-full">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[var(--ds-border)] via-[var(--ds-hover)] to-[var(--ds-border)] bg-[length:200%_100%]" />
      </div>
    </motion.div>
  );
}
