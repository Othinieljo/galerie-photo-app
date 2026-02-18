/**
 * Unsplash API client (server-side only).
 * Used by API routes; never expose access key to the client.
 * Uses global fetch (Node 18+ / Next.js).
 */
import { createApi } from "unsplash-js";

const accessKey = process.env.UNSPLASH_ACCESS_KEY;
if (!accessKey) {
  console.warn("UNSPLASH_ACCESS_KEY is not set — Unsplash API will fail.");
}

export const unsplash = createApi({
  accessKey: accessKey ?? "",
});
