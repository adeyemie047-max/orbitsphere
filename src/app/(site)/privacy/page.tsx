import LegalPageLayout, { legalMetadata } from "@/components/legal/LegalPageLayout";
import LegalEmailLink from "@/components/legal/LegalEmailLink";
import { getLegalContacts } from "@/lib/legal-contacts";

export const metadata = legalMetadata(
  "Privacy Policy",
  "How OrbitSphere collects, uses, and protects your personal information."
);

export default async function PrivacyPage() {
  const contacts = await getLegalContacts();

  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="OrbitSphere Media Limited is committed to protecting your privacy in line with the Nigeria Data Protection Act (NDPA) 2023 and applicable international standards."
      lastUpdated="27 May 2026"
    >
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">Information we collect</h2>
        <p>
          When you register, subscribe, comment, or submit a citizen story, we may collect your
          name, email address, username, and content you provide. We also collect usage data such
          as pages viewed, device type, and approximate location derived from IP address for
          analytics and security.
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">How we use your data</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Deliver and personalise news content, bookmarks, and notifications</li>
          <li>Moderate comments and review citizen journalism submissions</li>
          <li>Send newsletters and breaking news alerts (with your consent)</li>
          <li>Improve site performance and prevent abuse</li>
        </ul>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">Data sharing</h2>
        <p>
          We do not sell personal data. We share information only with service providers
          (hosting, email, analytics) under contract, or when required by law. Editorial
          accounts are managed separately from reader profiles.
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">Your rights</h2>
        <p>
          You may request access, correction, or deletion of your account data by contacting{" "}
          <LegalEmailLink email={contacts.privacy} />
          . You can unsubscribe from marketing emails at any time.
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">Retention</h2>
        <p>
          Account data is retained while your account is active. Server logs are retained for up
          to 90 days. Published comments may remain anonymised after account deletion where
          editorial integrity requires it.
        </p>
      </section>
    </LegalPageLayout>
  );
}
