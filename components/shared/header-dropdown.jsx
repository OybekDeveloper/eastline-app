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

export function HeaderDropdown({ topCategory }) {
  const [activeCategory, setActiveCategory] = useState(null);

  const handleSubcategoryToggle = (categoryId) => {
    setActiveCategory((prev) => (prev === categoryId ? null : categoryId));
  };

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
        {topCategory?.map((topCategory, idx) => {
          if (topCategory?.categories.length <= 0) {
            return null;
          }
          return (
            <DropdownMenuSub key={idx}>
              <DropdownMenuSubTrigger
                arrow={topCategory.categories.length}
                className="py-2 px-4 lg:text-sm"
                onClick={() => handleSubcategoryToggle(topCategory.id)}
              >
                {topCategory.name}
              </DropdownMenuSubTrigger>
              {/* Large screens: Show subcategories from the side */}
              <div className="max-sm:hidden">
                {topCategory?.categories.length > 0 ? (
                  <DropdownMenuSubContent side="right">
                    {topCategory.categories.map((category) => (
                      <DropdownMenuItem asChild key={category.id}>
                        <Link
                          className="textSmall2"
                          href={`/${topCategory.id}/${category.id}`}
                        >
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                ) : null}
              </div>
              {/* Small screens: Show subcategories from the bottom */}
              <div className="sm:hidden">
                {topCategory?.categories.length > 0 &&
                activeCategory === topCategory.id ? (
                  <div className="pl-4 pt-2 w-full flex flex-col gap-y-1 max-h-[150px] overflow-y-scroll">
                    {topCategory.categories.map((category) => (
                      <DropdownMenuItem asChild key={category.id}>
                        <Link
                          key={category.id}
                          className="w-full px-2 py-1 rounded-md opacity-[0.8] textSmall3 hover:bg-secondary cursor-pointer"
                          href={`/${topCategory.id}/${category.id}`}
                        >
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                ) : null}
              </div>
            </DropdownMenuSub>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
