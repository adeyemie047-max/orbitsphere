import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import { getSiteBranding } from "@/lib/site-branding";

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getSiteBranding();
  const siteName = `${branding.siteNamePrimary}${branding.siteNameAccent}`;
  return {
    title: `About ${siteName}`,
    description: branding.siteDescription.slice(0, 160),
  };
}

export default async function AboutPage() {
  const branding = await getSiteBranding();
  const siteName = `${branding.siteNamePrimary}${branding.siteNameAccent}`;
  const paragraphs = branding.siteDescription.split(/\n\n+/).filter(Boolean);

  return (
    <div className="container-main py-[80px] max-w-3xl">
      <div className="gold-rule" />
      <h1 className="font-[family-name:var(--font-serif)] text-[36px] md:text-[48px] font-black text-foreground mb-6">
        About {siteName}
      </h1>
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph.slice(0, 40)}
          className="text-[17px] text-text-secondary leading-[1.82] mb-6 last:mb-8"
        >
          {paragraph}
        </p>
      ))}
      {(branding.contactEmail || branding.contactPhone || branding.contactAddress) && (
        <div className="mb-8 p-6 bg-surface-2 border border-border rounded-[14px] space-y-2">
          <h2 className="font-ui text-xs font-bold uppercase tracking-wide text-text-muted mb-3">
            Contact
          </h2>
          {branding.contactEmail && (
            <p className="text-sm text-text-secondary">
              Email:{" "}
              <a href={`mailto:${branding.contactEmail}`} className="text-gold hover:underline">
                {branding.contactEmail}
              </a>
            </p>
          )}
          {branding.contactPhone && (
            <p className="text-sm text-text-secondary">Phone: {branding.contactPhone}</p>
          )}
          {branding.contactAddress && (
            <p className="text-sm text-text-secondary whitespace-pre-line">
              {branding.contactAddress}
            </p>
          )}
        </div>
      )}
      <div className="flex gap-4 flex-wrap">
        <Button href="/">Back to Home</Button>
        <Button href="/search" variant="outline">
          Browse Stories
        </Button>
      </div>
    </div>
  );
}
