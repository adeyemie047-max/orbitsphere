import { NextRequest, NextResponse } from "next/server";
import { isBlobStorageConfigured, uploadToBlob } from "@/lib/blob-storage";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";
import { isEditorialSession, requireEditorialSession } from "@/lib/api-auth";
import { saveLocalUpload } from "@/lib/local-upload";
import { canManageUsers, canWriteArticles } from "@/lib/rbac";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function normalizeSubfolder(folder: string): string {
  return folder.replace(/^orbitsphere\//, "");
}

export async function POST(request: NextRequest) {
  const session = await requireEditorialSession();
  if (!isEditorialSession(session)) return session;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const folderRaw = formData.get("folder")?.toString() ?? "orbitsphere/articles";
  const subfolder = normalizeSubfolder(folderRaw);
  const isBrandingUpload = subfolder === "branding";

  if (isBrandingUpload) {
    if (!canManageUsers(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } else if (!canWriteArticles(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    if (isCloudinaryConfigured()) {
      const result = await uploadToCloudinary(buffer, folderRaw);
      return NextResponse.json({
        data: {
          url: result.url,
          publicId: result.publicId,
          provider: "cloudinary",
        },
      });
    }

    if (isBlobStorageConfigured()) {
      const result = await uploadToBlob(buffer, file.name, folderRaw);
      return NextResponse.json({
        data: {
          url: result.url,
          publicId: result.pathname,
          provider: "blob",
        },
      });
    }

    const url = await saveLocalUpload(buffer, file.name, subfolder);
    const absoluteUrl = new URL(url, request.nextUrl.origin).href;
    return NextResponse.json({
      data: {
        url: absoluteUrl,
        publicId: null,
        provider: "local",
      },
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
