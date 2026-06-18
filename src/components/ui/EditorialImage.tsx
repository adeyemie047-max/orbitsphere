import NextImage, { type ImageProps } from "next/image";
import { isCloudinaryUrl, optimizeCloudinaryUrl } from "@/lib/cloudinary-url";

function isRemoteSrc(src: ImageProps["src"]): boolean {
  if (typeof src !== "string") return false;
  return src.startsWith("http://") || src.startsWith("https://");
}

function resolveSrc(src: ImageProps["src"], width?: number): ImageProps["src"] {
  if (typeof src !== "string" || !isCloudinaryUrl(src)) return src;
  return optimizeCloudinaryUrl(src, { width: width ?? 1200, crop: "limit" });
}

/**
 * Editorial photos load from external CDNs (Unsplash, Cloudinary).
 * Cloudinary URLs get f_auto,q_auto transforms for bandwidth savings.
 */
export default function EditorialImage({ src, ...props }: ImageProps) {
  const remote = isRemoteSrc(src);
  const resolvedSrc = resolveSrc(src, typeof props.width === "number" ? props.width : undefined);

  return (
    <NextImage
      {...props}
      src={resolvedSrc}
      unoptimized={remote || props.unoptimized}
    />
  );
}
