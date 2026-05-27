import { NextRequest, NextResponse } from "next/server";
import { AdPlacement } from "@prisma/client";
import { getAdById, updateAd } from "@/lib/admin-ads";
import { adUpdateSchema } from "@/lib/admin-schemas";
import { isEditorialSession } from "@/lib/api-auth";
import { parseJsonBody, requireAdmin } from "@/lib/api-admin";
import { revalidateTag } from "next/cache";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await requireAdmin();
  if (!isEditorialSession(session)) return session;

  const { id } = await context.params;

  const body = await parseJsonBody<unknown>(request);
  if (body instanceof NextResponse) return body;

  const parsed = adUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const existing = await getAdById(id);
    if (!existing) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    const ad = await updateAd(id, {
      ...(parsed.data.title !== undefined ? { title: parsed.data.title } : {}),
      ...(parsed.data.imageUrl !== undefined
        ? { imageUrl: parsed.data.imageUrl }
        : {}),
      ...(parsed.data.targetUrl !== undefined
        ? { targetUrl: parsed.data.targetUrl }
        : {}),
      ...(parsed.data.placement !== undefined
        ? { placement: parsed.data.placement as AdPlacement }
        : {}),
      ...(parsed.data.isActive !== undefined
        ? { isActive: parsed.data.isActive }
        : {}),
      ...(parsed.data.startsAt !== undefined
        ? {
            startsAt: parsed.data.startsAt
              ? new Date(parsed.data.startsAt)
              : null,
          }
        : {}),
      ...(parsed.data.endsAt !== undefined
        ? {
            endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
          }
        : {}),
    });

    revalidateTag("homepage");
    return NextResponse.json({ data: ad });
  } catch {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}
