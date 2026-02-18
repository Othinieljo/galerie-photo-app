"use client";

/**
 * LoginCard Component
 * 
 * Formulaire de connexion avec validation en temps réel, gestion d'erreurs,
 * et animations fluides. Implémente les scénarios d'authentification spécifiés :
 * - muser1/mpassword1 → Succès
 * - muser2/mpassword2 → Succès
 * - muser3/mpassword3 → Compte bloqué
 * - Autres → Identifiants invalides
 * 
 * @component
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MailIcon, GoogleIcon, AppleIcon, FacebookIcon } from "./icons/LoginIcons";
import { useAuthStore } from "@/store/authStore";
import styles from "./LoginCard.module.css";

/** Messages d'erreur traduits pour chaque type d'erreur d'authentification */
const ERROR_MESSAGES: Record<string, string> = {
  BLOCKED: "Ce compte a été bloqué.",
  INVALID: "Informations de connexion invalides.",
};

export function LoginCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  /**
   * Gère la soumission du formulaire de connexion
   * - Valide les champs (marque comme "touched")
   * - Appelle l'API d'authentification
   * - Gère les états de succès/erreur avec transitions
   * - Redirige vers /gallery après succès (délai 600ms pour UX)
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setTouched({ username: true, password: true });
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.username);
        setSuccess(true);
        setTimeout(() => router.push("/gallery"), 600);
      } else {
        const message =
          ERROR_MESSAGES[data.error as keyof typeof ERROR_MESSAGES] ??
          ERROR_MESSAGES.INVALID;
        setError(message);
        setLoading(false);
      }
    } catch {
      setError(ERROR_MESSAGES.INVALID);
      setLoading(false);
    }
  };

  // États dérivés pour la validation visuelle des champs
  const hasError = Boolean(error);
  const showUsernameInvalid = (touched.username && !username.trim()) || hasError;
  const showPasswordInvalid = (touched.password && !password) || hasError;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <h1 className={styles.heading}>Connexion à votre compte</h1>
      <p className={styles.subheading}>
        Saisissez vos identifiants pour vous connecter
        <br />
        à votre compte
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.fields}>
          <div
            className={`${styles.fieldWrap} ${showUsernameInvalid ? styles.fieldWrapInvalid : ""}`}
          >
            <input
              type="text"
              placeholder="Adresse e-mail ou identifiant"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(null);
              }}
              onBlur={() => setTouched((t) => ({ ...t, username: true }))}
              required
              autoComplete="username"
              disabled={loading || success}
              aria-invalid={showUsernameInvalid || hasError}
              aria-describedby={error ? "login-error" : undefined}
            />
            <span className={styles.fieldIcon}>
              <MailIcon />
            </span>
          </div>

          <div
            className={`${styles.fieldWrap} ${showPasswordInvalid ? styles.fieldWrapInvalid : ""}`}
          >
            <input
              type={showPass ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              required
              autoComplete="current-password"
              disabled={loading || success}
              style={{ paddingRight: "56px" }}
              aria-invalid={showPasswordInvalid || hasError}
            />
            <button
              type="button"
              className={styles.showBtn}
              onClick={() => setShowPass((s) => !s)}
              tabIndex={-1}
              aria-label={showPass ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPass ? "Masquer" : "Afficher"}
            </button>
          </div>
        </div>

        <a
          href="#"
          className={styles.trouble}
          onClick={(e) => e.preventDefault()}
        >
          Problème pour vous connecter ?
        </a>

        <AnimatePresence mode="wait">
          {success && (
            <motion.div
              key="success"
              id="login-success"
              className={styles.successMsg}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              Connexion réussie, redirection…
            </motion.div>
          )}
          {error && (
            <motion.div
              key="error"
              id="login-error"
              className={styles.errorMsg}
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          className={styles.signinBtn}
          disabled={loading || success}
          whileHover={!loading && !success ? { scale: 1.01 } : undefined}
          whileTap={!loading && !success ? { scale: 0.99 } : undefined}
        >
          {loading ? "Connexion…" : success ? "Redirection…" : "Se connecter"}
        </motion.button>
      </form>

      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>— Ou se connecter avec —</span>
        <span className={styles.dividerLine} />
      </div>

      <div className={styles.socialGrid}>
        <button type="button" className={styles.socialBtn}>
          <GoogleIcon /> Google
        </button>
        <button type="button" className={styles.socialBtn}>
          <AppleIcon /> Apple ID
        </button>
        <button type="button" className={styles.socialBtn}>
          <FacebookIcon /> Facebook
        </button>
      </div>

      <p className={styles.footerText}>
        Pas encore inscrit ?{" "}
        <a href="#" onClick={(e) => e.preventDefault()}>
          Créer un compte
        </a>
      </p>
    </motion.div>
  );
}
