"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function UserInfo() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/session", { credentials: "include" });
        const data = await res.json();
        setUsername(data.user);
      } catch {
        setUsername(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--ds-border)]" />
        <div className="h-4 w-20 animate-pulse rounded bg-[var(--ds-border)]" />
      </div>
    );
  }

  if (!username) {
    return null;
  }

  const initials = username
    .split("")
    .filter((char) => /[a-zA-Z0-9]/.test(char))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-3">
      <div className="flex items-center gap-1 rounded-[var(--ds-radius)] bg-[var(--ds-hover)] px-2 py-1 sm:gap-2 sm:px-3 sm:py-1.5">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--ds-accent)] text-[10px] font-semibold text-white sm:h-8 sm:w-8 sm:text-xs">
          {initials}
        </div>
        <span className="hidden text-xs font-medium text-[var(--ds-text)] sm:inline sm:text-sm">
          {username}
        </span>
      </div>
      <Link
        href="/api/auth/logout"
        className="whitespace-nowrap rounded-[var(--ds-radius)] px-2 py-1 text-[11px] text-[var(--ds-text-muted)] transition-colors hover:bg-[var(--ds-hover)] hover:text-foreground sm:px-3 sm:py-1.5 sm:text-sm"
      >
        <span className="hidden sm:inline">Déconnexion</span>
        <span className="sm:hidden">Déco</span>
      </Link>
    </div>
  );
}
