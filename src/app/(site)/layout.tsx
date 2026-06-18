import type { Metadata } from "next";
import PublicSiteChrome from "@/components/layout/PublicSiteChrome";
import BreakingTicker from "@/components/layout/BreakingTicker";
import BrandingStyles from "@/components/branding/BrandingStyles";
import AnalyticsScripts from "@/components/seo/AnalyticsScripts";
import JsonLd from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/json-ld";
import { brandingToMetadata, getSiteBranding } from "@/lib/site-branding";
export async function generateMetadata(): Promise<Metadata> {
  const branding = await getSiteBranding();
  return brandingToMetadata(branding);
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const branding = await getSiteBranding();

  return (
    <>
      <AnalyticsScripts />
      <JsonLd data={[organizationJsonLd(branding), websiteJsonLd(branding)]} />
      <BrandingStyles branding={branding} />
      <PublicSiteChrome branding={branding} ticker={<BreakingTicker />}>
        {children}
      </PublicSiteChrome>
    </>
  );
}
