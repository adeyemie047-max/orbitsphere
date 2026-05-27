import { NextRequest, NextResponse } from "next/server";
import { searchPublicArticles } from "@/lib/search";

/** PRD §7 — GET /api/v1/articles/search?q= */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "24", 10), 100);

  if (!q.trim()) {
    return NextResponse.json(
      { error: "Query parameter q is required" },
      { status: 400 }
    );
  }

  const { results, total, source, query } = await searchPublicArticles(q, limit);

  return NextResponse.json({ data: results, total, query, source });
}
