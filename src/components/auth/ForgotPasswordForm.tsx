"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setDevResetUrl(null);
    setLoading(true);

    try {
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setError(data.error);
        return;
      }

      if (!response.ok) {
        setError(data.error ?? "Request failed");
        return;
      }

      setMessage(data.message);
      if (data.devResetUrl) {
        setDevResetUrl(data.devResetUrl);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
      {devResetUrl && (
        <p className="text-xs text-text-muted break-all">
          Dev reset link:{" "}
          <a href={devResetUrl} className="text-gold hover:underline">
            {devResetUrl}
          </a>
        </p>
      )}
      <input
        type="email"
        placeholder="Email address"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="bg-surface-2 border border-border rounded-lg px-4 py-3 font-[family-name:var(--font-ui)] text-sm text-foreground outline-none focus:border-[var(--ds-accent)]"
      />
      <Button type="submit" className="w-full justify-center" disabled={loading}>
        {loading ? "Sending…" : "Send Reset Link"}
      </Button>
    </form>
  );
}
