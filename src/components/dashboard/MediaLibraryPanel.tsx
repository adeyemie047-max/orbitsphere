"use client";

import { useCallback, useEffect, useState } from "react";
import EditorialImage from "@/components/ui/EditorialImage";

type MediaItem = {
  url: string;
  source: "upload" | "article" | "cloudinary";
  label?: string;
};

export default function MediaLibraryPanel() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [cloudinaryConfigured, setCloudinaryConfigured] = useState(true);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/v1/admin/media?limit=60");
    if (res.ok) {
      const json = await res.json();
      setItems(json.data ?? []);
      setCloudinaryConfigured(json.cloudinaryConfigured !== false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchMedia();
  }, [fetchMedia]);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "orbitsphere/media");
    const res = await fetch("/api/v1/admin/upload", { method: "POST", body: form });
    if (res.ok) {
      await fetchMedia();
    } else {
      const json = await res.json();
      alert(json.error ?? "Upload failed");
    }
    setUploading(false);
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-text-muted text-sm">
            Upload images for articles and branding. Click an item to copy its URL.
          </p>
          {!cloudinaryConfigured && (
            <p className="text-amber-400/90 text-xs mt-1">
              Cloudinary is not configured — uploads save locally and will not persist on Vercel.
              Set CLOUDINARY_* env vars in production.
            </p>
          )}
        </div>
        <label className="cursor-pointer inline-flex items-center justify-center font-[family-name:var(--font-ui)] text-xs font-semibold px-4 py-2 rounded-md bg-gold text-ink hover:bg-gold/90 transition-all">
          {uploading ? "Uploading…" : "+ Upload image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={upload}
            disabled={uploading}
          />
        </label>
      </div>

      {loading ? (
        <p className="text-text-muted text-sm">Loading media…</p>
      ) : items.length === 0 ? (
        <div className="p-8 bg-surface border border-white/6 rounded-[14px] text-center">
          <p className="text-text-secondary text-sm">
            No media yet. Upload your first image above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <button
              key={item.url}
              type="button"
              onClick={() => void copyUrl(item.url)}
              className="group text-left bg-surface border border-white/6 rounded-[14px] overflow-hidden hover:border-gold/30 transition-colors"
            >
              <div className="aspect-[4/3] relative bg-white/5">
                <EditorialImage
                  src={item.url}
                  alt={item.label ?? "Media"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2">
                <p className="text-[10px] uppercase tracking-wider text-text-muted">
                  {item.source}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {copied === item.url ? "Copied!" : item.label ?? "Click to copy URL"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
