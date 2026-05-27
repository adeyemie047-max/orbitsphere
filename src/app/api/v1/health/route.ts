import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, "ok" | "error"> = {
    api: "ok",
    database: "ok",
  };

  try {
    await db.$queryRaw`SELECT 1`;
  } catch {
    checks.database = "error";
  }

  const healthy = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 }
  );
}
