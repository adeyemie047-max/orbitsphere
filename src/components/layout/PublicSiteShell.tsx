"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SkipLink from "@/components/layout/SkipLink";
import CookieConsent from "@/components/layout/CookieConsent";

/** Public newspaper shell — no admin chrome; dashboard uses AdminShell instead. */
export default function PublicSiteShell({
  children,
  ticker,
}: {
  children: React.ReactNode;
  ticker: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEditorialRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isEditorialRoute) {
    return <>{children}</>;
  }

  return (
    <div className="site-public">
      <SkipLink />
      <Navbar />
      {ticker}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
