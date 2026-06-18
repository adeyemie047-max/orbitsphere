import NextImage, { type ImageProps } from "next/image";

function isRemoteSrc(src: ImageProps["src"]): boolean {
  if (typeof src !== "string") return false;
  return src.startsWith("http://") || src.startsWith("https://");
}

/**
 * Editorial photos load from external CDNs (Unsplash, Cloudinary).
 * `unoptimized` bypasses Turbopack dev hostname checks while keeping layout props.
 */
export default function EditorialImage(props: ImageProps) {
  const remote = isRemoteSrc(props.src);

  return (
    <NextImage
      {...props}
      unoptimized={remote || props.unoptimized}
    />
  );
}
