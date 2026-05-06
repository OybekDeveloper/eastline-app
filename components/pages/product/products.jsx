"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CustomImage from "@/components/shared/customImage";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { f, truncateText } from "@/lib/utils";
import { buildCategoryPath, buildProductPath } from "@/lib/slugs";
import { orderCatalogTree } from "@/lib/catalog-order";

const Products = ({
  productsData,
  productVisibility,
  topCategoryData,
  topProductsData,
  categorySortData,
  topCategoriesSort,
  productsSort,
  currency,
  categoryId, // Optional: Add categoryId prop if filtering by category is needed
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page") || "1");
  const normalizedPageFromUrl =
    Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl - 1 : 0;

  const [page, setPage] = useState(normalizedPageFromUrl);
  const [pageSize, setPageSize] = useState(12);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    setPage(normalizedPageFromUrl);
  }, [normalizedPageFromUrl]);

  const updatePageInUrl = (nextPage) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage <= 0) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage + 1));
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    updatePageInUrl(nextPage);
  };

  const getCurrencySum = (dollar) => {
    if (currency.length) {
      const sum = currency[0].sum;
      return Number(sum) * Number(dollar);
    }
  };
  const handleSubcategoryToggle = (categoryId) => {
    setActiveCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const orderedTopCategories = useMemo(
    () => orderCatalogTree(topCategoryData, topCategoriesSort, categorySortData),
    [topCategoryData, topCategoriesSort, categorySortData]
  );

  // Sort productsData based on productsSort uniqueId
  const sortedProducts = useMemo(() => {
    if (productsSort.length > 0) {
      // Filter productsSort by categoryId if provided
      const relevantSort = categoryId
        ? productsSort.filter(
            (sort) => String(sort.categoryId) === String(categoryId)
          )
        : productsSort;

      // Sort by uniqueId
      const sortedSort = [...relevantSort].sort(
        (a, b) => Number(a.uniqueId) - Number(b.uniqueId)
      );

      // Map sorted productsSort to productsData
      const sortedProducts = sortedSort
        .map((sort) => {
          const product = productsData.find(
            (p) => String(p.id) === String(sort.productId)
          );
          return product ? { ...product, sortUniqueId: sort.uniqueId } : null;
        })
        .filter(Boolean); // Remove null entries

      // Append remaining products not in productsSort
      const sortedProductIds = new Set(
        sortedSort.map((sort) => sort.productId)
      );
      const unsortedProducts = productsData.filter(
        (p) => !sortedProductIds.has(p.id)
      );

      return [...sortedProducts, ...unsortedProducts];
    }
    // If no productsSort, return productsData as-is
    return productsData;
  }, [productsData, productsSort, categoryId]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;
    return sortedProducts.slice(start, end);
  }, [page, pageSize, sortedProducts]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => `${info.getValue()}000 сум`,
        enableSorting: true,
      },
    ],
    []
  );

  const table = useReactTable({
    data: paginatedData,
    columns,
    pageCount: Math.ceil(sortedProducts.length / pageSize),
    state: {
      pagination: {
        pageIndex: page,
        pageSize: pageSize,
      },
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex: page, pageSize });
        handlePageChange(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else {
        const { pageIndex, pageSize } = updater;
        handlePageChange(pageIndex);
        setPageSize(pageSize);
      }
    },
  });

  return (
    <div className="col-span-3 space-y-4">
      <div className="flex justify-between md:justify-end items-center">
        {/* Category Dropdown */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-auto">
              <button className="flex gap-3 max-md:bg-white bg-secondary px-2 py-1 outline-none rounded-md justify-between">
                <h1>Категории</h1> <ChevronDown className="w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-xs md:hidden">
              {orderedTopCategories?.map((topCategory, idx) => {
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
                          {topCategory.categories.map((category, idx) => (
                            <DropdownMenuItem asChild key={idx}>
                              <Link
                                className="textSmall2"
                                href={buildCategoryPath(topCategory, category)}
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
                            <Link
                              key={category.id}
                              className="w-full px-2 py-1 rounded-md opacity-[0.8] textSmall3 hover:bg-secondary cursor-pointer"
                              href={buildCategoryPath(topCategory, category)}
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </DropdownMenuSub>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Price Sorting Dropdown (Commented out as in original) */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex gap-3 max-md:bg-white bg-secondary px-2 text-xs lg:text-base py-1 outline-none rounded-md justify-between">
              <h1>Цена</h1> <ChevronDown className="size-4 lg:size-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <button
                onClick={() => table.setSorting([{ id: "price", desc: false }])}
                className="flex justify-between text-xs lg:text-base items-center gap-2"
              >
                <ArrowUp className="size-4 lg:size-6" />
                По возр.
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => table.setSorting([{ id: "price", desc: true }])}
                className="flex justify-between text-xs lg:text-base items-center gap-2"
              >
                <ArrowDown className="size-4 lg:size-6" />
                По убыв.
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {table.getRowModel().rows.length > 0 ? (
          <>
            {table.getRowModel().rows.map((row) => {
              const item = row.original;
              return (
                <Link
                  href={buildProductPath(
                    topProductsData[0],
                    item.category,
                    item
                  )}
                  key={item.id}
                  className="relative w-full flex max-md:bg-secondary rounded-md flex-col gap-4 p-5 border"
                >
                  <div className="relative max-md:bg-white rounded-md max-md:p-2 sm:h-[300px] md:h-full overflow-hidden">
                    <CustomImage
                      src={`${item.image[0]}`}
                      alt={`${item.name}`}
                      className="w-[70%] mx-auto aspect-square object-contain mb-5"
                    />
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <h1 className="font-bold textNormal2">
                      {truncateText(item.name, 50)}
                    </h1>
                    {productVisibility?.show && (
                      <p className="flex justify-between w-full">
                        Цена: <span>{f(getCurrencySum(+item.price))} сум</span>,
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </>
        ) : (
          <div className="col-span-4 w-full py-5 flex justify-center items-center">
            Нет результатов.
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={page > 0 ? `?page=${page}` : pathname}
              onClick={(event) => {
                event.preventDefault();
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage()}
            />
          </PaginationItem>
          {Array.from({ length: table.getPageCount() }).map((_, idx) => (
            <PaginationItem key={idx}>
              <PaginationLink
                href={idx === 0 ? pathname : `?page=${idx + 1}`}
                className="cursor-pointer hover:bg-secondary"
                onClick={(event) => {
                  event.preventDefault();
                  table.setPageIndex(idx);
                }}
                isActive={
                  idx === table.getState().pagination.pageIndex
                    ? "true"
                    : undefined
                }
              >
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href={`?page=${page + 2}`}
              onClick={(event) => {
                event.preventDefault();
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Products;
