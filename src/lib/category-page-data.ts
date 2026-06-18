import { unstable_cache } from "next/cache";
import {
  categories as mockCategories,
  getArticlesByCategory,
  getCategoryBySlug,
  getTrendingArticles,
  articles as mockArticles,
  articleFeaturedImages,
} from "@/lib/data";
import type { Article, CategorySlug } from "@/lib/types";
import {
  getCategoryArticlesPaginated,
  getPopularTagsForCategory,
  getPublicArticles,
  getPublicCategoryBySlug,
  type PublicArticle,
} from "@/lib/articles-db";

const MOCK_CAPTIONS: Record<string, string> = Object.fromEntries(
  mockArticles
    .filter((a) => a.imageCaption)
    .map((a) => [a.slug, a.imageCaption!])
);

const MOCK_AI: Record<string, string[]> = Object.fromEntries(
  mockArticles
    .filter((a) => a.aiSummary?.length)
    .map((a) => [a.slug, a.aiSummary!])
);

import { resolveCategoryIconKey } from "@/components/ui/CategoryIcon";

export type CategoryPageData = {
  source: "database" | "mock";
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string;
    color: string | null;
  };
  featured: PublicArticle | null;
  gridArticles: PublicArticle[];
  trending: PublicArticle[];
  popularTags: { name: string; slug: string }[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};

function mockToPublic(article: Article): PublicArticle {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    body: article.body,
    featuredImage:
      articleFeaturedImages[article.slug] ?? article.featuredImage ?? "",
    author: {
      id: article.author.id,
      name: article.author.name,
      username: null,
      role: "journalist" as PublicArticle["author"]["role"],
      initials: article.author.initials,
    },
    category: {
      id: article.category.id,
      name: article.category.name,
      slug: article.category.slug,
      description: article.category.description,
      color: article.category.color,
    },
    status: article.status,
    isBreaking: article.isBreaking,
    isFeatured: article.isFeatured,
    isInvestigative: article.isInvestigative,
    isLiveBlog: article.isLiveBlog ?? false,
    viewsCount: article.viewsCount,
    readTime: article.readTime,
    publishedAt: article.publishedAt,
    tags: article.tags,
  };
}

function getMockCategoryPage(slug: string, page: number): CategoryPageData | null {
  const category = getCategoryBySlug(slug);
  if (!category) return null;

  const perPage = 12;
  const all = getArticlesByCategory(slug as CategorySlug).map(mockToPublic);
  const total = all.length;
  const offset = (page - 1) * perPage;
  const pageArticles = all.slice(offset, offset + perPage);
  const featured = page === 1 ? pageArticles[0] ?? null : null;
  const gridArticles = page === 1 ? pageArticles.slice(1) : pageArticles;

  const tagCounts = new Map<string, number>();
  all.forEach((a) =>
    a.tags.forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1))
  );
  const popularTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name]) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    }));

  const trending = getTrendingArticles(5)
    .filter((a) => a.category.slug === slug)
    .map(mockToPublic);

  return {
    source: "mock",
    category: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: resolveCategoryIconKey(category.slug),
      color: category.color,
    },
    featured,
    gridArticles,
    trending: trending.length > 0 ? trending : all.slice(0, 4),
    popularTags,
    pagination: {
      page,
      perPage,
      total,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    },
  };
}

async function fetchCategoryPage(
  slug: string,
  page: number
): Promise<CategoryPageData | null> {
  const category = await getPublicCategoryBySlug(slug);
  if (!category) return null;

  const perPage = 12;
  const [{ articles, total, totalPages }, trending, popularTags] =
    await Promise.all([
      getCategoryArticlesPaginated(slug, page, perPage),
      getPublicArticles({
        categorySlug: slug,
        trending: true,
        limit: 5,
      }),
      getPopularTagsForCategory(slug),
    ]);

  const featured = page === 1 ? articles[0] ?? null : null;
  const gridArticles = page === 1 ? articles.slice(1) : articles;

  return {
    source: "database",
    category: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: resolveCategoryIconKey(category.slug, category.icon),
      color: category.color,
    },
    featured,
    gridArticles,
    trending: trending.length > 0 ? trending : articles.slice(0, 4),
    popularTags,
    pagination: { page, perPage, total, totalPages },
  };
}

export async function getCategoryPageData(
  slug: string,
  page = 1
): Promise<CategoryPageData | null> {
  const safePage = Math.max(1, page);
  try {
    return await fetchCategoryPage(slug, safePage);
  } catch {
    return getMockCategoryPage(slug, safePage);
  }
}

export const getCachedCategoryPageData = (
  slug: string,
  page: number
) =>
  unstable_cache(
    () => getCategoryPageData(slug, page),
    [`category-page-${slug}-${page}`],
    { revalidate: 60, tags: ["articles", `category-${slug}`] }
  )();

export function getAllCategorySlugs() {
  return mockCategories.map((c) => c.slug);
}

export function mockToPublicFromArticle(article: Article): PublicArticle {
  return mockToPublic(article);
}

export { MOCK_AI, MOCK_CAPTIONS };
export { deriveAiSummary } from "@/lib/ai-summary";
