"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenFromUrl, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Reset failed");
        return;
      }

      router.push("/sign-in?reset=1");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!tokenFromUrl) {
    return (
      <p className="text-sm text-red-400">
        Missing reset token. Request a new link from{" "}
        <Link href="/forgot-password" className="text-gold hover:underline">
          forgot password
        </Link>
        .
      </p>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}
      <input
        type="password"
        placeholder="New password (8+ chars, 1 uppercase, 1 number)"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="bg-surface-2 border border-border rounded-lg px-4 py-3 font-[family-name:var(--font-ui)] text-sm text-foreground outline-none focus:border-[var(--ds-accent)]"
      />
      <Button type="submit" className="w-full justify-center" disabled={loading}>
        {loading ? "Updating…" : "Update Password"}
      </Button>
    </form>
  );
}
