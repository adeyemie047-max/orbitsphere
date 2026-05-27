/** Derive 3-bullet AI summary from article text when not stored in DB. */
export function deriveAiSummary(
  excerpt: string | null | undefined,
  body: string | null | undefined
): string[] {
  const source = excerpt?.trim() || stripHtml(body ?? "");
  if (!source) return [];

  const sentences = source
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  if (sentences.length >= 3) {
    return sentences.slice(0, 3);
  }

  const words = source.split(/\s+/);
  const chunk = Math.ceil(words.length / 3);
  const bullets: string[] = [];

  for (let i = 0; i < 3; i++) {
    const part = words.slice(i * chunk, (i + 1) * chunk).join(" ");
    if (part) bullets.push(part.endsWith(".") ? part : `${part}.`);
  }

  return bullets.slice(0, 3);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export const AI_SUMMARY_LABEL = "AI Quick Summary";
export const AI_SUMMARY_DISCLAIMER =
  "Auto-generated summary — may not capture every detail. Read the full article for context.";
