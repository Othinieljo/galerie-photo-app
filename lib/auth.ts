/**
 * Authentication logic — hardcoded credentials per specs.
 * In production, replace with a proper auth provider (NextAuth, etc.).
 */

const USERS = [
  { username: "muser1", password: "mpassword1", status: "active" as const },
  { username: "muser2", password: "mpassword2", status: "active" as const },
  { username: "muser3", password: "mpassword3", status: "blocked" as const },
] as const;

export type AuthResult =
  | { success: true; username: string }
  | { success: false; error: "BLOCKED" | "INVALID" };

export function authenticate(
  username: string,
  password: string
): AuthResult {
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) return { success: false, error: "INVALID" };
  if (user.status === "blocked") return { success: false, error: "BLOCKED" };

  return { success: true, username: user.username };
}
