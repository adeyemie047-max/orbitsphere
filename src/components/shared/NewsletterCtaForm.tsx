"use client";

import { useNewsletterSubscribe } from "@/components/shared/useNewsletterSubscribe";

/** Homepage dark-band CTA — stable globals.css classes only (hydration-safe). */
export default function NewsletterCtaForm() {
  const { email, setEmail, submitted, error, loading, handleSubmit } =
    useNewsletterSubscribe();

  if (submitted) {
    return (
      <p className="newsletter-cta__success">
        Welcome to OrbitSphere! Check your inbox for confirmation.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="newsletter-cta__form">
      {error && <p className="newsletter-cta__error">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email address"
        required
        disabled={loading}
        className="newsletter-cta__input"
      />
      <button type="submit" className="newsletter-cta__submit" disabled={loading}>
        {loading ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}
