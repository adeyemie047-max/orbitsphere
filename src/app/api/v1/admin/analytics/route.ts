import { NextResponse } from "next/server";
import { getDashboardAnalytics } from "@/lib/dashboard-data";
import { canViewAnalytics } from "@/lib/rbac";
import { isEditorialSession, requireEditorialSession } from "@/lib/api-auth";

export async function GET() {
  const session = await requireEditorialSession();
  if (!isEditorialSession(session)) return session;

  if (!canViewAnalytics(session.role) && session.role !== "journalist") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const analytics = await getDashboardAnalytics(session.role);
  return NextResponse.json({ data: analytics });
}
