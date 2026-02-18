import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/**
 * Home: redirige vers /gallery si connecté, sinon vers /login
 */
export default async function HomePage() {
  const cookieStore = await cookies();
  const user = cookieStore.get("session_user")?.value;
  if (user) redirect("/gallery");
  redirect("/login");
}
