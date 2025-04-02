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

  // Ensure all top categories are included
  let topCategorySort = topCategory.map((category) => {
    const matchingItems = topCategoriesSort.filter(
      (item) => String(item.topCategoryId) === String(category.id)
    );

    const uniqueIds = matchingItems.map((item) => item.uniqueId).filter(Boolean);

    return { ...category, uniqueIds };
  });

  // Sorting only if uniqueIds exist
  topCategorySort.sort((a, b) => (a.uniqueIds[0] || Infinity) - (b.uniqueIds[0] || Infinity));

  const updatedTopCategorySort = topCategorySort.map((item) => {
    const filterCategories = categorySortData
      .filter((c) => String(c.topCategorySortId) === String(item.id))
      .sort((a, b) => Number(a.uniqueId) - Number(b.uniqueId));

    return {
      ...item,
      categories: filterCategories,
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
                  {topCategory.categories.map((category) => (
                    <DropdownMenuItem asChild key={category.uniqueId}>
                      <Link
                        className="textSmall"
                        href={`/${topCategory.id}/${category.categoryId}`}
                      >
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </div>
            )}

            {/* Small screens: Show subcategories from the bottom */}
            {topCategory.categories.length > 0 && activeCategory == topCategory.id && (
              <div className="sm:hidden">
                <div className="pl-4 pt-2 w-full flex flex-col gap-y-1 max-h-[150px] overflow-y-scroll">
                  {topCategory.categories.map((category) => (
                    <DropdownMenuItem asChild key={category.id}>
                      <Link
                        className="w-full px-2 py-1 rounded-md opacity-[0.8] textSmall1 hover:bg-secondary cursor-pointer"
                        href={`/${topCategory.id}/${category.categoryId}`}
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
