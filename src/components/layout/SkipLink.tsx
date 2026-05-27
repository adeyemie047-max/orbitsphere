export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--ds-accent)] focus:text-white focus:font-ui focus:text-sm focus:font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--ds-accent-light)]"
    >
      Skip to main content
    </a>
  );
}
