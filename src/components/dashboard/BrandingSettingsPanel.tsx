"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import EditorialImage from "@/components/ui/EditorialImage";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { SiteBrandingData } from "@/lib/site-branding";
import { DEFAULT_SITE_BRANDING } from "@/lib/site-branding";

type FormState = SiteBrandingData;

function emptyToNull(value: string | null): string | null {
  if (value === "" || value === null) return null;
  return value;
}

export default function BrandingSettingsPanel() {
  const [form, setForm] = useState<FormState>(DEFAULT_SITE_BRANDING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/admin/branding");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load branding");
      setForm(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load branding");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/v1/admin/branding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      setForm(json.data);
      setMessage("Branding saved. Changes appear on the public site within a few minutes.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "branding");
      const res = await fetch("/api/v1/admin/upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      setField("logoUrl", json.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <p className="text-text-muted text-sm mt-8">Loading branding settings…</p>;
  }

  return (
    <div className="mt-8 space-y-8 max-w-3xl">
      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}
      {message && (
        <p className="text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-4 py-3">
          {message}
        </p>
      )}

      <section className="p-6 bg-surface border border-white/6 rounded-[14px] space-y-4">
        <h2 className="font-ui text-xs font-bold tracking-[0.14em] uppercase text-gold">Identity</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Name (primary)"
            value={form.siteNamePrimary}
            onChange={(e) => setField("siteNamePrimary", e.target.value)}
          />
          <Input
            label="Name (accent)"
            value={form.siteNameAccent}
            onChange={(e) => setField("siteNameAccent", e.target.value)}
          />
        </div>
        <Input
          label="Tagline"
          value={form.siteTagline}
          onChange={(e) => setField("siteTagline", e.target.value)}
        />
        <Input
          label="Masthead locations"
          value={form.mastheadLocations}
          onChange={(e) => setField("mastheadLocations", e.target.value)}
        />
        <div>
          <label className="block font-ui text-xs text-text-muted mb-2">Logo image (optional)</label>
          {form.logoUrl && (
            <div className="relative w-24 h-24 mb-3 rounded-lg overflow-hidden border border-white/10">
              <EditorialImage src={form.logoUrl} alt="Site logo" fill className="object-contain" />
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleLogoUpload(file);
            }}
          />
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? "Uploading…" : "Upload logo"}
            </Button>
            {form.logoUrl && (
              <Button type="button" variant="outline" size="sm" onClick={() => setField("logoUrl", null)}>
                Remove logo
              </Button>
            )}
          </div>
          <Input
            label="Or logo URL"
            value={form.logoUrl ?? ""}
            onChange={(e) => setField("logoUrl", emptyToNull(e.target.value))}
            className="mt-3"
          />
        </div>
      </section>

      <section className="p-6 bg-surface border border-white/6 rounded-[14px] space-y-4">
        <h2 className="font-ui text-xs font-bold tracking-[0.14em] uppercase text-gold">Copy</h2>
        <Input
          label="Site description"
          value={form.siteDescription}
          onChange={(e) => setField("siteDescription", e.target.value)}
        />
        <Input
          label="Footer description"
          value={form.footerDescription}
          onChange={(e) => setField("footerDescription", e.target.value)}
        />
        <Input
          label="Newsletter heading"
          value={form.newsletterHeading}
          onChange={(e) => setField("newsletterHeading", e.target.value)}
        />
        <Input
          label="Newsletter description"
          value={form.newsletterDescription}
          onChange={(e) => setField("newsletterDescription", e.target.value)}
        />
        <Input
          label="Newsletter tagline"
          value={form.newsletterTagline}
          onChange={(e) => setField("newsletterTagline", e.target.value)}
        />
      </section>

      <section className="p-6 bg-surface border border-white/6 rounded-[14px] space-y-4">
        <h2 className="font-ui text-xs font-bold tracking-[0.14em] uppercase text-gold">Brand colors</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {(
            [
              ["accentColor", "Accent"],
              ["inkColor", "Ink"],
              ["paperColor", "Paper"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="block font-ui text-xs text-text-muted mb-2">{label}</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form[key]}
                  onChange={(e) => setField(key, e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-white/10 bg-transparent"
                />
                <Input value={form[key]} onChange={(e) => setField(key, e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="p-6 bg-surface border border-white/6 rounded-[14px] space-y-4">
        <h2 className="font-ui text-xs font-bold tracking-[0.14em] uppercase text-gold">SEO</h2>
        <Input label="Default title" value={form.seoTitle} onChange={(e) => setField("seoTitle", e.target.value)} />
        <Input
          label="Default description"
          value={form.seoDescription}
          onChange={(e) => setField("seoDescription", e.target.value)}
        />
        <Input
          label="OG image URL"
          value={form.ogImageUrl ?? ""}
          onChange={(e) => setField("ogImageUrl", emptyToNull(e.target.value))}
        />
      </section>

      <section className="p-6 bg-surface border border-white/6 rounded-[14px] space-y-4">
        <h2 className="font-ui text-xs font-bold tracking-[0.14em] uppercase text-gold">Social</h2>
        {(
          [
            ["twitterUrl", "Twitter / X"],
            ["facebookUrl", "Facebook"],
            ["linkedinUrl", "LinkedIn"],
            ["youtubeUrl", "YouTube"],
            ["instagramUrl", "Instagram"],
          ] as const
        ).map(([key, label]) => (
          <Input
            key={key}
            label={label}
            value={form[key] ?? ""}
            onChange={(e) => setField(key, emptyToNull(e.target.value))}
          />
        ))}
      </section>

      <section className="p-6 bg-surface border border-white/6 rounded-[14px] space-y-4">
        <h2 className="font-ui text-xs font-bold tracking-[0.14em] uppercase text-gold">Contact & legal</h2>
        <Input
          label="Contact email"
          value={form.contactEmail ?? ""}
          onChange={(e) => setField("contactEmail", emptyToNull(e.target.value))}
        />
        <Input
          label="Contact phone"
          value={form.contactPhone ?? ""}
          onChange={(e) => setField("contactPhone", emptyToNull(e.target.value))}
        />
        <Input
          label="Contact address"
          value={form.contactAddress ?? ""}
          onChange={(e) => setField("contactAddress", emptyToNull(e.target.value))}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Copyright holder"
            value={form.copyrightName}
            onChange={(e) => setField("copyrightName", e.target.value)}
          />
          <Input
            label="Copyright year"
            type="number"
            value={String(form.copyrightYear)}
            onChange={(e) => setField("copyrightYear", Number(e.target.value))}
          />
        </div>
      </section>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save branding"}
        </Button>
        <Button variant="outline" onClick={load} disabled={loading || saving}>
          Reset form
        </Button>
      </div>
    </div>
  );
}
