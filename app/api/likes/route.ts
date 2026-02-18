/**
 * API Route: GET /api/likes
 * 
 * Retourne la liste des IDs d'images likées par l'utilisateur connecté.
 * 
 * Authentification requise : Cookie session_user
 * 
 * @returns { likes: string[] } - Liste des IDs d'images likées
 * @throws 401 si l'utilisateur n'est pas authentifié
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { likes } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const username = cookieStore.get("session_user")?.value;

  if (!username) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const imageIds = await likes.getUserLikes(username);
  return NextResponse.json({ likes: imageIds });
}
