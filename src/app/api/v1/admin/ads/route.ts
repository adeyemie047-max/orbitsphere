import { NextRequest, NextResponse } from "next/server";
import { AdPlacement } from "@prisma/client";
import { createAd, listAdminAds } from "@/lib/admin-ads";
import { adCreateSchema } from "@/lib/admin-schemas";
import { isEditorialSession } from "@/lib/api-auth";
import { parseJsonBody, requireAdmin } from "@/lib/api-admin";
import { revalidateTag } from "next/cache";

export async function GET() {
  const session = await requireAdmin();
  if (!isEditorialSession(session)) return session;

  try {
    const data = await listAdminAds();
    return NextResponse.json({ data, total: data.length });
  } catch {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!isEditorialSession(session)) return session;

  const body = await parseJsonBody<unknown>(request);
  if (body instanceof NextResponse) return body;

  const parsed = adCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const ad = await createAd({
      title: parsed.data.title,
      imageUrl: parsed.data.imageUrl,
      targetUrl: parsed.data.targetUrl,
      placement: parsed.data.placement as AdPlacement,
      isActive: parsed.data.isActive,
      startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : null,
      endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
    });
    revalidateTag("homepage");
    return NextResponse.json({ data: ad }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}
