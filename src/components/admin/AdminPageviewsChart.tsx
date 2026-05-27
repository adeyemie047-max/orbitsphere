"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const ranges = ["Week", "2 Weeks", "Month"] as const;

export default function AdminPageviewsChart({ data }: { data: number[] }) {
  const [activeRange, setActiveRange] = useState<(typeof ranges)[number]>("2 Weeks");
  const chartData =
    activeRange === "Week"
      ? data.slice(-7)
      : activeRange === "Month"
        ? [...data, ...data.slice(0, 2)]
        : data;

  return (
    <div className="bg-surface border border-white/6 rounded-[14px] p-7 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="font-[family-name:var(--font-serif)] text-xl font-bold text-white">
          Pageviews — Last 14 Days
        </h3>
        <div className="flex gap-2">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={cn(
                "font-[family-name:var(--font-ui)] text-xs font-semibold px-[18px] py-2 rounded-full cursor-pointer transition-all border-none",
                activeRange === range
                  ? "bg-gold text-midnight-deep"
                  : "bg-white/5 text-text-primary border border-white/6 hover:bg-white/10"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div className="h-40 flex items-end gap-2.5">
        {chartData.map((height, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-t-md cursor-pointer transition-all",
              i === Math.floor(chartData.length * 0.65)
                ? "bg-gradient-to-t from-[rgba(212,175,55,0.4)] to-gold"
                : "bg-gradient-to-t from-[rgba(212,175,55,0.15)] to-[rgba(212,175,55,0.5)] hover:from-[rgba(212,175,55,0.3)] hover:to-[rgba(212,175,55,0.9)]"
            )}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}
