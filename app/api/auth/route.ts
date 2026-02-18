/**
 * API Route: POST /api/auth
 * 
 * Endpoint d'authentification. Valide les credentials et crée une session.
 * 
 * Body attendu :
 * - username: string
 * - password: string
 * 
 * Réponses :
 * - 200: { success: true, username: string } + Cookie session_user
 * - 400: { success: false, error: "INVALID" } - Requête invalide
 * - 401: { success: false, error: "INVALID" } - Identifiants invalides
 * - 403: { success: false, error: "BLOCKED" } - Compte bloqué
 * 
 * Cookie créé : session_user (HTTP-only, 24h, SameSite: lax)
 */

import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";

export async function POST(req: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID" },
      { status: 400 }
    );
  }

  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json(
      { success: false, error: "INVALID" },
      { status: 400 }
    );
  }

  const result = authenticate(username, password);

  if (result.success) {
    const response = NextResponse.json({
      success: true,
      username: result.username,
    });
    response.cookies.set("session_user", result.username, {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 24h
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.json(
    { success: false, error: result.error },
    {
      status: result.error === "BLOCKED" ? 403 : 401,
    }
  );
}
