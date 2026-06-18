import VideoCard from "@/components/video/VideoCard";
import type { VideoStory } from "@/lib/types";
import Button from "@/components/ui/Button";

interface VideoSectionProps {
  videos: VideoStory[];
}

export default function VideoSection({ videos }: VideoSectionProps) {
  return (
    <section className="section-band section-band-alt reveal-on-scroll reveal-delay-4">
      <div className="container-main">
        <div className="section-header">
          <div>
            <p className="section-label mb-1">Watch</p>
            <h2 className="section-title">Video</h2>
          </div>
          <Button href="/video" variant="outline" size="sm">
            More videos
          </Button>
        </div>
        <div className="content-grid sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}
