import { NextRequest, NextResponse } from "next/server";
import { getPollByArticleSlug } from "@/lib/polls";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const voterKey = request.headers.get("x-voter-key") ?? undefined;

  try {
    const poll = await getPollByArticleSlug(slug, voterKey ?? undefined);
    if (!poll) {
      return NextResponse.json({ data: null });
    }
    return NextResponse.json({ data: poll });
  } catch {
    return NextResponse.json({ data: null, source: "mock" });
  }
}
