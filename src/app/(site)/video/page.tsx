import VideoCard from "@/components/video/VideoCard";
import { getAllVideos } from "@/lib/video-data";

export const metadata = {
  title: "Video",
  description: "Watch OrbitSphere TV — documentaries, interviews, and breaking news video.",
};

export default function VideoIndexPage() {
  const videos = getAllVideos();

  return (
    <div className="container-main py-12">
      <p className="section-label mb-1">Watch</p>
      <h1 className="font-serif text-3xl font-black text-text-primary mb-2">Video</h1>
      <p className="font-ui text-sm text-text-muted mb-8">
        Documentaries, press conferences, and investigative reports from the OrbitSphere newsroom.
      </p>
      <div className="content-grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
