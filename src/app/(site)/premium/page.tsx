import Link from "next/link";
import { auth } from "@/auth";
import PremiumCheckout from "@/components/premium/PremiumCheckout";
import Button from "@/components/ui/Button";
import { isPaystackConfigured } from "@/lib/premium";

export const metadata = {
  title: "OrbitSphere Premium",
  description: "Ad-free reading, early access, and exclusive analysis for OrbitSphere members.",
};

const BENEFITS = [
  "Ad-free experience across the entire site",
  "Early access to breaking analysis and opinion pieces",
  "Premium badge on your reader profile",
  "Support independent African journalism",
];

export default async function PremiumPage() {
  const session = await auth();
  const paymentsReady = isPaystackConfigured();

  return (
    <div className="container-main py-12 sm:py-16 md:py-20">
      <div className="gold-rule" />
      <p className="section-label mb-2">OrbitSphere Premium</p>
      <h1 className="font-serif text-3xl md:text-5xl font-black text-foreground mb-4 max-w-2xl leading-tight">
        Read without distractions. Support the newsroom.
      </h1>
      <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mb-10">
        Premium members enjoy an ad-free OrbitSphere, early access to major stories, and
        directly fund fearless journalism across Nigeria and the diaspora.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start">
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">What you get</h2>
          <ul className="space-y-4 mb-10">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex gap-3 font-ui text-[15px] text-text-secondary">
                <span className="text-[var(--ds-accent)] font-bold shrink-0">✓</span>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="editorial-card p-6 bg-[var(--ds-accent-muted)]/30 border-[var(--ds-accent)]/20">
            <p className="font-ui text-sm text-text-secondary leading-relaxed">
              <strong className="text-foreground">For advertisers:</strong> Premium reduces
              display inventory — see our{" "}
              <Link href="/advertise" className="text-[var(--ds-accent)] hover:underline">
                media kit
              </Link>{" "}
              for sponsorship options that reach our full audience.
            </p>
          </div>
        </section>

        <aside>
          {!paymentsReady && (
            <div className="editorial-card p-6 mb-4 border-dashed">
              <p className="font-ui text-sm text-text-secondary">
                Online checkout is being configured. Contact{" "}
                <a href="mailto:premium@orbitsphere.ng" className="text-[var(--ds-accent)] hover:underline">
                  premium@orbitsphere.ng
                </a>{" "}
                to subscribe manually.
              </p>
            </div>
          )}

          {paymentsReady ? (
            <PremiumCheckout />
          ) : (
            <div className="editorial-card p-8 text-center">
              <h2 className="font-serif text-xl font-bold mb-4">Join the waitlist</h2>
              <p className="font-ui text-sm text-text-secondary mb-6">
                Premium subscriptions open soon. Sign in to get notified first.
              </p>
              <Button href={session ? "/profile" : "/sign-in?callbackUrl=/premium"}>
                {session ? "Go to profile" : "Sign in"}
              </Button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
