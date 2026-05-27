import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-main py-[120px] text-center">
      <div className="gold-rule mx-auto" />
      <h1 className="font-[family-name:var(--font-serif)] text-[64px] font-black text-gold mb-4">
        404
      </h1>
      <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-white mb-4">
        Page Not Found
      </h2>
      <p className="text-text-secondary mb-8 max-w-md mx-auto">
        The story you&apos;re looking for may have moved or no longer exists.
      </p>
      <Button href="/">Back to Homepage</Button>
    </div>
  );
}
