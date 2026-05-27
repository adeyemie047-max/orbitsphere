export default function DashboardMediaPage() {
  return (
    <main className="p-6 lg:p-8 overflow-y-auto">
      <div className="gold-rule" />
      <h1 className="font-[family-name:var(--font-serif)] text-[28px] font-black text-white mb-2">
        Media Library
      </h1>
      <p className="font-[family-name:var(--font-ui)] text-sm text-text-muted max-w-lg">
        Upload and manage images, videos, and documents for articles.
      </p>
      <div className="mt-8 p-8 bg-surface border border-white/6 rounded-[14px] text-center">
        <p className="text-text-secondary text-sm">
          This section will be available in a future release with full backend integration.
        </p>
      </div>
    </main>
  );
}
