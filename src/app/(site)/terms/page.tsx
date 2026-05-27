import LegalPageLayout, { legalMetadata } from "@/components/legal/LegalPageLayout";

export const metadata = legalMetadata(
  "Terms of Use",
  "Terms governing your use of OrbitSphere's website and services."
);

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Use"
      description="By accessing OrbitSphere you agree to these terms. Please read them carefully."
      lastUpdated="27 May 2026"
    >
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">Acceptance</h2>
        <p>
          These Terms govern your use of orbitsphere.ng and related services operated by
          OrbitSphere Media Limited. If you do not agree, please do not use the site.
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">Content and copyright</h2>
        <p>
          All articles, images, logos, and design elements are owned by OrbitSphere or its
          licensors unless otherwise credited. You may share links to articles for personal,
          non-commercial use. Republication requires written permission.
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">User conduct</h2>
        <p>
          You must not post unlawful, defamatory, or harassing content; attempt to disrupt the
          service; scrape content at scale; or impersonate others. We may remove content and
          suspend accounts that violate these rules.
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">Citizen submissions</h2>
        <p>
          By submitting a story you grant OrbitSphere a non-exclusive licence to review, edit,
          and publish your submission. You confirm the material is original and does not
          infringe third-party rights.
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">Disclaimer</h2>
        <p>
          News content is provided for information purposes. OrbitSphere is not liable for
          decisions made based on published material. The service is provided &ldquo;as is&rdquo;
          without warranties beyond those required by law.
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">Contact</h2>
        <p>
          Questions about these Terms:{" "}
          <a href="mailto:legal@orbitsphere.ng" className="text-gold hover:underline">
            legal@orbitsphere.ng
          </a>
        </p>
      </section>
    </LegalPageLayout>
  );
}
