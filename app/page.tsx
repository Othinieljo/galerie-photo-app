import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/**
 * Home: redirect to /gallery if logged in, else /login
 */
export default async function HomePage() {
  const cookieStore = await cookies();
  const user = cookieStore.get("session_user")?.value;
  if (user) redirect("/gallery");
  redirect("/login");
}
