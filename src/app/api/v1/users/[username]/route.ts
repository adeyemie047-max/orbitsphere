import { NextResponse } from "next/server";
import { getPublicProfile } from "@/lib/users";

type RouteContext = { params: Promise<{ username: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { username } = await context.params;

  try {
    const profile = await getPublicProfile(username);
    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ data: profile });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
