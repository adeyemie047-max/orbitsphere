"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function AdvertiseInquiryForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    budget: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/v1/advertise/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || null,
        phone: form.phone.trim() || null,
        budget: form.budget.trim() || null,
        message: form.message.trim(),
      }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(json.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(json.message ?? "Inquiry submitted successfully.");
    setForm({ name: "", email: "", company: "", phone: "", budget: "", message: "" });
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full name"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <Input
          label="Work email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Company"
          value={form.company}
          onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
        />
        <Input
          label="Phone (optional)"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        />
      </div>
      <Input
        label="Estimated budget"
        placeholder="e.g. ₦100,000/month"
        value={form.budget}
        onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="inquiry-message" className="font-ui text-xs font-medium text-text-secondary">
          Tell us about your campaign
        </label>
        <textarea
          id="inquiry-message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Goals, target audience, preferred ad formats, timeline…"
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-ui text-sm text-foreground placeholder:text-text-muted outline-none focus:border-[var(--ds-accent)] focus:ring-2 focus:ring-[var(--ds-accent)]/20 resize-y min-h-[120px]"
        />
      </div>

      {error && (
        <p className="font-ui text-sm text-breaking" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="font-ui text-sm text-emerald-600 dark:text-emerald-400" role="status">
          {success}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Sending…" : "Request media kit"}
      </Button>
    </form>
  );
}
