"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface NewsletterFormProps {
  compact?: boolean;
  className?: string;
  /** Use on dark CTA bands (homepage newsletter) */
  inverse?: boolean;
}

export default function NewsletterForm({
  compact,
  className,
  inverse = false,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/v1/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Subscription failed");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <p
        className={`font-ui text-sm text-center ${inverse ? "text-[var(--ds-accent-light)]" : "text-[var(--ds-accent)]"}`}
      >
        Welcome to OrbitSphere! Check your inbox for confirmation.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex ${compact ? "flex-col" : "flex-col sm:flex-row"} gap-3 ${className ?? ""}`}
    >
      {error && (
        <p className="text-sm text-red-500 w-full">{error}</p>
      )}
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email address"
        required
        disabled={loading}
        className={`field-input ${compact ? "w-full" : "flex-1 sm:rounded-full"} disabled:opacity-50`}
      />
      <Button
        type="submit"
        size="sm"
        className={compact ? "w-full justify-center" : "shrink-0"}
        disabled={loading}
      >
        {loading ? "Subscribing…" : "Subscribe →"}
      </Button>
    </form>
  );
}
