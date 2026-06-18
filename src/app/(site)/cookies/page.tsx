import LegalPageLayout, { legalMetadata } from "@/components/legal/LegalPageLayout";
import LegalEmailLink from "@/components/legal/LegalEmailLink";
import { getLegalContacts } from "@/lib/legal-contacts";

export const metadata = legalMetadata(
  "Cookie Policy",
  "How OrbitSphere uses cookies and similar technologies."
);

export default async function CookiesPage() {
  const contacts = await getLegalContacts();

  return (
    <LegalPageLayout
      title="Cookie Policy"
      description="This policy explains what cookies we use and how you can control them."
      lastUpdated="27 May 2026"
    >
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">What are cookies?</h2>
        <p>
          Cookies are small text files stored on your device. They help us keep you signed in,
          remember preferences, and understand how the site is used.
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">Cookies we use</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border border-border rounded-lg">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                <th className="p-3 font-ui font-semibold text-foreground">Type</th>
                <th className="p-3 font-ui font-semibold text-foreground">Purpose</th>
                <th className="p-3 font-ui font-semibold text-foreground">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-3">Essential</td>
                <td className="p-3">Authentication session (Auth.js)</td>
                <td className="p-3">Session / 30 days</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3">Functional</td>
                <td className="p-3">Theme preference, cookie consent</td>
                <td className="p-3">1 year</td>
              </tr>
              <tr>
                <td className="p-3">Analytics</td>
                <td className="p-3">Aggregated traffic and performance (when enabled)</td>
                <td className="p-3">Up to 13 months</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">Managing cookies</h2>
        <p>
          You can block or delete cookies in your browser settings. Essential cookies are
          required for sign-in. Disabling analytics cookies does not affect core reading
          features.
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">Contact</h2>
        <p>
          Cookie questions: <LegalEmailLink email={contacts.privacy} />
        </p>
      </section>
    </LegalPageLayout>
  );
}
