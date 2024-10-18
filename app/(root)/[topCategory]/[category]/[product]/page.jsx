import db from "@/db/db";
import { f, getRandomItems } from "@/lib/utils";
import ProductCarousel from "@/components/pages/product/products-carusel";
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegram,
  FaYoutube,
} from "react-icons/fa6";
import BannerProducts from "@/components/pages/product/banner-category";
import ProductFeature from "@/components/pages/product/product-feature";
import ProductType from "@/components/pages/product/product-type";
import NavigationProduct from "@/components/pages/product/navigation";

const Product = async ({ params }) => {
  const { product } = params;
  const currency = await db.currency.findMany();
  const products1 = await db.product.findMany();
  const randomProducts = getRandomItems(products1);
  const contactData = await db.contacts.findMany();

  async function getProduct() {
    const products = await db.product.findMany({
      where: { id: Number(product) },
    });
    const category = await db.category.findMany({
      where: { id: Number(products[0]?.categoryId) },
    });
    const topCategory = await db.topCategory.findMany({
      where: { id: Number(category[0]?.topCategoryId) },
    });
    return { products, category, topCategory };
  }

  const {
    products: productData,
    category: categoryData,
    topCategory: topCategoryData,
  } = await getProduct();
  const { name, price, brand, description, feature } = productData[0];

  return (
    <main className="min-h-[50%] py-10 flex flex-col gap-4">
      <NavigationProduct
        topProductsData={topCategoryData}
        categoryData={categoryData}
        product={productData}
      />
      <section className="w-[95%] lg:w-10/12 mx-auto lg:grid lg:grid-cols-9 gap-x-8 flex flex-col gap-3">
        <div className="col-span-4 max-lg:hidden">
          <ProductCarousel item={productData[0]} />
        </div>
        <div className="col-span-3 space-y-3">
          <h1 className="font-bold textNormal4">{name}</h1>
          {/* <p className="font-bold textNormal3">
            {f(getCurrencySum(price))} сум
          </p> */}
          <div className="lg:hidden col-span-4">
            <ProductCarousel item={productData[0]} />
          </div>
          <ul className="list-disc space-y-2 max-lg:hidden">
            <li className="ml-4 textSmall">{description}</li>
          </ul>
          <div className="flex gap-4">
            <p className="textSmall bg-primary rounded-md px-2 py-1 text-white">
              Доставка
            </p>
            <p className="textSmall bg-primary rounded-md px-2 py-1 text-white">
              Установка
            </p>
          </div>
          <ul className="textSmall2 space-y-2">
            <li>
              <strong>Категория: </strong>
              {categoryData[0].name}
            </li>
            <li>
              <strong>Бренд: </strong>
              {brand}
            </li>
          </ul>
          <ul className="list-disc space-y-2 lg:hidden">
            <li className="ml-4 textSmall">{description}</li>
          </ul>
        </div>
        <ProductFeature contactData={contactData[0]} feature={feature} />
      </section>
      <section className="w-[95%] lg:w-10/12 mx-auto">
        <ProductType productData={productData} />
      </section>
      <section className="w-[95%] lg:w-10/12 mx-auto space-y-4">
        <h1 className="text-primary textNormal3 font-bold">Другие товары</h1>
        <BannerProducts randomProducts={randomProducts} currency={currency} />
      </section>
    </main>
  );
};

export default Product;
