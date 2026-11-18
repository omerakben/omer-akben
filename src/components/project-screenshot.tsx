import Image from "next/image";

interface ProjectScreenshotProps {
  src: string;
}

/**
 * Screenshot layer for a project card header. Loaded on demand so cards that
 * are never hovered or focused cost no image code or image bytes.
 */
export default function ProjectScreenshot({ src }: ProjectScreenshotProps) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      fill
      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
      className="object-cover object-top opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100"
    />
  );
}
