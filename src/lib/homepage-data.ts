import { unstable_cache } from "next/cache";
import {
  articles as mockArticles,
  breakingHeadlines as mockBreaking,
  getArticlesByCategory,
  getFeaturedArticle,
  getLatestArticles,
  getTrendingArticles,
  videoStories,
  articleFeaturedImages,
} from "@/lib/data";
import type { Article } from "@/lib/types";
import { UserRole } from "@prisma/client";
import {
  getActiveAdvertisements,
  getBreakingHeadlines,
  getPublicArticles,
  type BreakingHeadlineItem,
  type PublicArticle,
} from "@/lib/articles-db";
import type { Advertisement } from "@prisma/client";

export type CategorySectionData = {
  category: PublicArticle["category"];
  featured: PublicArticle;
  articles: PublicArticle[];
};

export type HomepageData = {
  source: "database" | "mock";
  breaking: BreakingHeadlineItem[];
  featured: PublicArticle;
  subHero: PublicArticle[];
  trending: PublicArticle[];
  latest: PublicArticle[];
  politics: CategorySectionData;
  business: CategorySectionData;
  technology: CategorySectionData;
  opinion: PublicArticle[];
  videos: typeof videoStories;
  ads: {
    banner: Advertisement | null;
    rectangle: Advertisement | null;
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
      role: UserRole.journalist,
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

function buildCategorySection(
  slug: "politics" | "business" | "technology"
): CategorySectionData {
  const items = getArticlesByCategory(slug).map(mockToPublic);
  const [featured, ...rest] = items;

  return {
    category: featured.category,
    featured,
    articles: rest.slice(0, 4),
  };
}

function getMockOpinionArticles(limit = 4): PublicArticle[] {
  return getArticlesByCategory("opinion")
    .concat(getArticlesByCategory("lifestyle").slice(0, 1))
    .slice(0, limit)
    .map(mockToPublic);
}

function getMockHomepageData(): HomepageData {
  const featured = mockToPublic(getFeaturedArticle());
  const latest = getLatestArticles(6).map(mockToPublic);

  return {
    source: "mock",
    breaking: mockBreaking.map((item) => ({
      id: item.id,
      text: item.text,
      slug: item.slug ?? "",
    })),
    featured,
    subHero: mockArticles
      .filter((a) => a.id !== featured.id && a.featuredImage)
      .slice(0, 2)
      .map(mockToPublic),
    trending: getTrendingArticles(8).map(mockToPublic),
    latest,
    politics: buildCategorySection("politics"),
    business: buildCategorySection("business"),
    technology: buildCategorySection("technology"),
    opinion: getMockOpinionArticles(4),
    videos: videoStories,
    ads: { banner: null, rectangle: null },
  };
}

async function buildCategorySectionFromDb(
  slug: "politics" | "business" | "technology"
): Promise<CategorySectionData> {
  const items = await getPublicArticles({ categorySlug: slug, limit: 5 });
  const [featured, ...rest] = items;

  if (!featured) {
    throw new Error(`No articles for category: ${slug}`);
  }

  return {
    category: featured.category,
    featured,
    articles: rest.slice(0, 4),
  };
}

async function fetchHomepageData(): Promise<HomepageData> {
  const [
    breaking,
    featuredList,
    trending,
    latest,
    politics,
    business,
    technology,
    opinionArticles,
    lifestyleArticles,
    bannerAds,
    sidebarAds,
  ] = await Promise.all([
    getBreakingHeadlines(8),
    getPublicArticles({ featured: true, limit: 1 }),
    getPublicArticles({ trending: true, limit: 8 }),
    getPublicArticles({ limit: 6 }),
    buildCategorySectionFromDb("politics"),
    buildCategorySectionFromDb("business"),
    buildCategorySectionFromDb("technology"),
    getPublicArticles({ categorySlug: "opinion", limit: 3 }),
    getPublicArticles({ categorySlug: "lifestyle", limit: 1 }),
    getActiveAdvertisements("banner"),
    getActiveAdvertisements("sidebar"),
  ]);

  let featured =
    featuredList[0] ??
    trending[0] ??
    latest[0];

  if (!featured) {
    throw new Error("No published articles available");
  }

  const subHero = latest
    .filter((a) => a.id !== featured.id && a.featuredImage)
    .slice(0, 2);

  let opinion =
    opinionArticles.length >= 3
      ? opinionArticles
      : [...opinionArticles, ...lifestyleArticles].slice(0, 4);

  if (opinion.length === 0) {
    opinion = getMockOpinionArticles(4);
  }

  return {
    source: "database",
    breaking,
    featured,
    subHero,
    trending,
    latest: latest.filter((a) => a.id !== featured.id).slice(0, 6),
    politics,
    business,
    technology,
    opinion,
    videos: videoStories,
    ads: {
      banner: bannerAds[0] ?? null,
      rectangle: sidebarAds[0] ?? null,
    },
  };
}

export async function getHomepageData(): Promise<HomepageData> {
  try {
    return await fetchHomepageData();
  } catch {
    return getMockHomepageData();
  }
}

export const getCachedHomepageData = unstable_cache(
  getHomepageData,
  ["homepage-data"],
  { revalidate: 60, tags: ["homepage"] }
);

export const getCachedBreakingHeadlines = unstable_cache(
  async () => {
    try {
      return await getBreakingHeadlines(8);
    } catch {
      return mockBreaking.map((item) => ({
        id: item.id,
        text: item.text,
        slug: item.slug ?? "",
      }));
    }
  },
  ["breaking-headlines"],
  { revalidate: 60, tags: ["breaking-headlines"] }
);
