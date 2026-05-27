import NewsletterForm from "@/components/shared/NewsletterForm";

export default function Newsletter() {
  return (
    <div className="container-main mb-12 sm:mb-16">
      <section className="newsletter-band relative py-16 sm:py-20 bg-[var(--ds-hero-bg)] border border-[var(--ds-hero-border)] rounded-2xl overflow-hidden text-center">
        <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(230,46,45,0.12)_0%,transparent_70%)] -top-[200px] left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="section-label mb-3 relative z-10">Stay Informed</div>
        <h2 className="font-serif text-[26px] sm:text-[34px] md:text-[42px] font-black text-[var(--ds-hero-fg)] mb-3 relative z-10 leading-tight">
          The future of news,
          <br />
          <span className="text-[var(--ds-accent-light)] italic">delivered daily.</span>
        </h2>
        <p className="text-[15px] text-[var(--ds-hero-muted)] mb-9 relative z-10 max-w-md mx-auto px-4">
          Join 240,000 Africans who read OrbitSphere every morning. No noise. Only what
          matters.
        </p>
        <div className="max-w-[500px] mx-auto relative z-10 px-4">
          <NewsletterForm inverse />
        </div>
        <p className="font-ui text-[11px] text-[var(--ds-hero-subtle)] mt-3 relative z-10">
          Free forever. Unsubscribe anytime. No spam — we promise.
        </p>
      </section>
    </div>
  );
}
