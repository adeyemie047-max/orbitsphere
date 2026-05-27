import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    name: "OrbitSphere Newspaper API",
    version: "1.0.0",
    status: "ok",
    endpoints: {
      articles: "/api/v1/articles",
      categories: "/api/v1/categories",
      search: "/api/v1/articles/search?q=",
    },
  });
}
