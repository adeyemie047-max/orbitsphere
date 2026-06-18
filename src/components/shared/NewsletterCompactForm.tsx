"use client";

import { useNewsletterSubscribe } from "@/components/shared/useNewsletterSubscribe";

/** Sidebar / article inline form — stable globals.css classes only (hydration-safe). */
export default function NewsletterCompactForm() {
  const { email, setEmail, submitted, error, loading, handleSubmit } =
    useNewsletterSubscribe();

  if (submitted) {
    return (
      <p className="newsletter-form__success">
        Welcome to OrbitSphere! Check your inbox for confirmation.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="newsletter-form newsletter-form--compact"
    >
      {error && <p className="newsletter-form__error">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email address"
        required
        disabled={loading}
        className="field-input newsletter-form__input w-full"
      />
      <button
        type="submit"
        className="newsletter-form__submit"
        disabled={loading}
      >
        {loading ? "Subscribing…" : "Subscribe →"}
      </button>
    </form>
  );
}
