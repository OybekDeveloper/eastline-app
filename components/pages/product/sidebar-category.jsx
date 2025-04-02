"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const SideBarCategory = ({
  topCategoryData,
  topCategoriesSort,
  categoryId,
  topCategoryId,
  categorySortData,
}) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const topCategorySort = topCategoryData
    .map((category) => {
      const matchingItems = topCategoriesSort.filter(
        (item) => String(item.topCategoryId) === String(category.id)
      );

      const uniqueIds = matchingItems
        .map((item) => item.uniqueId)
        .filter(Boolean);

      return { ...category, uniqueIds };
    })
    .filter((category) => category.uniqueIds)
    .sort((a, b) => a.uniqueIds[0] - b.uniqueIds[0]);

  const updatedTopCategorySort = topCategorySort.map((item) => {
    const filterCategories = categorySortData
      .filter((c) => String(c.topCategorySortId) === String(item.id))
      .sort((a, b) => Number(a.uniqueId) - Number(b.uniqueId)); // Sort by uniqueId in ascending order

    return {
      ...item,
      categories: filterCategories,
    };
  });

  useEffect(() => {
    setActiveCategory(topCategoryId);
  }, [topCategoryId]);

  const handleSubcategoryToggle = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="max-md:hidden col-span-2 lg:col-span-1">
      <div className="bg-secondary mx-auto h-auto p-4 rounded-md space-y-3">
        <h1 className="textNormal4 font-bold">Категории</h1>
        <div className="w-full space-y-2">
          {updatedTopCategorySort?.map((topCategory, idx) => {
            if (topCategory?.categories.length <= 0) {
              return null;
            }
            return (
              <div
                onClick={() => handleSubcategoryToggle(topCategory.id)}
                key={idx}
              >
                <h1
                  className={`textSmall3  cursor-pointer transition-opacity duration-300 ease-linear ${
                    String(activeCategory) === String(topCategory.id)
                      ? "opacity-1 font-medium"
                      : "opacity-[0.8]"
                  }`}
                >
                  {topCategory.name}
                </h1>
                <div
                  className={`pl-4 pt-2 w-full flex flex-col gap-y-1 overflow-hidden ${
                    String(activeCategory) === String(topCategory.id)
                      ? "max-h-screen"
                      : "max-h-0"
                  }`}
                >
                  {topCategory?.categories.map((category) => (
                    <Link
                      key={category.uniqueId}
                      className={`${
                        String(category.categoryId) === String(categoryId)
                          ? "opacity-1 font-medium"
                          : "opacity-[0.8]"
                      } w-full px-2 py-1 rounded-md textSmall2 hover:bg-secondary cursor-pointer`}
                      href={`/${topCategory.id}/${category.categoryId}`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideBarCategory;
