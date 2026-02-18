/**
 * API Route: /api/unsplash
 * 
 * Proxy vers l'API Unsplash avec cache mémoire pour optimiser les performances
 * et respecter les limites de taux (50 req/h en mode demo).
 * 
 * Paramètres de requête :
 * - page: Numéro de page (défaut: 1)
 * - per_page: Nombre de résultats par page (défaut: 20)
 * - orderBy: Ordre de tri (latest, oldest, popular, views)
 * - color: Filtre par couleur (all, black, white, yellow, etc.)
 * - orientation: Filtre par orientation (all, landscape, portrait, squarish)
 * 
 * Cache : TTL de 1 minute pour équilibrer fraîcheur et performance
 */

import { NextResponse } from "next/server";
import { OrderBy } from "unsplash-js";
import { unsplash } from "@/lib/unsplash";

/** Cache mémoire qui réduit les appels API (rate limit Unsplash: 50/h en demo) */
const listCache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

/**
 * Récupère une entrée du cache si elle existe et n'est pas expirée
 * @returns Les données en cache ou null si absentes/expirées
 */
function getCached<T>(key: string): T | null {
  const entry = listCache.get(key);
  if (!entry || Date.now() - entry.ts > CACHE_TTL_MS) return null;
  return entry.data as T;
}

/**
 * Stocke une entrée dans le cache avec timestamp actuel
 */
function setCache(key: string, data: unknown): void {
  listCache.set(key, { data, ts: Date.now() });
}

export async function GET(req: Request) {
  try {
    // Extraction et validation des paramètres de requête
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const perPage = Number(searchParams.get("per_page") ?? 20);
    const orderByParam = searchParams.get("orderBy") ?? "latest";
    const colorParam = searchParams.get("color") ?? "all";
    const orientationParam = searchParams.get("orientation") ?? "all";

    // Mapping des valeurs orderBy vers l'enum Unsplash OrderBy
    const orderByMap: Record<string, OrderBy> = {
      latest: OrderBy.LATEST,
      oldest: OrderBy.OLDEST,
      popular: OrderBy.POPULAR,
      views: OrderBy.POPULAR, // Views maps to popular in Unsplash
    };

    const orderBy = orderByMap[orderByParam] ?? OrderBy.LATEST;

    // Build cache key with filters
    const cacheKey = `list:${page}:${perPage}:${orderByParam}:${colorParam}:${orientationParam}`;
    const cached = getCached<unknown>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Build query params
    const queryParams: Parameters<typeof unsplash.photos.list>[0] = {
      page,
      perPage,
      orderBy,
    };

    

    const result = await unsplash.photos.list(queryParams);

    if (result.errors) {
      console.error("Unsplash API errors:", result.errors);
      return NextResponse.json(
        { error: result.errors[0] || "Erreur API Unsplash" },
        { status: 500 }
      );
    }

    if (!result.response) {
      return NextResponse.json(
        { error: "Réponse vide de l'API Unsplash" },
        { status: 500 }
      );
    }

    // L'API Unsplash retourne { results: UnsplashPhoto[], total: number, ... }
    const response = {
      results: result.response.results || [],
      total: result.response.total || 0,
    };

    setCache(cacheKey, response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in /api/unsplash:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}
