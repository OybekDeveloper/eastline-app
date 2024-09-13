import Icons from "@/components/pages/root/icons";
import NewsRew from "@/components/pages/root/news-rew";
import OurLicenses from "@/components/pages/root/our-licenses";
import Partners from "@/components/pages/root/partners";
import AllCategories from "@/components/shared/allCategories";
import AllProducts from "@/components/shared/allProducts";
import Banner from "@/components/shared/banner";
import db from "@/db/db";
import { ApiService } from "@/lib/api.services";
import { getLastItems, getRandomItems } from "@/lib/utils";
import { Suspense } from "react";

async function Home() {
  const products = await ApiService.getData("/api/product", "product");

  const categories = await ApiService.getData("/api/category", "category");
  const topCategories = await ApiService.getData("/api/topCategory", "topCategory");

  const sertificate = await db.sertificate.findMany();
  const license = await db.license.findMany();
  const partner = await db.partner.findMany();
  const newsData = await db.news.findMany();
  const reviews = await db.selectReview.findMany();
  const currency = await db.currency.findMany();

  const banner = await db.banner.findMany();
  const bannerProduct = await Promise.all(
    banner.map(async (item) => {
      const getProducts = await db.product.findMany({
        where: { id: Number(item.productId) },
      });
      return { ...item, product: getProducts[0] };
    })
  );

  const randomLicense = getRandomItems(license);

  const lastProducts = getLastItems(products, 4);
  const lastNews = getLastItems(newsData, 10);

  return (
    <div className="min-h-[50%] py-10 flex flex-col space-y-10 items-center justify-center">
      <Suspense>
        <Banner
          productData={bannerProduct}
          categories={categories}
          currency={currency}
        />
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
