"use client";

/**
 * useInfinitePhotos Hook
 * 
 * Hook personnalisé pour gérer le chargement infini de photos Unsplash avec :
 * - Infinite scrolling via IntersectionObserver
 * - Gestion des filtres (ordre, couleur, orientation)
 * - Retry automatique en cas d'erreur réseau (backoff exponentiel)
 * - Prévention des memory leaks (AbortController, cleanup)
 * - Prévention des stale closures (useRef pour valeurs mutables)
 * - États distincts : loading (chargement page suivante) vs refreshing (chargement initial)
 * 
 * @param filters - Filtres de recherche (optionnel)
 * @returns État et fonctions pour gérer le chargement infini
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { UnsplashPhoto, UnsplashListResponse } from "@/types";
import type { FilterOrderBy, FilterColor, FilterOrientation } from "@/components/gallery/PhotoFilters";

interface Filters {
  orderBy: FilterOrderBy;
  color: FilterColor;
  orientation: FilterOrientation;
}

/** Délai initial entre les tentatives de retry (ms) */
const RETRY_DELAY_MS = 2000;
/** Nombre maximum de tentatives de retry automatique */
const MAX_RETRIES = 3;

export function useInfinitePhotos(filters?: Filters) {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs pour éviter les stale closures et prévenir les memory leaks
  // Ces valeurs ne déclenchent pas de re-render mais restent à jour
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef(false); // Évite les double-fetch
  const hasMoreRef = useRef(true); // Évite les requêtes inutiles
  const filtersRef = useRef<Filters | undefined>(filters); // Filtres actuels sans dépendance
  const mountedRef = useRef(true); // Vérifie si le composant est monté avant setState
  const retryCountRef = useRef(0); // Compteur de retry pour backoff exponentiel
  const abortControllerRef = useRef<AbortController | null>(null); // Annulation des requêtes obsolètes

  // Update filters ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Sync refs with state
  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchPhotos = useCallback(async (pageNum: number, isRetry = false) => {
    // Prevent double-fetching
    if (loadingRef.current || !hasMoreRef.current) return;
    
    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const isInitialLoad = pageNum === 1 && !isRetry;
    
    if (isInitialLoad) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);
    
    try {
      const currentFilters = filtersRef.current;
      const params = new URLSearchParams({
        page: pageNum.toString(),
        per_page: "20",
      });

      if (currentFilters) {
        params.set("orderBy", currentFilters.orderBy);
        params.set("color", currentFilters.color);
        params.set("orientation", currentFilters.orientation);
      }

      const res = await fetch(`/api/unsplash?${params.toString()}`, { signal });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur HTTP ${res.status}`);
      }
      
      const data: UnsplashListResponse = await res.json();
      
      // Check if component is still mounted
      if (!mountedRef.current) return;
      
      // Parse response: Unsplash API returns { results: [...] } or array
      let list: UnsplashPhoto[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data && typeof data === "object" && "results" in data) {
        list = Array.isArray(data.results) ? data.results : [];
      }
      
      if (list.length === 0) {
        setHasMore(false);
        hasMoreRef.current = false;
        if (isInitialLoad) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
        loadingRef.current = false;
        retryCountRef.current = 0;
        return;
      }
      
      setPhotos((prev) => {
        // Avoid duplicates using Set for O(1) lookup
        const existingIds = new Set(prev.map((p) => p.id));
        const newPhotos = list.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newPhotos];
      });
      
      // Determine if there's more data
      const hasMoreData = list.length >= 20;
      setHasMore(hasMoreData);
      hasMoreRef.current = hasMoreData;
      
      // Reset retry count on success
      retryCountRef.current = 0;
    } catch (e) {
      // Don't handle abort errors
      if (signal.aborted || !mountedRef.current) return;
      
      const message = e instanceof Error ? e.message : "Erreur de chargement";
      setError(message);
      console.error("Error fetching photos:", e);
      
      // Auto-retry logic for network errors
      if (!isRetry && retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current += 1;
        setTimeout(() => {
          if (mountedRef.current && hasMoreRef.current) {
            fetchPhotos(pageNum, true);
          }
        }, RETRY_DELAY_MS * retryCountRef.current);
      } else {
        retryCountRef.current = 0;
      }
    } finally {
      if (mountedRef.current) {
        if (isInitialLoad) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
        loadingRef.current = false;
      }
    }
  }, []);

  const retry = useCallback(() => {
    retryCountRef.current = 0;
    setError(null);
    if (page === 1) {
      fetchPhotos(1);
    } else {
      setPage(1);
      setPhotos([]);
      setHasMore(true);
      hasMoreRef.current = true;
      fetchPhotos(1);
    }
  }, [page, fetchPhotos]);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      
      // Don't observe if already loading or no more data
      if (loadingRef.current || !hasMoreRef.current || !node) return;
      
      // Create new observer with optimized config
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (
            entry?.isIntersecting &&
            hasMoreRef.current &&
            !loadingRef.current &&
            mountedRef.current
          ) {
            setPage((prevPage) => {
              const nextPage = prevPage + 1;
              fetchPhotos(nextPage);
              return nextPage;
            });
          }
        },
        {
          rootMargin: "200px", // Start loading earlier for smoother UX
          threshold: 0.1, // Trigger when 10% visible
        }
      );
      
      observerRef.current.observe(node);
    },
    [fetchPhotos]
  );

  // Reset and fetch when filters change
  useEffect(() => {
    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setPhotos([]);
    setPage(1);
    setHasMore(true);
    hasMoreRef.current = true;
    loadingRef.current = false;
    retryCountRef.current = 0;
    setError(null);
    
    // Small delay to ensure cleanup is complete
    const timeoutId = setTimeout(() => {
      if (mountedRef.current && !loadingRef.current) {
        fetchPhotos(1);
      }
    }, 0);
    
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.orderBy, filters?.color, filters?.orientation]);

  return { photos, loading, refreshing, error, hasMore, sentinelRef, retry };
}
