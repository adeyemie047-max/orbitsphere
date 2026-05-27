import type { DashboardStat } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const iconStyles = {
  gold: "bg-[rgba(212,175,55,0.12)] [&_svg]:stroke-gold",
  blue: "bg-[rgba(59,130,246,0.12)] [&_svg]:stroke-electric",
  cyan: "bg-[rgba(6,182,212,0.12)] [&_svg]:stroke-cyan",
  red: "bg-[rgba(239,68,68,0.12)] [&_svg]:stroke-breaking",
};

const statIcons: Record<string, React.ReactNode> = {
  gold: (
    <svg viewBox="0 0 24 24" strokeWidth="2" fill="none">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  blue: (
    <svg viewBox="0 0 24 24" strokeWidth="2" fill="none">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  ),
  cyan: (
    <svg viewBox="0 0 24 24" strokeWidth="2" fill="none">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  red: (
    <svg viewBox="0 0 24 24" strokeWidth="2" fill="none">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

export default function AdminStatsGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-surface border border-white/6 rounded-[14px] p-6 hover:border-[rgba(212,175,55,0.2)] transition-all"
        >
          <div
            className={cn(
              "w-11 h-11 rounded-[10px] flex items-center justify-center mb-4 [&_svg]:w-[22px] [&_svg]:h-[22px]",
              iconStyles[stat.icon]
            )}
          >
            {statIcons[stat.icon]}
          </div>
          <div className="font-[family-name:var(--font-serif)] text-[34px] font-black text-white mb-1">
            {stat.value}
          </div>
          <div className="font-[family-name:var(--font-ui)] text-xs text-text-muted">
            {stat.label}
          </div>
          <div
            className={cn(
              "font-[family-name:var(--font-ui)] text-[11px] font-semibold mt-2",
              stat.trend === "up" ? "text-live" : "text-breaking"
            )}
          >
            {stat.change}
          </div>
        </div>
      ))}
    </div>
  );
}
