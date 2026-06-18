import Link from "next/link";
import Button from "@/components/ui/Button";
import { getPremiumSubscription } from "@/lib/premium";

export default async function PremiumStatusCard({ userId }: { userId: string }) {
  const subscription = await getPremiumSubscription(userId);

  if (!subscription || subscription.status !== "active") {
    return (
      <section className="editorial-card p-6 mb-8">
        <p className="section-label mb-1">Membership</p>
        <h2 className="font-serif text-xl font-bold text-foreground mb-2">Go Premium</h2>
        <p className="font-ui text-sm text-text-secondary mb-4 leading-relaxed">
          Ad-free reading and early access to major stories. From ₦2,000/month.
        </p>
        <Button href="/premium" size="sm" variant="gold">
          View plans
        </Button>
      </section>
    );
  }

  const expires = subscription.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-NG", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <section className="editorial-card p-6 mb-8 border-[var(--ds-accent)]/30 bg-[var(--ds-accent-muted)]/20">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="section-label mb-1 text-[var(--ds-accent)]">Premium member</p>
          <h2 className="font-serif text-xl font-bold text-foreground capitalize">
            {subscription.plan} plan
          </h2>
        </div>
        <span className="font-ui text-[10px] font-bold uppercase tracking-wide text-white bg-[var(--ds-accent)] px-2 py-1 rounded shrink-0">
          Active
        </span>
      </div>
      {expires && (
        <p className="font-ui text-sm text-text-secondary mb-4">
          Active until {expires}
        </p>
      )}
      <Link href="/premium" className="font-ui text-sm text-[var(--ds-accent)] hover:underline">
        Manage membership
      </Link>
    </section>
  );
}
