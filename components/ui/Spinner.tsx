import { motion } from "framer-motion";

export function Spinner({ className }: { className?: string }) {
  return (
    <motion.div
      role="status"
      aria-label="Chargement"
      className={`inline-block size-8 animate-spin rounded-full border-2 border-current border-t-transparent ${className ?? ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
  );
}
