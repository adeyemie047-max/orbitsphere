import { NextRequest, NextResponse } from "next/server";
import { listMediaAssets } from "@/lib/admin-media";
import { isEditorialSession, requireEditorialSession } from "@/lib/api-auth";
import { parsePagination } from "@/lib/api-admin";

export async function GET(request: NextRequest) {
  const session = await requireEditorialSession();
  if (!isEditorialSession(session)) return session;

  const { searchParams } = new URL(request.url);
  const { limit } = parsePagination(searchParams);
  const effectiveLimit = Math.min(limit, 100);

  try {
    const siteOrigin =
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.AUTH_URL ??
      request.nextUrl.origin;

    const { assets, cloudinaryConfigured, blobConfigured } = await listMediaAssets({
      limit: effectiveLimit,
      siteOrigin,
    });
    return NextResponse.json({
      data: assets,
      cloudinaryConfigured,
      blobConfigured,
    });
  } catch {
    return NextResponse.json({ error: "Failed to list media" }, { status: 500 });
  }
}
