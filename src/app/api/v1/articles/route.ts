import { NextRequest, NextResponse } from "next/server";
import {
  articles as mockArticles,
  getArticleBySlug,
  searchArticles,
} from "@/lib/data";
import {
  getPublicArticleBySlug,
  getPublicArticles,
} from "@/lib/articles-db";

function mockPublicArticles(options: {
  limit: number;
  breaking?: boolean;
  trending?: boolean;
  featured?: boolean;
  query?: string;
}) {
  let result = mockArticles.filter((a) => a.status === "published");

  if (options.breaking) result = result.filter((a) => a.isBreaking);
  if (options.featured) result = result.filter((a) => a.isFeatured);
  if (options.trending) {
    result = [...result].sort((a, b) => b.viewsCount - a.viewsCount);
  }
  if (options.query) {
    result = searchArticles(options.query);
  }

  return result.slice(0, options.limit);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const q = searchParams.get("q");
  const breaking = searchParams.get("breaking") === "true";
  const trending = searchParams.get("trending") === "true";
  const featured = searchParams.get("featured") === "true";
  const categorySlug = searchParams.get("category") ?? undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);

  try {
    if (slug) {
      const article = await getPublicArticleBySlug(slug);
      if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
      }
      return NextResponse.json({ data: article });
    }

    const data = await getPublicArticles({
      limit,
      breaking,
      trending,
      featured,
      categorySlug,
      query: q ?? undefined,
    });

    return NextResponse.json({ data, total: data.length, source: "database" });
  } catch {
    if (slug) {
      const article = getArticleBySlug(slug);
      if (!article || article.status !== "published") {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
      }
      return NextResponse.json({ data: article, source: "mock" });
    }

    const data = mockPublicArticles({
      limit,
      breaking,
      trending,
      featured,
      query: q ?? undefined,
    });

    return NextResponse.json({ data, total: data.length, source: "mock" });
  }
}
