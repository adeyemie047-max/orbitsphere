import { getSiteBranding } from "@/lib/site-branding";

export type LegalContacts = {
  privacy: string;
  legal: string;
  corrections: string;
  general: string;
  phone: string | null;
  address: string | null;
};

export async function getLegalContacts(): Promise<LegalContacts> {
  const branding = await getSiteBranding();
  const general = branding.contactEmail ?? "hello@orbitsphere.ng";
  const domain = general.includes("@") ? general.split("@")[1]! : "orbitsphere.ng";

  return {
    privacy: `privacy@${domain}`,
    legal: `legal@${domain}`,
    corrections: `corrections@${domain}`,
    general,
    phone: branding.contactPhone,
    address: branding.contactAddress,
  };
}
