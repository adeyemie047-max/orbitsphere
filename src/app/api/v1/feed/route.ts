import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPersonalizedFeed } from "@/lib/feed";
import { getFeedPreferences, setFeedPreferences } from "@/lib/users";
import { isUserSession, requireUserSession } from "@/lib/api-auth";
import { parseJsonBody, parsePagination } from "@/lib/api-admin";

const preferencesSchema = z.object({
  categoryIds: z.array(z.string().uuid()),
});

export async function GET(request: NextRequest) {
  const session = await requireUserSession();
  if (!isUserSession(session)) return session;

  const { searchParams } = new URL(request.url);
  const { limit } = parsePagination(searchParams);

  try {
    const [articles, preferences] = await Promise.all([
      getPersonalizedFeed(session.userId, limit),
      getFeedPreferences(session.userId),
    ]);
    return NextResponse.json({
      data: articles,
      preferences,
      total: articles.length,
    });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await requireUserSession();
  if (!isUserSession(session)) return session;

  const body = await parseJsonBody<unknown>(request);
  if (body instanceof NextResponse) return body;

  const parsed = preferencesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  try {
    const preferences = await setFeedPreferences(
      session.userId,
      parsed.data.categoryIds
    );
    return NextResponse.json({ data: preferences });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
