import { list, put } from "@vercel/blob";

export function isBlobStorageConfigured(): boolean {
  return !!(
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.VERCEL_OIDC_TOKEN
  );
}

export async function uploadToBlob(
  buffer: Buffer,
  filename: string,
  folder = "orbitsphere/articles"
): Promise<{ url: string; pathname: string }> {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  const pathname = `${folder}/${Date.now()}-${safeName}`;

  const blob = await put(pathname, buffer, {
    access: "public",
    addRandomSuffix: false,
    contentType: guessContentType(safeName),
  });

  return { url: blob.url, pathname: blob.pathname };
}

export async function listBlobAssets(options: {
  limit: number;
  prefix?: string;
}): Promise<Array<{ url: string; pathname: string }>> {
  if (!isBlobStorageConfigured()) return [];

  try {
    const result = await list({
      prefix: options.prefix ?? "orbitsphere/",
      limit: options.limit,
    });

    return result.blobs.map((blob) => ({
      url: blob.url,
      pathname: blob.pathname,
    }));
  } catch {
    return [];
  }
}

function guessContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}
