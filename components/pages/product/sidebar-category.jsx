"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const SideBarCategory = ({ topCategoryData, categoryId, topCategoryId }) => {
  const [activeCategory, setActiveCategory] = useState(null);

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
          {topCategoryData.map((topCategory, idx) => {
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
                    +activeCategory === +topCategory.id
                      ? "opacity-1 font-medium"
                      : "opacity-[0.8]"
                  }`}
                >
                  {topCategory.name}
                </h1>
                <div
                  className={`pl-4 pt-2 w-full flex flex-col gap-y-1 overflow-hidden ${
                    +activeCategory === +topCategory.id
                      ? "max-h-screen"
                      : "max-h-0"
                  }`}
                >
                  {topCategory?.categories.map((category) => (
                    <Link
                      key={category.id}
                      className={`${
                        +category.id === +categoryId
                          ? "opacity-1 font-medium"
                          : "opacity-[0.8]"
                      } w-full px-2 py-1 rounded-md textSmall2 hover:bg-secondary cursor-pointer`}
                      href={`/${topCategory.id}/${category.id}`}
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
