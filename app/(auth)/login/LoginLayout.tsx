import { LoginDecorations } from "@/components/auth/decorations/LoginDecorations";
import { LoginCard } from "@/components/auth/LoginCard";
import styles from "./login.module.css";

export function LoginLayout() {
  return (
    <div className={styles.page}>
      <header className={styles.logo}>Logo</header>

      <LoginDecorations />

      <main className={styles.main}>
        <LoginCard />
      </main>
    </div>
  );
}
