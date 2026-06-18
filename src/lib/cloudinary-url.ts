const CLOUDINARY_HOST = "res.cloudinary.com";

export function isCloudinaryUrl(url: string): boolean {
  try {
    return new URL(url).hostname === CLOUDINARY_HOST;
  } catch {
    return false;
  }
}

/** Apply auto format/quality and optional width to an existing Cloudinary URL. */
export function optimizeCloudinaryUrl(
  url: string,
  options: { width?: number; height?: number; crop?: "fill" | "limit" | "scale" } = {}
): string {
  if (!isCloudinaryUrl(url)) return url;

  const uploadMarker = "/upload/";
  const idx = url.indexOf(uploadMarker);
  if (idx === -1) return url;

  const transforms: string[] = ["f_auto", "q_auto"];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);

  const prefix = url.slice(0, idx + uploadMarker.length);
  const suffix = url.slice(idx + uploadMarker.length);

  // Skip if transforms already present (e.g. f_auto,q_auto/...)
  if (/^[a-z]_/.test(suffix.split("/")[0] ?? "")) {
    return url;
  }

  return `${prefix}${transforms.join(",")}/${suffix}`;
}

export function getPublicCloudName(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ??
    process.env.CLOUDINARY_CLOUD_NAME
  );
}
