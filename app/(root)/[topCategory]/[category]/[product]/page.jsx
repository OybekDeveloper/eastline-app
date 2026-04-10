import ProductCarousel from "@/components/pages/product/products-carusel";
import React from "react";
import BannerProducts from "@/components/pages/product/banner-category";
import ProductFeature from "@/components/pages/product/product-feature";
import ProductType from "@/components/pages/product/product-type";
import NavigationProduct from "@/components/pages/product/navigation";
import { f, getRandomItems } from "@/lib/utils";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/json-ld";
import {
  buildBreadcrumbJsonLd,
  buildMetadata,
  buildProductJsonLd,
} from "@/lib/seo";
import { getServerData } from "@/lib/server-data";

const enhanceProductSeoPayload = (details) => {
  if (!details) return undefined;
  const rawSeo = details?.seo;
  const seoPayload =
    rawSeo && typeof rawSeo === "object" ? { ...rawSeo } : {};
  if (!seoPayload.meta_title && details?.meta_title) {
    seoPayload.meta_title = details.meta_title;
  }
  if (!seoPayload.meta_description && details?.meta_description) {
    seoPayload.meta_description = details.meta_description;
  }
  return Object.keys(seoPayload).length ? seoPayload : undefined;
};

export async function generateMetadata({ params }) {
  const { product, category, topCategory } = params;
  const path = `/${topCategory}/${category}/${product}`;
  try {
    const [productData, categoryData] = await Promise.all([
      getServerData(`/api/product?id=${product}`),
      getServerData(`/api/category?id=${category}`),
    ]);
    const productDetails = productData?.[0];
    if (!productDetails) {
      return buildMetadata({
        title: "Товар не найден",
        description: "Страница товара недоступна.",
        path,
      });
    }
    const categoryDetails = categoryData?.[0];
    const fallbackTitle = `${productDetails.name} – описание и цена`;
    const fallbackDescription = productDetails.description
      ? productDetails.description.slice(0, 160)
      : `${productDetails.name} в наличии.`;
    const productSeo = enhanceProductSeoPayload(productDetails);
    const fallbackSeo = {
      ...(categoryDetails?.seo || {}),
      meta_title:
        categoryDetails?.seo?.meta_title ||
        productSeo?.meta_title ||
        fallbackTitle,
      meta_description:
        categoryDetails?.seo?.meta_description ||
        productSeo?.meta_description ||
        fallbackDescription,
    };
    const images =
      productDetails?.image?.map((img) => ({
        url: img,
        alt: productDetails.name,
      })) || [];

    return buildMetadata({
      seo: productSeo,
      fallbackSeo,
      path,
      images,
      type: "article",
    });
  } catch (error) {
    return buildMetadata({
      title: "Каталог товаров",
      description: "Оборудование EAST LINE TELEKOM.",
      path,
      type: "article",
    });
  }
}

const Product = async ({ params }) => {
  const { product, category, topCategory } = params;

  // Fetch all required data using getData in parallel
  const [
    products1,
    contactData,
    productData,
    categoryData,
    productVisibility,
    currency,
    categoriesAll,
  ] = await Promise.all([
    getServerData("/api/product"), // All products for random selection
    getServerData("/api/contact"),
    getServerData(`/api/product?id=${product}`), // Specific product
    getServerData(`/api/category?id=${category}`), // Category of the product
    getServerData(`/api/product-visibility`), // Category of the product
    getServerData(`/api/currency`), // Currency rate
    getServerData("/api/category"),
  ]);

  const getCurrencySum = (dollar) => {
    if (Array.isArray(currency) && currency.length && dollar) {
      const sum = Number(currency[0].sum);
      if (Number.isFinite(sum)) {
        return sum * Number(dollar);
      }
    }
    return null;
  };

  let topCategoryData = [
    {
      name: "",
      id: 1,
    },
  ];
  if (categoryData) {
    const { topCategoryId } = categoryData[0] || {};
    topCategoryData = await getServerData(`/api/topCategory?id=${topCategoryId}`);
  }

  if (!productData?.length || !categoryData?.length) {
    notFound();
  }

  const randomProducts = getRandomItems(products1 || []);
  const { name, price, brand, description, feature } = productData[0] || {};
  const canonicalPath = `/${topCategory}/${category}/${product}`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: topCategoryData?.[0]?.name || "Каталог", path: "/" },
    {
      name: categoryData?.[0]?.name || "Категория",
      path: `/${topCategory}/${category}`,
    },
    { name: name || "Товар", path: canonicalPath },
  ]);
  const priceInSum = getCurrencySum(price);
  const normalizedPrice = priceInSum
    ? Number(priceInSum).toFixed(0)
    : price || "";
  const productSchema = buildProductJsonLd({
    product: productData?.[0],
    url: canonicalPath,
    categoryName: categoryData?.[0]?.name,
    price: normalizedPrice,
    currency: "UZS",
  });
  const customSeoStructuredData = productData?.[0]?.seo?.structured_data;

    return (
    <main className="min-h-[50%] py-10 flex flex-col gap-4">
      <JsonLd id="product-breadcrumbs" data={breadcrumbJsonLd} />
      <JsonLd id="product-schema" data={productSchema} />
      {customSeoStructuredData && (
        <JsonLd
          id="product-custom-structured-data"
          data={customSeoStructuredData}
        />
      )}
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
          categories={categoriesAll}
        />
      </section>
    </main>
  );
};

export default Product;
