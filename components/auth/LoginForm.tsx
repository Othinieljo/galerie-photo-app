"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

const ERROR_MESSAGES: Record<string, string> = {
  BLOCKED: "Ce compte a été bloqué.",
  INVALID: "Informations de connexion invalides.",
};

function MailIcon() {
  return (
    <svg className="size-5 text-[var(--ds-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="size-5 text-[var(--ds-text)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="size-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.username);
        router.push("/gallery");
      } else {
        setError(ERROR_MESSAGES[data.error as keyof typeof ERROR_MESSAGES] ?? ERROR_MESSAGES.INVALID);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col gap-5"
    >
      <div>
        <h1 className="text-xl font-bold text-[var(--ds-text)]">Connexion à votre compte</h1>
        <p className="mt-1 text-sm text-[var(--ds-text-muted)]">
          Saisissez vos identifiants pour vous connecter à votre compte
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Adresse e-mail ou identifiant"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-[var(--ds-border)] bg-[var(--ds-input-bg)] py-3 pl-4 pr-11 text-[var(--ds-text)] placeholder:text-[var(--ds-text-muted)] focus:border-[var(--ds-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--ds-accent)]"
            required
            autoComplete="username"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <MailIcon />
          </span>
        </div>

        <div className="relative">
          <input
            type={showPasscode ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--ds-border)] bg-[var(--ds-input-bg)] py-3 pl-4 pr-16 text-[var(--ds-text)] placeholder:text-[var(--ds-text-muted)] focus:border-[var(--ds-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--ds-accent)]"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPasscode((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--ds-text-muted)] hover:text-[var(--ds-text)]"
          >
            {showPasscode ? "Masquer" : "Afficher"}
          </button>
        </div>
      </div>

      <Link
        href="#"
        className="text-sm text-[var(--ds-text)] hover:underline"
        onClick={(e) => e.preventDefault()}
      >
        Problème pour vous connecter ?
      </Link>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg bg-[var(--ds-error-bg)] px-3 py-2 text-sm text-[var(--ds-error)] border border-[var(--ds-error-border)]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileTap={{ scale: 0.98 }}
        className="w-full rounded-xl py-3.5 font-semibold text-white transition-colors disabled:opacity-60"
        style={{ backgroundColor: "var(--ds-accent)" }}
      >
        {isLoading ? "Connexion…" : "Se connecter"}
      </motion.button>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-[var(--ds-border)]" />
        <span className="text-sm font-medium text-[var(--ds-text-muted)]">— Ou se connecter avec —</span>
        <span className="h-px flex-1 bg-[var(--ds-border)]" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-input-bg)] py-3 text-sm font-medium text-[var(--ds-text)] transition-colors hover:bg-[var(--ds-hover)]"
        >
          <GoogleIcon /> Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-input-bg)] py-3 text-sm font-medium text-[var(--ds-text)] transition-colors hover:bg-[var(--ds-hover)]"
        >
          <AppleIcon /> Apple ID
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-input-bg)] py-3 text-sm font-medium text-[var(--ds-text)] transition-colors hover:bg-[var(--ds-hover)]"
        >
          <FacebookIcon /> Facebook
        </button>
      </div>

      <p className="text-center text-sm text-[var(--ds-text-muted)]">
        Pas encore inscrit ?{" "}
        <Link href="#" className="font-medium text-[var(--ds-accent)] hover:underline">
          Créer un compte
        </Link>
      </p>
    </motion.form>
  );
}
