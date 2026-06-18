import { readdir, stat } from "fs/promises";
import path from "path";
import { listBlobAssets, isBlobStorageConfigured } from "@/lib/blob-storage";
import { db } from "@/lib/db";
import { getCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export type MediaAsset = {
  url: string;
  source: "upload" | "article" | "cloudinary" | "blob";
  label?: string;
};

async function listCloudinaryAssets(limit: number): Promise<MediaAsset[]> {
  if (!isCloudinaryConfigured()) return [];

  try {
    const cld = getCloudinary();
    const result = await cld.api.resources({
      type: "upload",
      prefix: "orbitsphere",
      max_results: Math.min(limit, 100),
    });

    return (result.resources ?? []).map(
      (resource: { secure_url: string; public_id: string }) => ({
        url: resource.secure_url,
        source: "cloudinary" as const,
        label: resource.public_id.split("/").pop(),
      })
    );
  } catch {
    return [];
  }
}

async function walkUploadDir(relativeDir: string, siteOrigin: string): Promise<MediaAsset[]> {
  const fullDir = path.join(process.cwd(), "public", "uploads", relativeDir);
  let entries: string[];
  try {
    entries = await readdir(fullDir);
  } catch {
    return [];
  }

  const results: MediaAsset[] = [];
  for (const entry of entries) {
    const childRel = relativeDir ? `${relativeDir}/${entry}` : entry;
    const fullPath = path.join(fullDir, entry);
    const info = await stat(fullPath);
    if (info.isDirectory()) {
      results.push(...(await walkUploadDir(childRel, siteOrigin)));
    } else if (/\.(jpe?g|png|webp|gif|svg)$/i.test(entry)) {
      results.push({
        url: `${siteOrigin}/uploads/${childRel.replace(/\\/g, "/")}`,
        source: "upload",
        label: entry,
      });
    }
  }
  return results;
}

export async function listMediaAssets(options: {
  limit: number;
  siteOrigin: string;
}): Promise<{
  assets: MediaAsset[];
  cloudinaryConfigured: boolean;
  blobConfigured: boolean;
}> {
  const origin = options.siteOrigin.replace(/\/$/, "");
  const cloudinaryConfigured = isCloudinaryConfigured();
  const blobConfigured = isBlobStorageConfigured();

  const [cloudinaryAssets, blobAssets, uploads] = await Promise.all([
    listCloudinaryAssets(options.limit),
    listBlobAssets({ limit: options.limit }).then((items) =>
      items.map((item) => ({
        url: item.url,
        source: "blob" as const,
        label: item.pathname.split("/").pop(),
      }))
    ),
    walkUploadDir("", origin),
  ]);

  let articleImages: MediaAsset[] = [];
  try {
    const rows = await db.article.findMany({
      where: { featuredImage: { not: null } },
      select: { featuredImage: true, title: true },
      orderBy: { updatedAt: "desc" },
      take: options.limit,
    });
    articleImages = rows
      .filter((r) => r.featuredImage)
      .map((r) => ({
        url: r.featuredImage!,
        source: "article" as const,
        label: r.title.slice(0, 60),
      }));
  } catch {
    // DB optional in dev
  }

  const seen = new Set<string>();
  const merged: MediaAsset[] = [];
  for (const item of [
    ...cloudinaryAssets,
    ...blobAssets,
    ...uploads.reverse(),
    ...articleImages,
  ]) {
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    merged.push(item);
    if (merged.length >= options.limit) break;
  }

  return { assets: merged, cloudinaryConfigured, blobConfigured };
}
