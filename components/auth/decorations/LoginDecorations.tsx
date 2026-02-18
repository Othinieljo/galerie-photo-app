
import { ChatBubbleIcon } from "../icons/LoginIcons";
import styles from "./LoginDecorations.module.css";

export function LoginDecorations() {
  return (
    <div className={styles.decoChat}>
      <ChatBubbleIcon />
    </div>
  );
}
