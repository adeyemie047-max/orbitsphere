import LegalPageLayout, { legalMetadata } from "@/components/legal/LegalPageLayout";

export const metadata = legalMetadata(
  "Corrections Policy",
  "How OrbitSphere handles factual errors and editorial corrections."
);

export default function CorrectionsPage() {
  return (
    <LegalPageLayout
      title="Corrections Policy"
      description="Accuracy is central to our journalism. We correct errors promptly and transparently."
      lastUpdated="27 May 2026"
    >
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">Reporting an error</h2>
        <p>
          If you believe we published inaccurate information, email{" "}
          <a href="mailto:corrections@orbitsphere.ng" className="text-gold hover:underline">
            corrections@orbitsphere.ng
          </a>{" "}
          with the article URL, the disputed passage, and supporting evidence. Our standards
          desk reviews all requests within two business days.
        </p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">How we correct</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-foreground">Minor clarifications</strong> — updated inline with
            an editor&apos;s note at the foot of the article
          </li>
          <li>
            <strong className="text-foreground">Material errors</strong> — corrected text plus a
            visible correction notice with date and summary of the change
          </li>
          <li>
            <strong className="text-foreground">Retractions</strong> — article removed or replaced
            with a full explanation when content cannot be fairly corrected
          </li>
        </ul>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">Social and syndication</h2>
        <p>
          When a significant correction is made, we update social posts where practicable and
          notify partner outlets that syndicated the original story.
        </p>
      </section>
    </LegalPageLayout>
  );
}
