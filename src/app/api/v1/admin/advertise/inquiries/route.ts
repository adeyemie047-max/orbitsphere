import { NextRequest, NextResponse } from "next/server";
import { listAdvertiseInquiries } from "@/lib/admin-ads";
import { isEditorialSession } from "@/lib/api-auth";
import { requireAdmin } from "@/lib/api-admin";

export async function GET() {
  const session = await requireAdmin();
  if (!isEditorialSession(session)) return session;

  try {
    const data = await listAdvertiseInquiries();
    return NextResponse.json({ data, total: data.length });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
