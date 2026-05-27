import BreakingTickerClient from "@/components/layout/BreakingTickerClient";
import { getCachedBreakingHeadlines } from "@/lib/homepage-data";

export default async function BreakingTicker() {
  const initialHeadlines = await getCachedBreakingHeadlines();
  return <BreakingTickerClient initialHeadlines={initialHeadlines} />;
}
