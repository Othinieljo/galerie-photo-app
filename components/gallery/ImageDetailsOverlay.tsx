"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { UnsplashPhoto } from "@/types";

interface ImageDetailsOverlayProps {
  photo: UnsplashPhoto;
  isVisible: boolean;
}

export function ImageDetailsOverlay({ photo, isVisible }: ImageDetailsOverlayProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return null;
    }
  };

  const formatNumber = (num?: number) => {
    if (!num) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-10 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 pointer-events-none sm:p-4"
        >
          {/* Top section - User info */}
          {photo.user && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              {photo.user.profile_image?.small && (
                <img
                  src={photo.user.profile_image.small}
                  alt={photo.user.name}
                  className="h-6 w-6 flex-shrink-0 rounded-full border-2 border-white/20 sm:h-8 sm:w-8"
                />
              )}
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-semibold text-white sm:text-sm">
                  {photo.user.name}
                </span>
                {photo.user.username && (
                  <span className="truncate text-[10px] text-white/70 sm:text-xs">
                    @{photo.user.username}
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* Bottom section - Stats and description */}
          <div className="space-y-2 sm:space-y-3">
            {/* Description */}
            {(photo.description || photo.alt_description) && (
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="line-clamp-2 text-xs text-white sm:text-sm"
              >
                {photo.description || photo.alt_description}
              </motion.p>
            )}

            {/* Stats */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-2 text-[10px] text-white/80 sm:gap-4 sm:text-xs"
            >
              {photo.downloads !== undefined && (
                <div className="flex items-center gap-1.5">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>{formatNumber(photo.downloads)}</span>
                </div>
              )}
              {photo.views !== undefined && (
                <div className="flex items-center gap-1.5">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>{formatNumber(photo.views)}</span>
                </div>
              )}
              {photo.created_at && (
                <div className="ml-auto hidden text-white/60 sm:block">
                  {formatDate(photo.created_at)}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
