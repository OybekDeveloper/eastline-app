"use client";

import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function HeaderDropdown({
  topCategory = [],
  topCategoriesSort = [],
  categorySortData = [],
}) {
  const [activeCategory, setActiveCategory] = useState(null);

  const handleSubcategoryToggle = (categoryId) => {
    setActiveCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const topCategorySort = topCategory
    .map((category) => {
      const sortEntry = topCategoriesSort.find(
        (item) => String(item.topCategoryId) === String(category.id)
      );

      return {
        ...category,
        sortId: sortEntry?.id || null,
        sortOrder: Number(sortEntry?.uniqueId ?? Number.MAX_SAFE_INTEGER),
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const updatedTopCategorySort = topCategorySort.map((item) => {
    const baseCategories = item?.categories || [];
    const sortedCategories = categorySortData?.length
      ? categorySortData
          .filter((category) => {
            const hasValidSortId = String(category.topCategorySortId) === String(item.sortId);
            const hasLegacySortId = String(category.topCategorySortId) === String(item.id);
            return hasValidSortId || hasLegacySortId;
          })
          .sort((a, b) => Number(a.uniqueId) - Number(b.uniqueId))
      : [];
    const mappedCategoryIds = new Set(
      sortedCategories.map((category) => String(category.categoryId ?? category.id))
    );
    const missingCategories = baseCategories.filter(
      (category) => !mappedCategoryIds.has(String(category.id))
    );
    const categories = sortedCategories.length
      ? [...sortedCategories, ...missingCategories]
      : baseCategories;

    return {
      ...item,
      categories,
    };
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-2 items-center py-2 px-1 md:px-3">
          <Menu className="w-3 lg:w-5" />
          Каталог
          <ChevronDown className="w-3 lg:w-5" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-xs">
        {updatedTopCategorySort.map((topCategory, idx) => (
          <DropdownMenuSub key={idx}>
            <DropdownMenuSubTrigger
              arrow={topCategory.categories.length > 0}
              className="py-2 px-4 textSmall"
              onClick={() => handleSubcategoryToggle(topCategory.id)}
            >
              {topCategory.name}
            </DropdownMenuSubTrigger>

            {/* Large screens: Show subcategories from the side */}
            {topCategory.categories.length > 0 && (
              <div className="max-sm:hidden">
                <DropdownMenuSubContent side="right">
                  {topCategory.categories.map((category, idx) => (
                    <DropdownMenuItem asChild key={idx}>
                      <Link
                        className="textSmall"
                        href={`/${topCategory.id}/${
                          category.categoryId
                            ? category?.categoryId
                            : category?.id
                        }`}
                      >
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </div>
            )}

            {/* Small screens: Show subcategories from the bottom */}
            {topCategory.categories.length > 0 &&
              activeCategory == topCategory.id && (
                <div className="sm:hidden">
                  <div className="pl-4 pt-2 w-full flex flex-col gap-y-1 max-h-[150px] overflow-y-scroll">
                    {topCategory.categories.map((category) => (
                      <DropdownMenuItem asChild key={category.id}>
                        <Link
                          className="w-full px-2 py-1 rounded-md opacity-[0.8] textSmall1 hover:bg-secondary cursor-pointer"
                          href={`/${topCategory.id}/${
                            category.categoryId
                              ? category?.categoryId
                              : category?.id
                          }`}
                        >
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </div>
              )}
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
