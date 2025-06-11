import ProductCarousel from "@/components/pages/product/products-carusel";
import React from "react";
import BannerProducts from "@/components/pages/product/banner-category";
import ProductFeature from "@/components/pages/product/product-feature";
import ProductType from "@/components/pages/product/product-type";
import NavigationProduct from "@/components/pages/product/navigation";
import { f, getRandomItems } from "@/lib/utils";
import { getData } from "@/lib/api.services";

const Product = async ({ params }) => {
  const { product, category, topCategory } = await params;

  // Fetch all required data using getData in parallel
  const [
    products1,
    contactData,
    productData,
    categoryData,
    productVisibility,
    currency,
  ] = await Promise.all([
    getData("/api/product", "product"), // All products for random selection
    getData("/api/contact", "contact"),
    getData(`/api/product?id=${product}`, "product"), // Specific product
    getData(`/api/category?id=${category}`, "category"), // Category of the product
    getData(`/api/product-visibility`, "product-visibility"), // Category of the product
    getData(`/api/currency`, "currency"), // Category of the product
  ]);

  const getCurrencySum = (dollar) => {
    if (currency.length) {
      const sum = currency[0].sum;
      return Number(sum) * Number(dollar);
    }
  };

  console.log({
    productData,
    categoryData,
    contactData,
  });
  let topCategoryData = [
    {
      name: "",
      id: 1,
    },
  ];
  if (categoryData) {
    const { topCategoryId } = categoryData[0] || {};
    topCategoryData = await getData(
      `/api/topCategory?id=${topCategoryId}`,
      "topCategory"
    );
  }

  const randomProducts = getRandomItems(products1);
  const { name, price, brand, description, feature } = productData[0] || {};

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
          {productVisibility?.show && (
            <p className="font-bold textNormal3">
              {f(getCurrencySum(price))} сум
            </p>
          )}
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
              {categoryData?.[0]?.name}
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
        <ProductFeature contactData={contactData?.[0]} feature={feature} />
      </section>
      <section className="w-[95%] lg:w-10/12 mx-auto">
        <ProductType productData={productData} />
      </section>
      <section className="w-[95%] lg:w-10/12 mx-auto space-y-4">
        <h1 className="text-primary textNormal3 font-bold">Другие товары</h1>
        <BannerProducts
          currency={currency}
          productVisibility={productVisibility}
          randomProducts={randomProducts}
          categories={categoryData}
        />
      </section>
    </main>
  );
};

export default Product;
