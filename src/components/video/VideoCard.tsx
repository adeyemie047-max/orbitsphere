import Link from "next/link";
import EditorialImage from "@/components/ui/EditorialImage";
import Badge from "@/components/ui/Badge";
import type { VideoStory } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

interface VideoCardProps {
  video: VideoStory;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/video/${video.id}`} className="group block min-w-0">
      <article className="editorial-card overflow-hidden h-full">
        <div className="relative aspect-video bg-black">
          {video.thumbnail && (
            <EditorialImage
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              sizes="(max-width: 640px) 100vw, 25vw"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="w-10 h-10 rounded-full bg-[var(--ds-accent)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[var(--ds-on-accent,#0A0A0A)] ml-0.5">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </span>
          </div>
          <span className="absolute bottom-2 right-2 font-ui text-[10px] font-medium bg-black/70 text-white px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        </div>
        <div className="p-4 min-w-0">
          <Badge variant={video.category.color} className="mb-2">
            {video.category.name}
          </Badge>
          <h3 className="font-serif text-sm font-bold leading-snug text-text-primary line-clamp-2 group-hover:text-[var(--ds-accent)] transition-colors">
            {video.title}
          </h3>
          <p className="font-ui text-[11px] text-text-muted mt-2 truncate">
            {video.channel} · {formatRelativeTime(video.publishedAt)}
          </p>
        </div>
      </article>
    </Link>
  );
}
