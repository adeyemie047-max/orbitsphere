import Link from "next/link";
import { getLegalContacts } from "@/lib/legal-contacts";

type LegalContactEmailProps = {
  kind: "privacy" | "legal" | "corrections" | "general";
  className?: string;
};

export default async function LegalContactEmail({
  kind,
  className = "text-gold hover:underline",
}: LegalContactEmailProps) {
  const contacts = await getLegalContacts();
  const email = contacts[kind];

  return (
    <a href={`mailto:${email}`} className={className}>
      {email}
    </a>
  );
}

export async function LegalContactBlock() {
  const contacts = await getLegalContacts();

  return (
    <p>
      Questions? Email{" "}
      <a href={`mailto:${contacts.general}`} className="text-gold hover:underline">
        {contacts.general}
      </a>
      {contacts.phone ? ` · ${contacts.phone}` : ""}
      {contacts.address ? ` · ${contacts.address}` : ""}
    </p>
  );
}
