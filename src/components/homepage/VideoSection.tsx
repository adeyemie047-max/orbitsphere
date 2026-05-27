import Link from "next/link";
import Image from "next/image";
import type { VideoStory } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface VideoSectionProps {
  videos: VideoStory[];
}

export default function VideoSection({ videos }: VideoSectionProps) {
  return (
    <div className="container-main mb-[60px]">
      <section className="bg-surface rounded-3xl py-[60px] px-7">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="gold-rule" />
            <h2 className="section-title">Video Stories</h2>
          </div>
          <Button href="/" variant="outline" size="sm">
            Watch More →
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {videos.map((video) => (
            <Link key={video.id} href="/" className="group block">
              <article className="bg-midnight-mid border border-white/6 rounded-[14px] overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
                <div className="relative aspect-video">
                  {video.thumbnail && (
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-[52px] h-[52px] rounded-full bg-[rgba(212,175,55,0.9)] flex items-center justify-center transition-all group-hover:bg-gold group-hover:scale-110">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-midnight-deep ml-0.5">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2.5 right-3 font-[family-name:var(--font-ui)] text-[11px] font-semibold bg-black/75 text-white px-2 py-0.5 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-[18px]">
                  <Badge variant={video.category.color} className="mb-2">
                    {video.category.name}
                  </Badge>
                  <div className="font-[family-name:var(--font-serif)] text-[15px] font-bold leading-[1.4] text-text-primary mb-2 transition-colors group-hover:text-gold line-clamp-2">
                    {video.title}
                  </div>
                  <div className="flex items-center gap-2.5 font-[family-name:var(--font-ui)] text-[11px] text-text-muted">
                    <span>{video.channel}</span>
                    <span className="w-[3px] h-[3px] rounded-full bg-text-muted" />
                    <span>{formatRelativeTime(video.publishedAt)}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
