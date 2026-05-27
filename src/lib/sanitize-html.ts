/** Strip dangerous HTML while preserving editorial markup. */

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li",
  "h2", "h3", "h4", "blockquote", "figure", "figcaption", "img",
  "span", "div", "hr", "table", "thead", "tbody", "tr", "th", "td",
]);

const STRIP_TAG = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
const EVENT_ATTR = /\s(on\w+|style|formaction)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JS_HREF = /\shref\s*=\s*("|')\s*javascript:[^"']*\1/gi;

export function sanitizeHtml(html: string): string {
  if (!html) return "";

  let safe = html.replace(EVENT_ATTR, "").replace(JS_HREF, "");

  safe = safe.replace(STRIP_TAG, (match, tag: string) => {
    const name = tag.toLowerCase();
    if (ALLOWED_TAGS.has(name)) {
      if (match.startsWith("</")) return `</${name}>`;
      const cleaned = match
        .replace(EVENT_ATTR, "")
        .replace(JS_HREF, "");
      return cleaned;
    }
    return "";
  });

  return safe;
}
