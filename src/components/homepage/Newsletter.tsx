import NewsletterCtaForm from "@/components/shared/NewsletterCtaForm";
import type { SiteBrandingData } from "@/lib/site-branding";

export default function Newsletter({ branding }: { branding: SiteBrandingData }) {
  return (
    <section className="newsletter-cta reveal-on-scroll" aria-labelledby="newsletter-heading">
      <div className="container-main newsletter-cta__inner relative z-[1] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="newsletter-cta__copy max-w-lg">
          <p className="section-label section-label--inverse mb-4">
            Newsletter
          </p>
          <h2
            id="newsletter-heading"
            className="newsletter-cta__heading font-serif"
          >
            {branding.newsletterHeading}
          </h2>
          <p className="newsletter-cta__desc">
            {branding.newsletterDescription}
          </p>
          <p className="newsletter-cta__tagline font-ui">
            {branding.newsletterTagline}
          </p>
        </div>
        <div className="newsletter-cta__form-wrap w-full lg:max-w-[480px] lg:shrink-0">
          <NewsletterCtaForm />
          <p className="newsletter-cta__fineprint font-ui">
            Free · Unsubscribe anytime · No spam
          </p>
        </div>
      </div>
    </section>
  );
}
