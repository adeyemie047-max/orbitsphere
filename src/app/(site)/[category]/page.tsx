import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/article/ArticleCard";
import MiniCard from "@/components/article/MiniCard";
import Button from "@/components/ui/Button";
import NewsletterForm from "@/components/shared/NewsletterForm";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/json-ld";
import {
  getAllCategorySlugs,
  getCachedCategoryPageData,
} from "@/lib/category-page-data";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://orbitsphere.com";

/** PRD §8.2 — category pages with ISR. */
export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  return getAllCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const data = await getCachedCategoryPageData(slug, 1);
  if (!data) return { title: "Category Not Found" };
  return {
    title: data.category.name,
    description: data.category.description ?? undefined,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category: slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const data = await getCachedCategoryPageData(slug, page);
  if (!data) notFound();

  const { category, featured, gridArticles, trending, popularTags, pagination } =
    data;

  if (!featured && gridArticles.length === 0) {
    return (
      <div className="container-main py-20 text-center">
        <span className="text-4xl mb-4 block">{category.icon}</span>
        <h1 className="section-title mb-4">{category.name}</h1>
        <p className="text-text-secondary">No articles in this category yet.</p>
      </div>
    );
  }

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: category.name, url: `${SITE_URL}/${category.slug}` },
          ]),
          itemListJsonLd(
            `${category.name} Articles`,
            `${SITE_URL}/${category.slug}`,
            [featured, ...gridArticles].filter(Boolean) as NonNullable<typeof featured>[]
          ),
        ]}
      />
      <div className="container-main py-8 sm:py-12 lg:py-16">
      <header className="mb-8 sm:mb-12">
        <div className="gold-rule" />
        <div className="flex items-start gap-4 mt-2">
          <span className="text-4xl" aria-hidden>
            {category.icon}
          </span>
          <div>
            <h1 className="font-serif text-[28px] sm:text-[36px] md:text-[48px] font-black text-foreground mb-3">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-[15px] text-text-muted max-w-xl leading-[1.7]">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 lg:gap-12">
        <div>
          {featured && page === 1 && <ArticleCard article={featured} />}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${featured && page === 1 ? "mt-8" : ""}`}
          >
            {gridArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <nav
              className="flex items-center justify-center gap-3 mt-12"
              aria-label="Pagination"
            >
              {page > 1 && (
                <Button
                  href={`/${slug}?page=${page - 1}`}
                  variant="outline"
                  size="sm"
                >
                  ← Previous
                </Button>
              )}
              <span className="font-ui text-sm text-text-muted">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              {page < pagination.totalPages && (
                <Button
                  href={`/${slug}?page=${page + 1}`}
                  variant="outline"
                  size="sm"
                >
                  Next →
                </Button>
              )}
            </nav>
          )}
        </div>

        <aside>
          <div className="bg-surface border border-border rounded-lg sm:rounded-[14px] p-5 sm:p-6 mb-6 xl:sticky xl:top-24">
            <h3 className="font-serif text-lg font-bold text-foreground mb-5 pb-3 border-b border-border">
              Trending in {category.name}
            </h3>
            {trending.map((article) => (
              <MiniCard key={article.id} article={article} showCategory={false} />
            ))}
          </div>

          {popularTags.length > 0 && (
            <div className="bg-surface border border-border rounded-lg sm:rounded-[14px] p-5 sm:p-6 mb-6">
              <h3 className="font-serif text-lg font-bold text-foreground mb-4 pb-3 border-b border-border">
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/search?q=${encodeURIComponent(tag.name)}`}
                    className="font-ui text-[11px] font-medium px-3 py-1.5 rounded-full bg-surface-2 border border-border text-text-secondary hover:text-[var(--ds-accent)] hover:border-[var(--ds-accent)] transition-all"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="bg-surface-2 border border-border rounded-lg sm:rounded-[14px] p-5 sm:p-6">
            <h3 className="font-serif text-lg font-bold text-[var(--ds-accent)] mb-4">
              Newsletter
            </h3>
            <p className="text-[13px] text-text-secondary leading-[1.6] mb-4">
              Get the best of {category.name} delivered to your inbox.
            </p>
            <NewsletterForm compact />
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}
