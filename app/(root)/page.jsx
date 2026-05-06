import Icons from "@/components/pages/root/icons";
import NewsRew from "@/components/pages/root/news-rew";
import OurLicenses from "@/components/pages/root/our-licenses";
import Partners from "@/components/pages/root/partners";
import AllCategories from "@/components/shared/allCategories";
import AllProducts from "@/components/shared/allProducts";
import Banner from "@/components/shared/banner";
import { getLastItems, getRandomItems } from "@/lib/utils";
import { Suspense } from "react";
import JsonLd from "@/components/seo/json-ld";
import {
  buildCollectionPageJsonLd,
  buildMetadata,
  siteConfig,
} from "@/lib/seo";
import { getServerData } from "@/lib/server-data";
import { orderCategoriesFlat } from "@/lib/catalog-order";
import { buildCategoryPath } from "@/lib/slugs";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  path: "/",
});

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
      bannerSort,
      productVisibility,
      categorySortData,
      topCategoriesSort,
      bannerProducts,
    ] = await Promise.all([
      getServerData("/api/product?latest=4").catch(() => []),
      getServerData("/api/category?summary=1").catch(() => []),
      getServerData("/api/topCategory?summary=1").catch(() => []),
      getServerData("/api/sertificate").catch(() => []),
      getServerData("/api/license").catch(() => []),
      getServerData("/api/partner").catch(() => []),
      getServerData("/api/news").catch(() => []),
      getServerData("/api/selectReview").catch(() => []),
      getServerData("/api/currency").catch(() => []),
      getServerData("/api/bannerSort").catch(() => []),
      getServerData("/api/product-visibility").catch(() => []),
      getServerData("/api/categorySort").catch(() => []),
      getServerData("/api/topCategorySort").catch(() => []),
      getServerData("/api/product?search=1").catch(() => []),
    ]);

    const randomLicense = getRandomItems(license);
    const lastNews = getLastItems(newsData, 10);
    const orderedCategories = orderCategoriesFlat(
      topCategories,
      topCategoriesSort,
      categorySortData
    );

    const collectionSchema = buildCollectionPageJsonLd({
      name: `${siteConfig.name} – каталог`,
      description:
        "Новинки и ключевые категории оборудования для систем безопасности и связи.",
      url: "/",
      items: categories.slice(0, 10).map((category) => ({
        name: category.name,
        path: buildCategoryPath(category.topCategory, category),
      })),
    });

    return (
      <div className="min-h-[50%] w-full flex flex-col space-y-2 items-center justify-center">
        <JsonLd id="home-collection-schema" data={collectionSchema} />
        <Suspense fallback={<div>Loading banner...</div>}>
          <Banner
            bannerSort={bannerSort}
            categories={categories}
            topCategories={topCategories}
            products={bannerProducts}
          />
        </Suspense>
        <div className="w-full space-y-6">
          <AllCategories
            categories={orderedCategories}
          />
          <AllProducts
            productVisibility={productVisibility}
            products={products}
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
