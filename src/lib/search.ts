import { getPublicArticles, type PublicArticle } from "@/lib/articles-db";
import { searchArticles as mockSearchArticles } from "@/lib/data";
import { mockToPublicFromArticle } from "@/lib/category-page-data";

export type SearchResult = {
  results: PublicArticle[];
  total: number;
  source: "database" | "mock";
  query: string;
};

export async function searchPublicArticles(
  query: string,
  limit = 24
): Promise<SearchResult> {
  const q = query.trim();
  if (!q) {
    return { results: [], total: 0, source: "mock", query: q };
  }

  try {
    const results = await getPublicArticles({ query: q, limit });
    return {
      results,
      total: results.length,
      source: "database",
      query: q,
    };
  } catch {
    const results = mockSearchArticles(q)
      .filter((a) => a.status === "published")
      .slice(0, limit)
      .map(mockToPublicFromArticle);

    return {
      results,
      total: results.length,
      source: "mock",
      query: q,
    };
  }
}
