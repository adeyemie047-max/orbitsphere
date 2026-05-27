import { NextResponse } from "next/server";
import { getPublicArticles } from "@/lib/articles-db";

export async function GET() {
  try {
    const data = await getPublicArticles({ trending: true, limit: 20 });
    return NextResponse.json({ data, total: data.length, source: "database" });
  } catch {
    const { getTrendingArticles } = await import("@/lib/data");
    const { mockToPublicFromArticle } = await import("@/lib/category-page-data");
    const data = getTrendingArticles(20).map(mockToPublicFromArticle);
    return NextResponse.json({ data, total: data.length, source: "mock" });
  }
}
