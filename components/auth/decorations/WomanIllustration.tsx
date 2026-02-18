import Image from "next/image";

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
