type LegalEmailLinkProps = {
  email: string;
};

export default function LegalEmailLink({ email }: LegalEmailLinkProps) {
  return (
    <a href={`mailto:${email}`} className="text-gold hover:underline">
      {email}
    </a>
  );
}
