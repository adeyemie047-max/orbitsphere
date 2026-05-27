import { NextRequest, NextResponse } from "next/server";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";
import { isEditorialSession, requireEditorialSession } from "@/lib/api-auth";
import { canWriteArticles } from "@/lib/rbac";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: NextRequest) {
  const session = await requireEditorialSession();
  if (!isEditorialSession(session)) return session;

  if (!canWriteArticles(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        error: "Cloudinary is not configured",
        hint: "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET",
      },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File exceeds 5 MB limit" },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = formData.get("folder")?.toString() ?? "orbitsphere/articles";
    const result = await uploadToCloudinary(buffer, folder);

    return NextResponse.json({
      data: {
        url: result.url,
        publicId: result.publicId,
      },
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
