import type { ArticleDetail, PublicArticle } from "@/lib/articles-db";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://orbitsphere.com";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "OrbitSphere",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://twitter.com/orbitsphere",
      "https://facebook.com/orbitsphere",
      "https://linkedin.com/company/orbitsphere",
    ],
    description:
      "Nigeria's premier digital newspaper — fearless, intelligent journalism for Africa.",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OrbitSphere",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function newsArticleJsonLd(article: ArticleDetail) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage ? [article.featuredImage] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "OrbitSphere",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: `${SITE_URL}/article/${article.slug}`,
    articleSection: article.category.name,
    keywords: article.tags.join(", "),
  };
}

export function itemListJsonLd(
  name: string,
  url: string,
  articles: PublicArticle[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url,
    numberOfItems: articles.length,
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/article/${article.slug}`,
      name: article.title,
    })),
  };
}

export function searchResultsJsonLd(query: string, articles: PublicArticle[]) {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: `Search results for "${query}"`,
    url: `${SITE_URL}/search?q=${encodeURIComponent(query)}`,
    mainEntity: itemListJsonLd(
      `Results for ${query}`,
      `${SITE_URL}/search?q=${encodeURIComponent(query)}`,
      articles
    ),
  };
}
