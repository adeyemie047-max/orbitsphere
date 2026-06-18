"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function PremiumVerifyClient() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const { update } = useSession();
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your payment…");

  useEffect(() => {
    if (!reference) {
      setState("error");
      setMessage("Missing payment reference.");
      return;
    }

    let cancelled = false;

    (async () => {
      const res = await fetch(
        `/api/v1/premium/verify?reference=${encodeURIComponent(reference)}`
      );
      const json = await res.json().catch(() => ({}));

      if (cancelled) return;

      if (!res.ok) {
        setState("error");
        setMessage(json.error ?? "Payment verification failed.");
        return;
      }

      await update();
      setState("success");
      setMessage("Welcome to OrbitSphere Premium! Your membership is now active.");
    })();

    return () => {
      cancelled = true;
    };
  }, [reference, update]);

  return (
    <div className="editorial-card p-8 sm:p-10 text-center max-w-lg mx-auto">
      {state === "loading" && (
        <>
          <div className="w-10 h-10 border-2 border-[var(--ds-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-ui text-sm text-text-secondary">{message}</p>
        </>
      )}

      {state === "success" && (
        <>
          <span className="text-4xl mb-4 block" aria-hidden>
            ✓
          </span>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
            Payment successful
          </h1>
          <p className="font-ui text-sm text-text-secondary mb-6">{message}</p>
          <Button href="/">Start reading ad-free</Button>
        </>
      )}

      {state === "error" && (
        <>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
            Something went wrong
          </h1>
          <p className="font-ui text-sm text-text-secondary mb-6">{message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/premium">Try again</Button>
            <Link
              href="mailto:support@orbitsphere.ng"
              className="font-ui text-sm text-[var(--ds-accent)] hover:underline self-center"
            >
              Contact support
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
