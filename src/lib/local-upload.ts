import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function saveLocalUpload(
  buffer: Buffer,
  originalName: string,
  subfolder: string
): Promise<string> {
  const ext = path.extname(originalName).toLowerCase() || ".png";
  const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".ico", ".svg"].includes(ext)
    ? ext
    : ".png";
  const filename = `${randomUUID()}${safeExt}`;
  const dir = path.join(process.cwd(), "public", "uploads", subfolder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/${subfolder}/${filename}`;
}
