import type { SiteBrandingData } from "@/lib/site-branding";

export default function BrandingStyles({ branding }: { branding: SiteBrandingData }) {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `.site-public {
          --ds-accent: ${branding.accentColor};
          --ds-ink: ${branding.inkColor};
          --ds-paper: ${branding.paperColor};
        }`,
      }}
    />
  );
}
