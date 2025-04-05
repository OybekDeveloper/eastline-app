import NavigationProduct from "@/components/pages/product/navigation";
import Products from "@/components/pages/product/products";
import SideBarCategory from "@/components/pages/product/sidebar-category";
import { getData } from "@/lib/api.services";

const Category = async ({ params }) => {
  const { topCategory, category } = await params;

  const [
    topProductsData,
    topCategoryData,
    topCategoriesSort,
    productsData,
    categoryData,
    categorysData,
    currency,
    categorySortData,
  ] = await Promise.all([
    getData(`/api/topCategory?id=${topCategory}`, "topCategory"),
    getData("/api/topCategory", "topCategory"),
    getData("/api/topCategorySort", "topCategory"),
    getData(`/api/product?categoryId=${category}`, "product"),
    getData(`/api/category?id=${category}`, "category"),
    getData(`/api/category?topCategoryId=${topCategory}`, "category"),
    getData("/api/currency", "currency"),
    getData("/api/categorySort", "category"),
  ]);
  return (
    <main className="min-h-[50%] py-10 flex flex-col">
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
