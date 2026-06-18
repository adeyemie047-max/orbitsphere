import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import VideoPlayer from "@/components/video/VideoPlayer";
import VideoCard from "@/components/video/VideoCard";
import Badge from "@/components/ui/Badge";
import { getAllVideoIds, getVideoById, getAllVideos } from "@/lib/video-data";
import { formatRelativeTime } from "@/lib/utils";

interface VideoWatchPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllVideoIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: VideoWatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const video = getVideoById(id);
  if (!video) return { title: "Video Not Found" };

  return {
    title: video.title,
    description: `${video.channel} · ${video.duration}`,
    openGraph: {
      title: video.title,
      type: "video.other",
      images: video.thumbnail ? [{ url: video.thumbnail }] : [],
    },
  };
}

export default async function VideoWatchPage({ params }: VideoWatchPageProps) {
  const { id } = await params;
  const video = getVideoById(id);
  if (!video) notFound();

  const related = getAllVideos().filter((item) => item.id !== video.id).slice(0, 3);

  return (
    <div className="container-main py-8 sm:py-12">
      <nav className="font-ui text-xs text-text-muted mb-6">
        <Link href="/" className="hover:text-[var(--ds-accent)] transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/video" className="hover:text-[var(--ds-accent)] transition-colors">
          Video
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary line-clamp-1">{video.title}</span>
      </nav>

      <div className="max-w-4xl">
        <VideoPlayer
          src={video.playbackUrl}
          poster={video.thumbnail}
          title={video.title}
          playbackType={video.playbackType ?? "html5"}
        />

        <div className="mt-6">
          <Badge variant={video.category.color} className="mb-3">
            {video.category.name}
          </Badge>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary leading-tight">
            {video.title}
          </h1>
          <p className="font-ui text-sm text-text-muted mt-3">
            {video.channel} · {video.duration} · {formatRelativeTime(video.publishedAt)}
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12 pt-10 border-t border-[var(--ds-border)]">
          <h2 className="font-serif text-xl font-bold text-text-primary mb-6">More to watch</h2>
          <div className="content-grid sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <VideoCard key={item.id} video={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
