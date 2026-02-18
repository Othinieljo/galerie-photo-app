/**
 * API Route: GET /api/auth/logout
 * 
 * Déconnecte l'utilisateur en supprimant le cookie de session
 * et redirige vers la page de login.
 * 
 * Cookie supprimé : session_user (maxAge: 0)
 * Redirection : /login
 */

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? req.headers.get("origin") ?? "http://localhost:3000";
  const response = NextResponse.redirect(new URL("/login", baseUrl));
  response.cookies.set("session_user", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
