import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { brandingUpdateSchema } from "@/lib/admin-schemas";
import { isEditorialSession } from "@/lib/api-auth";
import { parseJsonBody, requireAdmin } from "@/lib/api-admin";
import { getSiteBranding, updateSiteBranding } from "@/lib/site-branding";

function normalizeUrls<T extends Record<string, unknown>>(data: T): T {
  const out = { ...data };
  for (const key of Object.keys(out)) {
    if (typeof out[key] === "string" && out[key] === "") {
      (out as Record<string, unknown>)[key] = null;
    }
  }
  return out;
}

export async function GET() {
  const session = await requireAdmin();
  if (!isEditorialSession(session)) return session;

  try {
    const data = await getSiteBranding();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await requireAdmin();
  if (!isEditorialSession(session)) return session;

  const body = await parseJsonBody<unknown>(request);
  if (body instanceof NextResponse) return body;

  const parsed = brandingUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const data = await updateSiteBranding(normalizeUrls(parsed.data));
    revalidateTag("site-branding");
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
