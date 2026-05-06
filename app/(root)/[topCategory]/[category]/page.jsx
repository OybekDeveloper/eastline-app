import NavigationProduct from "@/components/pages/product/navigation";
import Products from "@/components/pages/product/products";
import SideBarCategory from "@/components/pages/product/sidebar-category";
import { notFound, permanentRedirect } from "next/navigation";
import JsonLd from "@/components/seo/json-ld";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildMetadata,
  siteConfig,
} from "@/lib/seo";
import { resolveCategoryRoute } from "@/lib/catalog";
import { buildProductPath } from "@/lib/slugs";
import { getServerData } from "@/lib/server-data";

export async function generateMetadata({ params }) {
  const { topCategory, category } = params;
  const route = await resolveCategoryRoute(topCategory, category);
  const path = route?.canonicalPath || `/${topCategory}/${category}`;
  try {
    const categoryDetails = route?.category;
    const categoryName = categoryDetails?.name;
    if (!categoryName) {
      return buildMetadata({
        title: "Каталог товаров",
        description: siteConfig.description,
        path,
        type: "website",
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
      type: "website",
    });
  } catch (error) {
    return buildMetadata({
      title: "Каталог товаров",
      description: siteConfig.description,
      path,
      type: "website",
    });
  }
}

const Category = async ({ params }) => {
  const { topCategory, category } = params;
  const route = await resolveCategoryRoute(topCategory, category);

  if (!route?.category || !route?.topCategory) {
    notFound();
  }

  if (route.shouldRedirect) {
    permanentRedirect(route.canonicalPath);
  }

  const currentCategory = route.category;
  const currentTopCategory = route.topCategory;

  const [
    topCategoryData,
    topCategoriesSort,
    productsData,
    categorysData,
    currency,
    categorySortData,
    productsSort,
    productVisibility,
  ] = await Promise.all([
    getServerData("/api/topCategory"),
    getServerData("/api/topCategorySort"),
    getServerData(`/api/product?categoryId=${currentCategory.id}`),
    getServerData(`/api/category?topCategoryId=${currentTopCategory.id}`),
    getServerData("/api/currency"),
    getServerData("/api/categorySort"),
    getServerData(`/api/productSort?categoryId=${currentCategory.id}`),
    getServerData(`/api/product-visibility`),
  ]);

  const topProductsData = [currentTopCategory];
  const categoryData = [currentCategory];
  const canonicalPath = route.canonicalPath;
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
      path: buildProductPath(currentTopCategory, currentCategory, product),
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
          topCategoryId={currentTopCategory.id}
          categoryId={currentCategory.id}
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
