"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Sign in failed");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
            {error}
          </p>
        )}
        <input
          type="email"
          placeholder="Email address"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full field-input"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full field-input"
        />
        <div className="text-right">
          <Link href="/forgot-password" className="text-xs text-gold hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full justify-center" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </Button>
      </form>
      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="font-[family-name:var(--font-ui)] text-xs text-text-muted">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <Button
        href="/api/auth/signin/google"
        variant="outline"
        className="w-full justify-center"
      >
        Continue with Google
      </Button>
    </>
  );
}
