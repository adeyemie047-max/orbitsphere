import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryIcon from "@/components/ui/CategoryIcon";
import ArticleCard from "@/components/article/ArticleCard";
import MiniCard from "@/components/article/MiniCard";
import Button from "@/components/ui/Button";
import NewsletterCompactForm from "@/components/shared/NewsletterCompactForm";
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
        <CategoryIcon name={category.icon} size={20} className="mx-auto mb-4 text-[var(--ds-text-muted)]" />
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
      <div className="container-main py-8 sm:py-10 lg:py-14">
      <header className="page-header">
        <div className="gold-rule" />
        <p className="page-header__eyebrow">
          <CategoryIcon name={category.icon} size={14} className="text-[var(--ds-text-muted)]" />
          <span>Section</span>
        </p>
        <h1 className="page-header__title">{category.name}</h1>
        {category.description && (
          <p className="page-header__desc">{category.description}</p>
        )}
      </header>

      <div className="page-with-sidebar">
        <div className="page-with-sidebar__content">
          {featured && page === 1 && <ArticleCard article={featured} featured />}
          <div
            className={`editorial-grid editorial-grid--lift reveal-stagger grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 ${featured && page === 1 ? "mt-8" : ""}`}
          >
            {gridArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <nav
              className="flex flex-wrap items-center justify-center gap-3 mt-12"
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

        <aside className="page-with-sidebar__rail">
          <div className="sidebar-panel">
            <h3 className="sidebar-panel__title">Trending in {category.name}</h3>
            {trending.map((article) => (
              <MiniCard key={article.id} article={article} showCategory={false} />
            ))}
          </div>

          {popularTags.length > 0 && (
            <div className="sidebar-panel">
              <h3 className="sidebar-panel__title">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/search?q=${encodeURIComponent(tag.name)}`}
                    className="font-ui text-[11px] font-medium px-3 py-1.5 rounded-full bg-surface-2 border border-border text-text-secondary hover:text-[var(--ds-ink)] hover:border-[var(--ds-ink)] transition-all"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="sidebar-panel sidebar-panel--accent">
            <h3 className="sidebar-panel__title">Newsletter</h3>
            <p className="text-[13px] text-text-secondary leading-[1.6] mb-4">
              Get the best of {category.name} delivered to your inbox.
            </p>
            <NewsletterCompactForm />
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}
