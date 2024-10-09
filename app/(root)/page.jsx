import Icons from "@/components/pages/root/icons";
import NewsRew from "@/components/pages/root/news-rew";
import OurLicenses from "@/components/pages/root/our-licenses";
import Partners from "@/components/pages/root/partners";
import AllCategories from "@/components/shared/allCategories";
import AllProducts from "@/components/shared/allProducts";
import Banner from "@/components/shared/banner";
import { ApiService } from "@/lib/api.services";
import { getLastItems, getRandomItems } from "@/lib/utils";
import { Suspense } from "react";

async function Home() {
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
    banner
  ] = await Promise.all([
    ApiService.getData("/api/product", "product"),
    ApiService.getData("/api/category", "category"),
    ApiService.getData("/api/topCategory", "topCategory"),
    ApiService.getData("/api/sertificate", "sertificate"),
    ApiService.getData("/api/license", "license"),
    ApiService.getData("/api/partner", "partner"),
    ApiService.getData("/api/news", "news"),
    ApiService.getData("/api/selectReview", "selectReview"),
    ApiService.getData("/api/currency", "currency"),
    ApiService.getData("/api/banner", "banner")
  ]);

  const randomLicense = getRandomItems(license);
  const lastProducts = getLastItems(products, 4);
  const lastNews = getLastItems(newsData, 10);

  return (
    <div className="min-h-[50%] py-10 flex flex-col space-y-10 items-center justify-center">
      <Suspense>
        <Banner banner={banner} />
        <AllCategories categories={categories} topCategories={topCategories} />
        <AllProducts
          products={lastProducts}
          categories={categories}
          currency={currency}
        />
        <Icons />
        <OurLicenses sertificate={sertificate} license={randomLicense} />
        <Partners partner={partner} />
        <NewsRew newsItem={lastNews} reviews={reviews} />
      </Suspense>
    </div>
  );
}

export default Home;
