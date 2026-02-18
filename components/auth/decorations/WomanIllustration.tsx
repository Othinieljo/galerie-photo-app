import Image from "next/image";

/**
 * WomanIllustration Component
 * 
 * Affiche l'illustration de fond de la page de login.
 * Remplace l'ancien SVG par une image PNG optimisée avec Next.js Image.
 */
export function WomanIllustration() {
  return (
    <Image
      src="/images/login/bg-image.png"
      alt=""
      width={320}
      height={310}
      className="w-full h-auto"
      priority
      aria-hidden
    />
  );
}
