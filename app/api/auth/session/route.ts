/**
 * API Route: GET /api/auth/session
 * 
 * Vérifie la session actuelle et retourne l'utilisateur connecté.
 * Utilisé par AuthProvider pour hydrater le store Zustand côté client.
 * 
 * @returns { user: string | null } - Username si connecté, null sinon
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const username = cookieStore.get("session_user")?.value;
  return NextResponse.json({ user: username ?? null });
}
