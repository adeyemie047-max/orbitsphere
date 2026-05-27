import { NextResponse } from "next/server";
import { categories as mockCategories } from "@/lib/data";
import { getPublicCategories } from "@/lib/articles-db";

export async function GET() {
  try {
    const data = await getPublicCategories();
    return NextResponse.json({ data, source: "database" });
  } catch {
    return NextResponse.json({ data: mockCategories, source: "mock" });
  }
}
