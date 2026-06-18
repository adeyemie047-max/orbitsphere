import { NextRequest, NextResponse } from "next/server";
import { createAdvertiseInquiry } from "@/lib/admin-ads";
import { advertiseInquirySchema } from "@/lib/admin-schemas";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(request, "advertise:inquiry", 3, 60 * 60 * 1000);
  if (!rate.allowed && rate.retryAfterSeconds) {
    return rateLimitResponse(rate.retryAfterSeconds);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = advertiseInquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await createAdvertiseInquiry(parsed.data);
    return NextResponse.json({
      success: true,
      message: "Thanks — our partnerships team will respond within 2 business days.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit inquiry. Please try again later." },
      { status: 503 }
    );
  }
}
