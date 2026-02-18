/**
 * API Route: POST /api/likes/[imageId]
 * 
 * Toggle le like d'une image pour l'utilisateur connecté.
 * 
 * Authentification requise : Cookie session_user
 * 
 * @param imageId - ID de l'image à liker/unliker (dans l'URL)
 * @returns { liked: boolean } - Nouvel état du like
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 400 si imageId est manquant
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, likes } from "@/lib/db";

type RouteContext = { params: Promise<{ imageId: string }> };

export async function POST(_req: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const username = cookieStore.get("session_user")?.value;

  if (!username) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { imageId } = await context.params;
  if (!imageId) {
    return NextResponse.json(
      { error: "imageId manquant" },
      { status: 400 }
    );
  }

  const liked = await likes.toggle(username, imageId);
  return NextResponse.json({ liked });
}

/**
 * API Route: DELETE /api/likes/[imageId]
 * 
 * Supprime le like d'une image pour l'utilisateur connecté.
 * 
 * Authentification requise : Cookie session_user
 * 
 * @param imageId - ID de l'image à unliker (dans l'URL)
 * @returns { liked: false }
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 400 si imageId est manquant
 */
export async function DELETE(_req: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const username = cookieStore.get("session_user")?.value;

  if (!username) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { imageId } = await context.params;
  if (!imageId) {
    return NextResponse.json(
      { error: "imageId manquant" },
      { status: 400 }
    );
  }

  const key = likes.key(username, imageId);
  try {
    await db.del(key);
  } catch {
    // Already not liked
  }
  return NextResponse.json({ liked: false });
}
