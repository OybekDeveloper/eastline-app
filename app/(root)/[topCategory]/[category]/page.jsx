import NavigationProduct from "@/components/pages/product/navigation";
import Products from "@/components/pages/product/products";
import SideBarCategory from "@/components/pages/product/sidebar-category";
import db from "@/db/db";
import React from "react";

const Category = async ({ params }) => {
  const { topCategory, category } = params;

  async function getTopProducts() {
    const res = await db.topCategory.findMany({
      where: {
        id: Number(topCategory),
      },
      include: {
        categories: true,
      },
    });
    return res;
  }

  async function getTopCategories() {
    const res = await db.topCategory.findMany({
      include: {
        categories: true,
      },
    });
    return res;
  }

  async function getCategory() {
    const categoryData = await db.category.findMany({
      where: {
        id: Number(category),
      },
    });
    const categorysData = await db.category.findMany({
      where: {
        topCategoryId: Number(topCategory),
      },
    });
    return {
      categoryData,
      categorysData,
    };
  }

  async function getProducts() {
    const res = await db.product.findMany({
      where: {
        categoryId: Number(category),
      },
    });
    return res;
  }

  const topProductsData = await getTopProducts();
  const topCategoryData = await getTopCategories();
  const productsData = await getProducts();
  const categoryData = await getCategory();
  const currency = await db.currency.findMany();

  return (
    <main className="min-h-[50%] py-10 flex flex-col">
      <NavigationProduct
        topProductsData={topProductsData}
        categoryData={categoryData.categoryData}
      />
      <div className="pt-5 w-[95%] lg:w-10/12 mx-auto grid grid-cols-1 md:grid-cols-5 lg:grid-cols-4 gap-6">
        <SideBarCategory
          topCategoryId={topCategory}
          categoryId={category}
          topCategoryData={topCategoryData}
        />
        <Products
          topProductsData={topProductsData}
          topCategoryData={topCategoryData}
          productsData={productsData}
          categorys={categoryData.categorysData}
          currency={currency}
        />
      </div>
    </main>
  );
};

export default Category;
