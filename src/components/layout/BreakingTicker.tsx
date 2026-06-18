import Link from "next/link";
import BreakingTickerStream from "@/components/layout/BreakingTickerStream";
import { getCachedBreakingHeadlines } from "@/lib/homepage-data";

/** Server-rendered ticker — stable markup avoids client bundle hydration drift. */
export default async function BreakingTicker() {
  const headlines = await getCachedBreakingHeadlines();
  const items = headlines.length > 0 ? [...headlines, ...headlines] : [];

  if (items.length === 0) return null;

  return (
    <>
      <div className="breaking-ticker" aria-live="polite" aria-label="Breaking news ticker">
        <div className="breaking-ticker-label">
          <span className="breaking-ticker-word">Live</span>
        </div>

        <div className="breaking-ticker-track-wrap">
          <div className="breaking-ticker-track">
            {items.map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                href={`/article/${item.slug}`}
                className="breaking-ticker-item"
              >
                <span className="breaking-ticker-item-text">{item.text}</span>
                <span className="breaking-ticker-sep" aria-hidden>
                  ◆
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <BreakingTickerStream />
    </>
  );
}
