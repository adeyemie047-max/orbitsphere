"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }

      router.push("/sign-in?registered=1");
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
      <input
        type="text"
        placeholder="Full name"
        required
        value={form.fullName}
        onChange={(event) => setForm({ ...form, fullName: event.target.value })}
        className="bg-surface-2 border border-border rounded-lg px-4 py-3 font-[family-name:var(--font-ui)] text-sm text-foreground outline-none focus:border-[var(--ds-accent)]"
      />
      <input
        type="text"
        placeholder="Username"
        required
        value={form.username}
        onChange={(event) =>
          setForm({ ...form, username: event.target.value.toLowerCase() })
        }
        className="bg-surface-2 border border-border rounded-lg px-4 py-3 font-[family-name:var(--font-ui)] text-sm text-foreground outline-none focus:border-[var(--ds-accent)]"
      />
      <input
        type="email"
        placeholder="Email address"
        required
        value={form.email}
        onChange={(event) => setForm({ ...form, email: event.target.value })}
        className="bg-surface-2 border border-border rounded-lg px-4 py-3 font-[family-name:var(--font-ui)] text-sm text-foreground outline-none focus:border-[var(--ds-accent)]"
      />
      <input
        type="password"
        placeholder="Password (8+ chars, 1 uppercase, 1 number)"
        required
        value={form.password}
        onChange={(event) => setForm({ ...form, password: event.target.value })}
        className="bg-surface-2 border border-border rounded-lg px-4 py-3 font-[family-name:var(--font-ui)] text-sm text-foreground outline-none focus:border-[var(--ds-accent)]"
      />
      <Button type="submit" className="w-full justify-center" disabled={loading}>
        {loading ? "Creating account…" : "Create Account"}
      </Button>
    </form>
  );
}
