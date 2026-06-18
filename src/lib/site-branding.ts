import { unstable_cache } from "next/cache";
import type { SiteBranding } from "@prisma/client";
import { db } from "@/lib/db";

export type SiteBrandingData = {
  siteNamePrimary: string;
  siteNameAccent: string;
  siteTagline: string;
  mastheadLocations: string;
  siteDescription: string;
  footerDescription: string;
  newsletterHeading: string;
  newsletterDescription: string;
  newsletterTagline: string;
  copyrightName: string;
  copyrightYear: number;
  logoUrl: string | null;
  faviconUrl: string | null;
  accentColor: string;
  inkColor: string;
  paperColor: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string | null;
  twitterUrl: string | null;
  facebookUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  instagramUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
};

export const DEFAULT_SITE_BRANDING: SiteBrandingData = {
  siteNamePrimary: "Orbit",
  siteNameAccent: "Sphere",
  siteTagline: "Independent · African",
  mastheadLocations: "Lagos · Abuja · London",
  siteDescription:
    "OrbitSphere is a futuristic, premium African digital newspaper that combines cinematic design, AI-powered features, and world-class journalism. Built for Nigeria and the Pan-African diaspora, we deliver trustworthy, modern, and deeply engaging news experiences.",
  footerDescription:
    "OrbitSphere is Nigeria's premier digital newspaper — delivering fearless, intelligent journalism that keeps Africa informed, engaged, and empowered.",
  newsletterHeading: "Smart news, zero noise",
  newsletterDescription:
    "A curated morning brief for readers who want substance without the scroll.",
  newsletterTagline: "Join thousands of informed readers across Africa",
  copyrightName: "OrbitSphere Media Limited",
  copyrightYear: 2026,
  logoUrl: null,
  faviconUrl: null,
  accentColor: "#C8FF00",
  inkColor: "#0A0A0A",
  paperColor: "#F5F5F0",
  seoTitle: "OrbitSphere — Independent African Journalism",
  seoDescription:
    "OrbitSphere is Nigeria's premier digital newspaper — delivering fearless, intelligent journalism that keeps Africa informed, engaged, and empowered.",
  ogImageUrl: null,
  twitterUrl: "https://twitter.com/orbitsphere",
  facebookUrl: "https://facebook.com/orbitsphere",
  linkedinUrl: "https://linkedin.com/company/orbitsphere",
  youtubeUrl: null,
  instagramUrl: null,
  contactEmail: "hello@orbitsphere.ng",
  contactPhone: null,
  contactAddress: "Lagos, Nigeria",
};

export function serializeSiteBranding(row: SiteBranding): SiteBrandingData {
  return {
    siteNamePrimary: row.siteNamePrimary,
    siteNameAccent: row.siteNameAccent,
    siteTagline: row.siteTagline,
    mastheadLocations: row.mastheadLocations,
    siteDescription: row.siteDescription,
    footerDescription: row.footerDescription,
    newsletterHeading: row.newsletterHeading,
    newsletterDescription: row.newsletterDescription,
    newsletterTagline: row.newsletterTagline,
    copyrightName: row.copyrightName,
    copyrightYear: row.copyrightYear,
    logoUrl: row.logoUrl,
    faviconUrl: row.faviconUrl,
    accentColor: row.accentColor,
    inkColor: row.inkColor,
    paperColor: row.paperColor,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    ogImageUrl: row.ogImageUrl,
    twitterUrl: row.twitterUrl,
    facebookUrl: row.facebookUrl,
    linkedinUrl: row.linkedinUrl,
    youtubeUrl: row.youtubeUrl,
    instagramUrl: row.instagramUrl,
    contactEmail: row.contactEmail,
    contactPhone: row.contactPhone,
    contactAddress: row.contactAddress,
  };
}

async function fetchSiteBrandingFromDb(): Promise<SiteBrandingData> {
  try {
    const row = await db.siteBranding.findUnique({ where: { id: "default" } });
    if (!row) return DEFAULT_SITE_BRANDING;
    return serializeSiteBranding(row);
  } catch {
    return DEFAULT_SITE_BRANDING;
  }
}

export const getSiteBranding = unstable_cache(
  fetchSiteBrandingFromDb,
  ["site-branding"],
  { revalidate: 300, tags: ["site-branding"] }
);

export async function updateSiteBranding(
  data: Partial<SiteBrandingData>
): Promise<SiteBrandingData> {
  const row = await db.siteBranding.upsert({
    where: { id: "default" },
    create: { id: "default", ...DEFAULT_SITE_BRANDING, ...data },
    update: data,
  });
  return serializeSiteBranding(row);
}

export function brandingToMetadata(branding: SiteBrandingData) {
  return {
    title: {
      default: branding.seoTitle,
      template: `%s | ${branding.siteNamePrimary}${branding.siteNameAccent}`,
    },
    description: branding.seoDescription,
    openGraph: {
      type: "website" as const,
      locale: "en_NG",
      siteName: `${branding.siteNamePrimary}${branding.siteNameAccent} Newspaper`,
      title: branding.seoTitle,
      description: branding.seoDescription,
      ...(branding.ogImageUrl ? { images: [{ url: branding.ogImageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image" as const,
      title: branding.seoTitle,
      description: branding.seoDescription,
    },
  };
}
