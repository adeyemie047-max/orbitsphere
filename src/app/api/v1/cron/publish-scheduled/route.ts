import { NextRequest, NextResponse } from "next/server";
import { publishScheduledArticles } from "@/lib/articles-admin";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 503 }
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const published = await publishScheduledArticles();
    return NextResponse.json({
      success: true,
      published,
      ranAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to publish scheduled articles" },
      { status: 503 }
    );
  }
}
