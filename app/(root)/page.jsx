import Icons from "@/components/pages/root/icons";
import NewsRew from "@/components/pages/root/news-rew";
import OurLicenses from "@/components/pages/root/our-licenses";
import Partners from "@/components/pages/root/partners";
import AllCategories from "@/components/shared/allCategories";
import AllProducts from "@/components/shared/allProducts";
import Banner from "@/components/shared/banner";
import { getData } from "@/lib/api.services";
import { getLastItems, getRandomItems } from "@/lib/utils";
import { Suspense } from "react";

async function Home() {
  try {
    const [
      products,
      categories,
      topCategories,
      sertificate,
      license,
      partner,
      newsData,
      reviews,
      currency,
      banner,
      bannerSort,
      productVisibility,
    ] = await Promise.all([
      getData("/api/product", "product").catch(() => []),
      getData("/api/category", "category").catch(() => []),
      getData("/api/topCategory", "topCategory").catch(() => []),
      getData("/api/sertificate", "sertificate").catch(() => []),
      getData("/api/license", "license").catch(() => []),
      getData("/api/partner", "partner").catch(() => []),
      getData("/api/news", "news").catch(() => []),
      getData("/api/selectReview", "selectReview").catch(() => []),
      getData("/api/currency", "currency").catch(() => []),
      getData("/api/banner", "banner").catch(() => []),
      getData("/api/bannerSort", "banner").catch(() => []),
      getData("/api/product-visibility", "product-visibility").catch(() => []),
    ]);

    const randomLicense = getRandomItems(license);
    const lastProducts = getLastItems(products, 4);
    const lastNews = getLastItems(newsData, 10);

    return (
      <div className="min-h-[50%] w-full flex flex-col space-y-2 items-center justify-center">
        <Suspense fallback={<div>Loading banner...</div>}>
          <Banner banner={banner} bannerSort={bannerSort} />
        </Suspense>
        <div className="w-full space-y-6">
          <AllCategories
            categories={categories}
            topCategories={topCategories}
          />
          <AllProducts
            productVisibility={productVisibility}
            products={lastProducts}
            categories={categories}
            currency={currency}
            topCategories={topCategories}
          />
          <Icons />
          <OurLicenses sertificate={sertificate} license={randomLicense} />
          <Partners partner={partner} />
          <NewsRew newsItem={lastNews} reviews={reviews} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading Home page data:", error);
    return <div>Error loading page. Please try again later.</div>;
  }
}

export default Home;
