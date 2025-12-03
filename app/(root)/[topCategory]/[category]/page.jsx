import NavigationProduct from "@/components/pages/product/navigation";
import Products from "@/components/pages/product/products";
import SideBarCategory from "@/components/pages/product/sidebar-category";
import { getData } from "@/lib/api.services";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/json-ld";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildMetadata,
  siteConfig,
} from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { topCategory, category } = params;
  const path = `/${topCategory}/${category}`;
  try {
    const categoryData = await getData(
      `/api/category?id=${category}`,
      "category"
    );
    const categoryDetails = categoryData?.[0];
    const categoryName = categoryDetails?.name;
    if (!categoryName) {
      return buildMetadata({
        title: "Каталог товаров",
        description: siteConfig.description,
        path,
        type: "category",
      });
    }
    const fallbackSeo = {
      ...(categoryDetails?.seo || {}),
      meta_title:
        categoryDetails?.seo?.meta_title || `${categoryName} – каталог оборудования`,
      meta_description:
        categoryDetails?.seo?.meta_description ||
        `Категория ${categoryName} от ${siteConfig.name}: поставка, монтаж и обслуживание по всему Узбекистану.`,
    };
    return buildMetadata({
      seo: categoryDetails?.seo,
      fallbackSeo,
      path,
      type: "category",
    });
  } catch (error) {
    return buildMetadata({
      title: "Каталог товаров",
      description: siteConfig.description,
      path,
      type: "category",
    });
  }
}

const Category = async ({ params }) => {
  const { topCategory, category } = params;

  const [
    topProductsData,
    topCategoryData,
    topCategoriesSort,
    productsData,
    categoryData,
    categorysData,
    currency,
    categorySortData,
    productsSort,
    productVisibility,
  ] = await Promise.all([
    getData(`/api/topCategory?id=${topCategory}`, "topCategory"),
    getData("/api/topCategory", "topCategory"),
    getData("/api/topCategorySort", "topCategory"),
    getData(`/api/product?categoryId=${category}`, "product"),
    getData(`/api/category?id=${category}`, "category"),
    getData(`/api/category?topCategoryId=${topCategory}`, "category"),
    getData("/api/currency", "currency"),
    getData("/api/categorySort", "category"),
    getData(`/api/productSort?categoryId=${category}`, "product"),
    getData(`/api/product-visibility`, "product-visibility"),
  ]);
  if (!categoryData?.length) {
    notFound();
  }

  const canonicalPath = `/${topCategory}/${category}`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Каталог", path: "/" },
    { name: categoryData?.[0]?.name || "Категория", path: canonicalPath },
  ]);
  const productList = Array.isArray(productsData) ? productsData : [];
  const categorySchema = buildCollectionPageJsonLd({
    name: `${categoryData?.[0]?.name || "Категория"} – товары`,
    description: `Подборка товаров категории ${categoryData?.[0]?.name || ""} в ${siteConfig.name}.`,
    url: canonicalPath,
    items: productList.slice(0, 10).map((product) => ({
      name: product.name,
      path: `/${topCategory}/${category}/${product.id}`,
    })),
  });
  const customCategoryStructuredData = categoryData?.[0]?.seo?.structured_data;

  return (
    <main className="min-h-[50%] py-10 flex flex-col">
      <JsonLd id="category-breadcrumbs" data={breadcrumbJsonLd} />
      <JsonLd id="category-collection" data={categorySchema} />
      {customCategoryStructuredData && (
        <JsonLd
          id="category-custom-structured-data"
          data={customCategoryStructuredData}
        />
      )}
      <NavigationProduct
        topProductsData={topProductsData}
        categoryData={categoryData}
      />
      <div className="pt-5 w-[95%] lg:w-10/12 mx-auto grid grid-cols-1 md:grid-cols-5 lg:grid-cols-4 gap-6">
        <SideBarCategory
          topCategoryId={topCategory}
          categoryId={category}
          topCategoryData={topCategoryData}
          topCategoriesSort={topCategoriesSort}
          categorySortData={categorySortData}
        />
        <Products
          productVisibility={productVisibility}
          productsSort={productsSort}
          topProductsData={topProductsData}
          topCategoryData={topCategoryData}
          productsData={productsData}
          categorys={categorysData}
          topCategoriesSort={topCategoriesSort}
          categorySortData={categorySortData}
          currency={currency}
        />
      </div>
    </main>
  );
};

export default Category;
