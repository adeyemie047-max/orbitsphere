import { NextResponse } from "next/server";
import { getSiteBranding } from "@/lib/site-branding";

export async function GET() {
  try {
    const data = await getSiteBranding();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Unable to load branding" }, { status: 503 });
  }
}
