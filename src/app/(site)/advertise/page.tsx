import type { Metadata } from "next";
import AdvertiseInquiryForm from "@/components/advertise/AdvertiseInquiryForm";
import Button from "@/components/ui/Button";
import { AD_FORMATS, getAdvertiseStats } from "@/lib/advertise-data";

export const metadata: Metadata = {
  title: "Advertise with OrbitSphere",
  description:
    "Reach Nigeria's most engaged news audience. Display ads, sponsored content, and newsletter partnerships.",
};

function formatViews(count: number) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return count.toLocaleString();
}

export default async function AdvertisePage() {
  const stats = await getAdvertiseStats();

  return (
    <div className="container-main py-12 sm:py-16 md:py-20">
      <div className="gold-rule" />
      <p className="section-label mb-2">Partnerships</p>
      <h1 className="font-serif text-3xl md:text-5xl font-black text-foreground mb-4 max-w-2xl leading-tight">
        Put your brand in front of Africa&apos;s next generation of readers
      </h1>
      <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mb-10">
        OrbitSphere delivers premium journalism to Nigeria and the Pan-African diaspora.
        Partner with us through display advertising, sponsored stories, and newsletter placements.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {[
          { label: "Monthly readers", value: stats.monthlyReadersLabel },
          { label: "Story views", value: formatViews(stats.totalViews) },
          { label: "Published stories", value: stats.publishedArticles.toLocaleString() },
          { label: "Newsletter subs", value: stats.newsletterSubscribers.toLocaleString() },
        ].map((item) => (
          <div key={item.label} className="editorial-card p-5 text-center">
            <p className="font-serif text-2xl sm:text-3xl font-extrabold text-[var(--ds-accent)] mb-1">
              {item.value}
            </p>
            <p className="font-ui text-xs text-text-muted uppercase tracking-wide">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Ad formats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {AD_FORMATS.map((format) => (
              <article key={format.id} className="editorial-card p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-serif text-lg font-bold text-text-primary">{format.name}</h3>
                  <span className="font-ui text-[10px] font-semibold uppercase tracking-wide text-text-muted shrink-0">
                    {format.size}
                  </span>
                </div>
                <p className="font-ui text-sm text-text-secondary leading-relaxed mb-4 flex-1">
                  {format.description}
                </p>
                <p className="font-ui text-sm">
                  <span className="text-text-muted">From </span>
                  <span className="font-bold text-[var(--ds-accent)]">{format.rateFrom}</span>
                  <span className="text-text-muted">{format.ratePeriod}</span>
                </p>
              </article>
            ))}
          </div>

          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Why OrbitSphere</h2>
          <ul className="space-y-3 font-ui text-[15px] text-text-secondary leading-relaxed list-none">
            {[
              "Young, educated audience across Lagos, Abuja, and the diaspora",
              "Transparent reporting — impressions and clicks tracked in real time",
              "Editorial adjacency with politics, business, tech, and culture coverage",
              "Flexible packages: homepage takeovers, category sponsorships, newsletter slots",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[var(--ds-accent)] font-bold shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/">View the site</Button>
            <Button href="mailto:advertise@orbitsphere.ng" variant="outline">
              Email partnerships
            </Button>
          </div>
        </section>

        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="editorial-card p-6 sm:p-8">
            <h2 className="font-serif text-xl font-bold text-foreground mb-2">Get in touch</h2>
            <p className="font-ui text-sm text-text-secondary mb-6 leading-relaxed">
              Tell us about your brand and goals. Our partnerships team responds within 2 business days.
            </p>
            <AdvertiseInquiryForm />
          </div>
        </aside>
      </div>
    </div>
  );
}
