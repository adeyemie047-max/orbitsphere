import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { trackAdClick, trackAdImpression } from "@/lib/ad-tracking";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

type RouteContext = { params: Promise<{ id: string }> };

const trackSchema = z.object({
  event: z.enum(["impression", "click"]),
});

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(id)) {
    return NextResponse.json({ error: "Invalid ad id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = trackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  const scope =
    parsed.data.event === "impression" ? `ads:impression:${id}` : `ads:click:${id}`;
  const maxAttempts = parsed.data.event === "impression" ? 5 : 3;
  const rate = checkRateLimit(request, scope, maxAttempts, 60_000);
  if (!rate.allowed && rate.retryAfterSeconds) {
    return rateLimitResponse(rate.retryAfterSeconds);
  }

  try {
    const tracked =
      parsed.data.event === "impression"
        ? await trackAdImpression(id)
        : await trackAdClick(id);

    if (!tracked) {
      return NextResponse.json({ error: "Ad not found or inactive" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to record event" }, { status: 503 });
  }
}
