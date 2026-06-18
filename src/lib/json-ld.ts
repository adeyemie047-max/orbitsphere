import type { ArticleDetail, PublicArticle } from "@/lib/articles-db";
import type { SiteBrandingData } from "@/lib/site-branding";
import { DEFAULT_SITE_BRANDING } from "@/lib/site-branding";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://orbitsphere.com";

function siteName(branding: SiteBrandingData) {
  return `${branding.siteNamePrimary}${branding.siteNameAccent}`;
}

export function organizationJsonLd(branding: SiteBrandingData = DEFAULT_SITE_BRANDING) {
  const sameAs = [
    branding.twitterUrl,
    branding.facebookUrl,
    branding.linkedinUrl,
    branding.youtubeUrl,
    branding.instagramUrl,
  ].filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: siteName(branding),
    url: SITE_URL,
    logo: branding.logoUrl ?? `${SITE_URL}/logo.png`,
    ...(sameAs.length > 0 ? { sameAs } : {}),
    description: branding.seoDescription,
  };
}

export function websiteJsonLd(branding: SiteBrandingData = DEFAULT_SITE_BRANDING) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName(branding),
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

export function newsArticleJsonLd(
  article: ArticleDetail,
  branding: SiteBrandingData = DEFAULT_SITE_BRANDING
) {
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
      name: siteName(branding),
      logo: {
        "@type": "ImageObject",
        url: branding.logoUrl ?? `${SITE_URL}/logo.png`,
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
