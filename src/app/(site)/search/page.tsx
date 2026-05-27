import type { Metadata } from "next";
import ArticleCard from "@/components/article/ArticleCard";
import JsonLd from "@/components/seo/JsonLd";
import { searchResultsJsonLd } from "@/lib/json-ld";
import { searchPublicArticles } from "@/lib/search";

export const metadata: Metadata = {
  title: "Search",
  description: "Search OrbitSphere for news, analysis, and stories across Africa.",
  robots: { index: true, follow: true },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const { results, total, source } = query
    ? await searchPublicArticles(query, 24)
    : { results: [], total: 0, source: "mock" as const };

  return (
    <>
      {query && results.length > 0 && (
        <JsonLd data={searchResultsJsonLd(query, results)} />
      )}
      <div className="container-main py-8 sm:py-12 lg:py-16">
        <div className="mb-8 sm:mb-10">
          <div className="gold-rule" />
          <h1 className="section-title mb-3">Search</h1>
          <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-3 max-w-xl mt-6">
            <input
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search articles, topics, authors…"
              className="flex-1 bg-surface-2 border border-border rounded-full px-5 sm:px-6 py-3 font-ui text-sm text-foreground outline-none focus:border-[var(--ds-accent)]"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--ds-accent)] text-white font-ui text-[13px] font-semibold cursor-pointer hover:bg-[var(--ds-accent-hover)] transition-all"
            >
              Search
            </button>
          </form>
        </div>

        {query && (
          <p className="font-ui text-sm text-text-muted mb-8">
            {total} result{total !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            {source === "mock" && (
              <span className="text-text-muted/60"> (offline index)</span>
            )}
          </p>
        )}

        {!query && (
          <p className="text-text-secondary">
            Enter a search term to find articles across OrbitSphere.
          </p>
        )}

        {query && results.length === 0 && (
          <p className="text-text-secondary">
            No articles found. Try different keywords or browse our categories.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </>
  );
}
