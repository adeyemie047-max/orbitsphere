"use client";

import { useCallback, useEffect, useState } from "react";
import EditorialImage from "@/components/ui/EditorialImage";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type AdRow = {
  id: string;
  title: string | null;
  imageUrl: string | null;
  targetUrl: string | null;
  placement: string;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  impressions: number;
  clicks: number;
};

type Inquiry = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  budget: string | null;
  message: string;
  createdAt: string;
};

type AdFormState = {
  title: string;
  imageUrl: string;
  targetUrl: string;
  placement: string;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
};

const PLACEMENTS = [
  { value: "banner", label: "Homepage Leaderboard (728×90)" },
  { value: "sidebar", label: "Homepage Rectangle (300×250)" },
  { value: "inline", label: "In-Article Banner" },
  { value: "footer", label: "Footer / Newsletter" },
] as const;

const emptyForm = (): AdFormState => ({
  title: "",
  imageUrl: "",
  targetUrl: "",
  placement: "banner",
  isActive: true,
  startsAt: "",
  endsAt: "",
});

function ctr(impressions: number, clicks: number) {
  if (impressions === 0) return "—";
  return `${((clicks / impressions) * 100).toFixed(2)}%`;
}

function toDatetimeLocal(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdsManagerPanel() {
  const [ads, setAds] = useState<AdRow[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<AdFormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [adsRes, inquiriesRes] = await Promise.all([
      fetch("/api/v1/admin/ads"),
      fetch("/api/v1/admin/advertise/inquiries"),
    ]);

    if (adsRes.ok) {
      const json = await adsRes.json();
      setAds(json.data ?? []);
    }
    if (inquiriesRes.ok) {
      const json = await inquiriesRes.json();
      setInquiries(json.data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setError(null);
    setFormOpen(true);
  };

  const openEdit = (ad: AdRow) => {
    setEditingId(ad.id);
    setForm({
      title: ad.title ?? "",
      imageUrl: ad.imageUrl ?? "",
      targetUrl: ad.targetUrl ?? "",
      placement: ad.placement,
      isActive: ad.isActive,
      startsAt: toDatetimeLocal(ad.startsAt),
      endsAt: toDatetimeLocal(ad.endsAt),
    });
    setError(null);
    setFormOpen(true);
  };

  const saveAd = async () => {
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      targetUrl: form.targetUrl.trim() || null,
      placement: form.placement,
      isActive: form.isActive,
      startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
      endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
    };

    const res = await fetch(
      editingId ? `/api/v1/admin/ads/${editingId}` : "/api/v1/admin/ads",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Failed to save ad");
      setSaving(false);
      return;
    }

    setFormOpen(false);
    setSaving(false);
    await fetchAll();
  };

  const removeAd = async (id: string) => {
    if (!confirm("Delete this advertisement?")) return;
    const res = await fetch(`/api/v1/admin/ads/${id}`, { method: "DELETE" });
    if (res.ok) await fetchAll();
  };

  const toggleActive = async (ad: AdRow) => {
    await fetch(`/api/v1/admin/ads/${ad.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !ad.isActive }),
    });
    await fetchAll();
  };

  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active ads", value: ads.filter((a) => a.isActive).length },
          { label: "Total impressions", value: totalImpressions.toLocaleString() },
          { label: "Total clicks", value: `${totalClicks.toLocaleString()} (${ctr(totalImpressions, totalClicks)})` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-surface border border-white/6 rounded-[14px] p-5"
          >
            <p className="font-ui text-xs text-text-muted uppercase tracking-wide mb-1">
              {stat.label}
            </p>
            <p className="font-serif text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-xl font-bold text-white">Campaigns</h2>
        <Button type="button" size="sm" onClick={openCreate}>
          + New ad
        </Button>
      </div>

      {loading ? (
        <p className="font-ui text-sm text-text-muted">Loading ads…</p>
      ) : ads.length === 0 ? (
        <div className="bg-surface border border-dashed border-white/10 rounded-[14px] p-10 text-center">
          <p className="font-ui text-sm text-text-muted mb-4">No ads yet. Create your first campaign.</p>
          <Button type="button" size="sm" onClick={openCreate}>
            Create ad
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[14px] border border-white/6">
          <table className="w-full min-w-[720px] font-ui text-sm">
            <thead className="bg-white/4 text-text-muted text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Creative</th>
                <th className="px-4 py-3 font-medium">Placement</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Impressions</th>
                <th className="px-4 py-3 font-medium text-right">Clicks</th>
                <th className="px-4 py-3 font-medium text-right">CTR</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id} className="border-t border-white/6 hover:bg-white/2">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {ad.imageUrl ? (
                        <div className="relative w-16 h-10 rounded overflow-hidden shrink-0 bg-white/5">
                          <EditorialImage src={ad.imageUrl} alt="" fill className="object-cover" sizes="64px" />
                        </div>
                      ) : (
                        <div className="w-16 h-10 rounded bg-white/5 shrink-0" />
                      )}
                      <span className="text-white line-clamp-1">{ad.title ?? "Untitled"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary capitalize">{ad.placement}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(ad)}
                      className={cn(
                        "text-xs font-semibold px-2 py-1 rounded-full border",
                        ad.isActive
                          ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                          : "border-white/10 text-text-muted"
                      )}
                    >
                      {ad.isActive ? "Active" : "Paused"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right text-text-secondary">
                    {ad.impressions.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-text-secondary">
                    {ad.clicks.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-gold font-medium">
                    {ctr(ad.impressions, ad.clicks)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(ad)}
                        className="text-xs text-gold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAd(ad.id)}
                        className="text-xs text-breaking hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-lg bg-[#0f1a2e] border border-white/10 rounded-[14px] p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl font-bold text-white mb-4">
              {editingId ? "Edit advertisement" : "New advertisement"}
            </h3>

            <div className="space-y-4">
              <Input
                label="Title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Campaign name"
              />
              <Input
                label="Image URL"
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://…"
              />
              <Input
                label="Target URL"
                value={form.targetUrl}
                onChange={(e) => setForm((f) => ({ ...f, targetUrl: e.target.value }))}
                placeholder="https://…"
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="ad-placement" className="font-ui text-xs font-medium text-text-secondary">
                  Placement
                </label>
                <select
                  id="ad-placement"
                  value={form.placement}
                  onChange={(e) => setForm((f) => ({ ...f, placement: e.target.value }))}
                  className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-ui text-sm text-foreground outline-none focus:border-gold"
                >
                  {PLACEMENTS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Starts at"
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
                />
                <Input
                  label="Ends at"
                  type="datetime-local"
                  value={form.endsAt}
                  onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
                />
              </div>
              <label className="flex items-center gap-2 font-ui text-sm text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="rounded"
                />
                Active (visible on site)
              </label>
              {error && (
                <p className="font-ui text-xs text-breaking" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={saveAd} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="font-serif text-xl font-bold text-white mb-4">
          Advertise inquiries
          {inquiries.length > 0 && (
            <span className="ml-2 font-ui text-sm font-normal text-text-muted">
              ({inquiries.length})
            </span>
          )}
        </h2>
        {inquiries.length === 0 ? (
          <p className="font-ui text-sm text-text-muted">
            Inquiries from the public /advertise page will appear here.
          </p>
        ) : (
          <div className="space-y-3">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-surface border border-white/6 rounded-[14px] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-ui text-sm font-semibold text-white">{inquiry.name}</p>
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="font-ui text-xs text-gold hover:underline"
                    >
                      {inquiry.email}
                    </a>
                  </div>
                  <time className="font-ui text-xs text-text-muted">
                    {new Date(inquiry.createdAt).toLocaleDateString("en-NG", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
                {(inquiry.company || inquiry.budget) && (
                  <p className="font-ui text-xs text-text-muted mb-2">
                    {[inquiry.company, inquiry.budget && `Budget: ${inquiry.budget}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                <p className="font-ui text-sm text-text-secondary leading-relaxed">
                  {inquiry.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
