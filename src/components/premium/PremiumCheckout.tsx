"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type PlanId = "monthly" | "annual";

const PLANS: {
  id: PlanId;
  label: string;
  price: string;
  period: string;
  description: string;
  badge?: string;
}[] = [
  {
    id: "monthly",
    label: "Monthly",
    price: "₦2,000",
    period: "/ month",
    description: "Flexible — cancel anytime",
  },
  {
    id: "annual",
    label: "Annual",
    price: "₦18,000",
    period: "/ year",
    description: "Save 25% vs paying monthly",
    badge: "Best value",
  },
];

export default function PremiumCheckout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selected, setSelected] = useState<PlanId>("annual");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPremium = session?.user?.isPremium;

  const checkout = async () => {
    if (!session?.user) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent("/premium")}`);
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/v1/premium/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: selected }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(json.error ?? "Unable to start checkout");
      setLoading(false);
      return;
    }

    window.location.href = json.authorizationUrl as string;
  };

  if (status === "loading") {
    return <div className="h-48 animate-pulse bg-surface rounded-[var(--radius-card)]" />;
  }

  if (isPremium) {
    return (
      <div className="editorial-card p-8 text-center">
        <span className="inline-block font-ui text-[10px] font-bold uppercase tracking-widest text-[var(--ds-accent)] bg-[var(--ds-accent-muted)] px-3 py-1 rounded-full mb-4">
          Premium member
        </span>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          You&apos;re already Premium
        </h2>
        <p className="font-ui text-sm text-text-secondary mb-6">
          Enjoy ad-free reading across OrbitSphere. Manage your plan in your profile.
        </p>
        <Button href="/profile">View profile</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setSelected(plan.id)}
            className={cn(
              "editorial-card p-6 text-left transition-colors relative",
              selected === plan.id
                ? "border-[var(--ds-accent)] ring-2 ring-[var(--ds-accent)]/20"
                : "hover:border-[var(--ds-accent)]/40"
            )}
          >
            {plan.badge && (
              <span className="absolute top-4 right-4 font-ui text-[10px] font-bold uppercase tracking-wide text-white bg-[var(--ds-accent)] px-2 py-0.5 rounded">
                {plan.badge}
              </span>
            )}
            <p className="font-ui text-xs font-semibold uppercase tracking-wide text-text-muted mb-1">
              {plan.label}
            </p>
            <p className="font-serif text-3xl font-extrabold text-foreground mb-1">
              {plan.price}
              <span className="text-base font-medium text-text-muted">{plan.period}</span>
            </p>
            <p className="font-ui text-sm text-text-secondary">{plan.description}</p>
          </button>
        ))}
      </div>

      {error && (
        <p className="font-ui text-sm text-breaking mb-4" role="alert">
          {error}
        </p>
      )}

      <Button
        type="button"
        variant="gold"
        className="w-full sm:w-auto"
        disabled={loading}
        onClick={checkout}
      >
        {loading ? "Redirecting to Paystack…" : "Subscribe with Paystack →"}
      </Button>

      <p className="font-ui text-xs text-text-muted mt-4">
        Secure payment via Paystack. Cards, bank transfer, and USSD accepted.
      </p>
    </div>
  );
}
