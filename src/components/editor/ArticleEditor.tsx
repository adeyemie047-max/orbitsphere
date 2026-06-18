"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@prisma/client";
import type { EditorArticle } from "@/lib/articles-admin";
import TiptapEditor from "./TiptapEditor";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { canPublishArticle } from "@/lib/rbac";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface ArticleEditorProps {
  categories: CategoryOption[];
  initial?: EditorArticle | null;
  userRole: UserRole;
  userId: string;
}

const AUTOSAVE_MS = 2500;

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function buildExcerpt(body: string, title: string): string {
  const text = stripHtml(body);
  if (!text) return title.slice(0, 200);
  return text.slice(0, 200);
}

export default function ArticleEditor({
  categories,
  initial,
  userRole,
}: ArticleEditorProps) {
  const router = useRouter();
  const canPublish = canPublishArticle(userRole);

  const [articleId, setArticleId] = useState<string | null>(initial?.id ?? null);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? categories[0]?.id ?? ""
  );
  const [featuredImage, setFeaturedImage] = useState<string | null>(
    initial?.featuredImage ?? null
  );
  const [isBreaking, setIsBreaking] = useState(initial?.isBreaking ?? false);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(
    initial?.updatedAt ? new Date(initial.updatedAt) : null
  );
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(
    initial?.scheduledAt
      ? new Date(initial.scheduledAt).toISOString().slice(0, 16)
      : ""
  );
  const [uploading, setUploading] = useState(false);

  const dirtyRef = useRef(false);
  const [isDirty, setIsDirty] = useState(false);
  const savingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markDirty = useCallback(() => {
    dirtyRef.current = true;
    setIsDirty(true);
    setSaveStatus("idle");
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/v1/admin/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error ?? "Upload failed");
        return null;
      }
      return json.data.url as string;
    } catch {
      alert("Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const saveArticle = useCallback(
    async (opts?: {
      forceStatus?: "draft" | "published" | "scheduled" | "archived";
      scheduledAtValue?: string;
    }) => {
      if (!title.trim() || !categoryId) return false;
      if (savingRef.current) return false;

      savingRef.current = true;
      setSaveStatus("saving");

      const payload: Record<string, unknown> = {
        title: title.trim(),
        body,
        excerpt: buildExcerpt(body, title),
        categoryId,
        featuredImage,
        isBreaking,
        isFeatured,
      };

      if (opts?.forceStatus) {
        payload.status = opts.forceStatus;
        if (opts.forceStatus === "scheduled" && opts.scheduledAtValue) {
          payload.scheduledAt = new Date(opts.scheduledAtValue).toISOString();
        }
      } else if (!articleId) {
        payload.status = "draft";
      }

      try {
        const res = articleId
          ? await fetch(`/api/v1/admin/articles/${articleId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch("/api/v1/admin/articles", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

        const json = await res.json();
        if (!res.ok) {
          setSaveStatus("error");
          const detail =
            json.details?.fieldErrors &&
            Object.entries(json.details.fieldErrors as Record<string, string[]>)
              .map(([k, v]) => `${k}: ${v.join(", ")}`)
              .join("\n");
          alert(detail ? `${json.error}\n${detail}` : (json.error ?? "Save failed"));
          return false;
        }

        const saved = json.data as EditorArticle;
        setArticleId(saved.id);
        setStatus(saved.status);
        setLastSavedAt(new Date());
        setSaveStatus("saved");
        dirtyRef.current = false;
        setIsDirty(false);

        if (opts?.forceStatus === "published") {
          router.push("/dashboard/articles");
          router.refresh();
        }

        return true;
      } catch {
        setSaveStatus("error");
        return false;
      } finally {
        savingRef.current = false;
      }
    },
    [
      articleId,
      title,
      body,
      categoryId,
      featuredImage,
      isBreaking,
      isFeatured,
      router,
    ]
  );

  useEffect(() => {
    if (!dirtyRef.current || !title.trim() || !categoryId) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void saveArticle();
    }, AUTOSAVE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [title, body, categoryId, featuredImage, isBreaking, isFeatured, saveArticle]);

  const handleFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await uploadImage(file);
    if (url) {
      setFeaturedImage(url);
      markDirty();
    }
  };

  const handlePublish = async () => {
    if (!canPublish) return;
    await saveArticle({ forceStatus: "published" });
  };

  const handleSchedule = async () => {
    if (!canPublish || !scheduledAt) return;
    const ok = await saveArticle({
      forceStatus: "scheduled",
      scheduledAtValue: scheduledAt,
    });
    if (ok) {
      setShowSchedule(false);
      setStatus("scheduled");
    }
  };

  const saveLabel =
    saveStatus === "saving"
      ? "Saving…"
      : saveStatus === "saved" && lastSavedAt
        ? `Saved ${lastSavedAt.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}`
          : saveStatus === "error"
          ? "Save failed"
          : isDirty
            ? "Unsaved changes"
            : status === "published"
              ? "Published"
              : status === "scheduled"
                ? "Scheduled"
                : "Draft";

  return (
    <div className="bg-surface border border-white/6 rounded-[14px] overflow-hidden mb-6">
      <div className="px-6 py-5 border-b border-white/6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-[family-name:var(--font-serif)] text-xl font-bold text-white">
            {initial ? "Edit Article" : "New Article"}
          </h3>
          <p
            className={cn(
              "font-[family-name:var(--font-ui)] text-xs mt-1",
              saveStatus === "error" ? "text-breaking" : "text-text-muted"
            )}
          >
            {saveLabel}
            {uploading && " · Uploading image…"}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void saveArticle({ forceStatus: "draft" })}
          >
            Save Draft
          </Button>
          {canPublish && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSchedule((v) => !v)}
              >
                Schedule
              </Button>
              <Button size="sm" onClick={() => void handlePublish()}>
                Publish Now
              </Button>
            </>
          )}
        </div>
      </div>

      {showSchedule && canPublish && (
        <div className="px-6 py-4 border-b border-white/6 bg-white/[0.02] flex flex-wrap items-end gap-3">
          <label className="font-[family-name:var(--font-ui)] text-xs text-text-muted">
            Publish at
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="mt-1 block bg-white/5 border border-white/6 rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-[rgba(212,175,55,0.3)]"
            />
          </label>
          <Button size="sm" onClick={() => void handleSchedule()} disabled={!scheduledAt}>
            Confirm Schedule
          </Button>
        </div>
      )}

      <div className="px-6 py-5 border-b border-white/6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              markDirty();
            }}
            placeholder="Article Headline…"
            className="w-full bg-transparent border-none outline-none font-[family-name:var(--font-serif)] text-[26px] font-bold text-white leading-snug"
          />
        </div>

        <label className="font-[family-name:var(--font-ui)] text-xs text-text-muted">
          Category
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              markDirty();
            }}
            className="mt-1 w-full bg-white/5 border border-white/6 rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-[rgba(212,175,55,0.3)]"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <div className="font-[family-name:var(--font-ui)] text-xs text-text-muted">
          Featured image
          <div className="mt-1 flex items-center gap-3">
            <label className="cursor-pointer font-[family-name:var(--font-ui)] text-xs font-semibold px-3 py-2 rounded-md bg-white/5 border border-white/6 text-text-secondary hover:text-gold transition-all">
              Upload
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFeaturedUpload}
              />
            </label>
            {featuredImage && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredImage}
                  alt=""
                  className="h-10 w-16 object-cover rounded-md border border-white/6"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFeaturedImage(null);
                    markDirty();
                  }}
                  className="text-xs text-breaking hover:underline"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        </div>

        {canPublish && (
          <div className="sm:col-span-2 flex flex-wrap gap-4 font-[family-name:var(--font-ui)] text-xs text-text-secondary">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBreaking}
                onChange={(e) => {
                  setIsBreaking(e.target.checked);
                  markDirty();
                }}
                className="accent-gold"
              />
              Breaking news
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => {
                  setIsFeatured(e.target.checked);
                  markDirty();
                }}
                className="accent-gold"
              />
              Featured on homepage
            </label>
          </div>
        )}
      </div>

      <TiptapEditor
        content={body}
        onChange={(html) => {
          setBody(html);
          markDirty();
        }}
        onImageUpload={uploadImage}
      />
    </div>
  );
}
