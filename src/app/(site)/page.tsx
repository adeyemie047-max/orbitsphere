import AdUnit from "@/components/ads/AdUnit";
import Hero from "@/components/homepage/Hero";
import TrendingSection from "@/components/homepage/TrendingSection";
import LatestNews from "@/components/homepage/LatestNews";
import CategorySection from "@/components/homepage/CategorySection";
import VideoSection from "@/components/homepage/VideoSection";
import OpinionSection from "@/components/homepage/OpinionSection";
import Newsletter from "@/components/homepage/Newsletter";
import { getCachedHomepageData } from "@/lib/homepage-data";
import { getSiteBranding } from "@/lib/site-branding";

/** PRD §8.1 homepage — ISR every 60 seconds. */
export const revalidate = 60;

export default async function HomePage() {
  const [data, branding] = await Promise.all([
    getCachedHomepageData(),
    getSiteBranding(),
  ]);

  return (
    <>
      <Hero featured={data.featured} subArticles={data.subHero} />
      <LatestNews articles={data.latest} />
      <TrendingSection articles={data.trending} />

      <div className="ad-slot container-main">
        <AdUnit ad={data.ads.banner} placement="banner" />
      </div>

      <CategorySection
        category={data.politics.category}
        featured={data.politics.featured}
        articles={data.politics.articles}
      />

      <CategorySection
        category={data.business.category}
        featured={data.business.featured}
        articles={data.business.articles}
        alternate
      />

      <div className="ad-slot ad-slot--end container-main">
        <AdUnit ad={data.ads.rectangle} placement="rectangle" />
      </div>

      <VideoSection videos={data.videos} />
      <OpinionSection articles={data.opinion} />
      <Newsletter branding={branding} />
    </>
  );
}
