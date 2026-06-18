import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SkipLink from "@/components/layout/SkipLink";
import CookieConsent from "@/components/layout/CookieConsent";
import type { SiteBrandingData } from "@/lib/site-branding";

/** Server-rendered public shell — avoids hydration drift on footer/main chrome. */
export default function PublicSiteChrome({
  children,
  ticker,
  branding,
}: {
  children: React.ReactNode;
  ticker: React.ReactNode;
  branding: SiteBrandingData;
}) {
  return (
    <div className="site-public">
      <SkipLink />
      <Navbar branding={branding} />
      {ticker}
      <main id="main-content" tabIndex={-1} className="site-main">
        {children}
      </main>
      <Footer branding={branding} />
      <CookieConsent />
    </div>
  );
}
