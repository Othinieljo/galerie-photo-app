"use client";

/**
 * useLikes Hook
 * 
 * Hook personnalisé pour gérer les likes avec mise à jour optimiste :
 * - Charge les likes initiaux depuis l'API au mount
 * - Mise à jour optimiste immédiate (UX fluide)
 * - Synchronisation avec l'API en arrière-plan
 * - Rollback automatique en cas d'erreur réseau
 * 
 * Utilise un Set<string> pour O(1) lookup des IDs likés.
 * 
 * @returns État et fonctions pour gérer les likes
 */

import { useState, useCallback, useEffect } from "react";

export function useLikes() {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchLikes = useCallback(async () => {
    try {
      const res = await fetch("/api/likes", { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setLikedIds(new Set((data.likes as string[]) ?? []));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  /**
   * Toggle le like d'une image avec mise à jour optimiste
   * 1. Met à jour l'état local immédiatement (optimistic update)
   * 2. Synchronise avec l'API en arrière-plan
   * 3. En cas d'erreur, rollback vers l'état précédent
   * 
   * @param imageId - ID de l'image à liker/unliker
   * @returns Nouvel état du like (true = liké, false = unliké)
   */
  const toggleLike = useCallback(async (imageId: string): Promise<boolean> => {
    const currentlyLiked = likedIds.has(imageId);
    
    // Mise à jour optimiste : changement immédiat pour UX fluide
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (currentlyLiked) next.delete(imageId);
      else next.add(imageId);
      return next;
    });

    try {
      // Synchronisation avec l'API
      const res = await fetch(`/api/likes/${imageId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      const newLiked = Boolean(data.liked);
      
      // Mise à jour finale basée sur la réponse serveur (source de vérité)
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (newLiked) next.add(imageId);
        else next.delete(imageId);
        return next;
      });
      return newLiked;
    } catch {
      // Rollback en cas d'erreur réseau : restaure l'état précédent
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (currentlyLiked) next.add(imageId);
        else next.delete(imageId);
        return next;
      });
      return currentlyLiked;
    }
  }, [likedIds]);

  const isLiked = useCallback(
    (imageId: string) => likedIds.has(imageId),
    [likedIds]
  );

  return { likedIds, isLiked, toggleLike, loading };
}
