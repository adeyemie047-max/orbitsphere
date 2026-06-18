"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function NewsletterUnsubscribeForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const res = await fetch("/api/v1/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(json.error ?? "Unable to unsubscribe");
      setLoading(false);
      return;
    }

    setMessage(json.message ?? "Unsubscribed successfully.");
    setEmail("");
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input
        label="Email address"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && (
        <p className="font-ui text-sm text-breaking" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="font-ui text-sm text-emerald-600 dark:text-emerald-400" role="status">
          {message}
        </p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "Unsubscribing…" : "Unsubscribe"}
      </Button>
    </form>
  );
}
