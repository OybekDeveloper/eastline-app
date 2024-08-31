import Icons from "@/components/pages/root/icons";
import NewsRew from "@/components/pages/root/news-rew";
import OurLicenses from "@/components/pages/root/our-licenses";
import Partners from "@/components/pages/root/partners";
import AllCategories from "@/components/shared/allCategories";
import AllProducts from "@/components/shared/allProducts";
import Banner from "@/components/shared/banner";
import db from "@/db/db";
import { getLastItems, getRandomItems } from "@/lib/utils";
import { Suspense } from "react";

async function Home() {
  const products = await db.product.findMany();
  const categories = await db.category.findMany({
    include: {
      products: true,
    },
  });
  const topCategories = await db.topCategory.findMany();
  const sertificate = await db.sertificate.findMany();
  const license = await db.license.findMany();
  const partner = await db.partner.findMany();
  const newsData = await db.news.findMany();
  const reviews = await db.reviews.findMany();
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
  const randomSertificate = getRandomItems(sertificate);
  const randomLicense = getRandomItems(license);
  const randomReviews = getRandomItems(reviews);

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
        <OurLicenses sertificate={randomSertificate} license={randomLicense} />
        <Partners partner={partner} />
        <NewsRew newsItem={lastNews} reviews={randomReviews} />
      </Suspense>
    </div>
  );
}

export default Home;
