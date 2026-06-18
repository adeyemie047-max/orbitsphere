import Button from "@/components/ui/Button";
import NewsletterUnsubscribeForm from "@/components/shared/NewsletterUnsubscribeForm";

export const metadata = {
  title: "Unsubscribe from Newsletter",
};

export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="container-main py-16 max-w-md">
      <div className="gold-rule" />
      <h1 className="font-serif text-3xl font-black text-foreground mb-4">
        Newsletter
      </h1>

      {params.success === "1" ? (
        <p className="font-ui text-sm text-emerald-600 dark:text-emerald-400 mb-6" role="status">
          You have been unsubscribed from the OrbitSphere newsletter.
        </p>
      ) : params.error ? (
        <p className="font-ui text-sm text-breaking mb-6" role="alert">
          Unable to unsubscribe automatically. Please use the form below.
        </p>
      ) : (
        <p className="font-ui text-sm text-text-secondary mb-6 leading-relaxed">
          Enter your email to unsubscribe from the OrbitSphere briefing.
        </p>
      )}

      <NewsletterUnsubscribeForm />
      <div className="mt-8">
        <Button href="/" variant="outline" size="sm">
          Back to home
        </Button>
      </div>
    </div>
  );
}
