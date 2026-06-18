"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "orbitsphere-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 inset-x-0 z-[150] p-4 md:p-6 cookie-banner"
    >
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 sm:p-5 rounded-lg sm:rounded-[14px] bg-surface border border-border shadow-lg">
          <p className="flex-1 font-ui text-sm text-text-secondary leading-relaxed">
            We use essential cookies for sign-in and preferences, and analytics to improve
            OrbitSphere. See our{" "}
            <Link href="/cookies" className="text-gold underline underline-offset-2">
              Cookie Policy
            </Link>{" "}
            for details.
          </p>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/cookies"
              className="font-ui text-sm px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-foreground transition-colors"
            >
              Manage
            </Link>
            <button
              type="button"
              onClick={accept}
              className="font-ui text-sm font-semibold px-4 py-2 rounded-lg bg-gold text-gold-fg hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
