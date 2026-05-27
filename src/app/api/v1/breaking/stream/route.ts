import { getBreakingHeadlines } from "@/lib/articles-db";
import { breakingHeadlines as mockBreaking } from "@/lib/data";

export const dynamic = "force-dynamic";

const POLL_MS = 30_000;

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;

      const push = async () => {
        if (closed) return;
        try {
          const headlines = await getBreakingHeadlines(8);
          const payload =
            headlines.length > 0
              ? headlines
              : mockBreaking.map((h) => ({
                  id: h.id,
                  text: h.text,
                  slug: h.slug ?? "",
                }));
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
          );
        } catch {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify(
                mockBreaking.map((h) => ({
                  id: h.id,
                  text: h.text,
                  slug: h.slug ?? "",
                }))
              )}\n\n`
            )
          );
        }
      };

      await push();
      const timer = setInterval(push, POLL_MS);

      request.signal.addEventListener("abort", () => {
        closed = true;
        clearInterval(timer);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
