/**
 * LoginDecorations Component
 * 
 * Affiche uniquement l'icône de chat en bas à droite.
 * L'image de fond est gérée directement dans le CSS de la page.
 */
import { ChatBubbleIcon } from "../icons/LoginIcons";
import styles from "./LoginDecorations.module.css";

export function LoginDecorations() {
  return (
    <div className={styles.decoChat}>
      <ChatBubbleIcon />
    </div>
  );
}
