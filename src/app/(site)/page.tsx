import AdUnit from "@/components/ads/AdUnit";
import Hero from "@/components/homepage/Hero";
import TrendingCarousel from "@/components/homepage/TrendingCarousel";
import LatestNews from "@/components/homepage/LatestNews";
import CategorySection from "@/components/homepage/CategorySection";
import VideoSection from "@/components/homepage/VideoSection";
import OpinionSection from "@/components/homepage/OpinionSection";
import Newsletter from "@/components/homepage/Newsletter";
import { getCachedHomepageData } from "@/lib/homepage-data";

/** PRD §8.1 homepage — ISR every 60 seconds. */
export const revalidate = 60;

export default async function HomePage() {
  const data = await getCachedHomepageData();

  return (
    <>
      <Hero featured={data.featured} subArticles={data.subHero} />

      <div className="container-main py-6 flex justify-center">
        <AdUnit ad={data.ads.banner} placement="banner" />
      </div>

      <TrendingCarousel articles={data.trending} />
      <LatestNews articles={data.latest} />

      <CategorySection
        category={data.politics.category}
        featured={data.politics.featured}
        articles={data.politics.articles}
      />

      <div className="container-main pb-8 flex justify-center lg:justify-end">
        <AdUnit ad={data.ads.rectangle} placement="rectangle" />
      </div>

      <CategorySection
        category={data.business.category}
        featured={data.business.featured}
        articles={data.business.articles}
      />

      <CategorySection
        category={data.technology.category}
        featured={data.technology.featured}
        articles={data.technology.articles}
      />

      <VideoSection videos={data.videos} />
      <OpinionSection articles={data.opinion} />
      <Newsletter />
    </>
  );
}
