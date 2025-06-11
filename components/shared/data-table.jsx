"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "./dataTablePagination";
import { DataTableViewOptions } from "./dataTableViewOptions";
import { rankItem, compareItems } from "@tanstack/match-sorter-utils";
import { formatFullDate, truncateText } from "@/lib/utils";
import CustomImage from "./customImage";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Loader from "./loader";
import { Switch } from "@/components/ui/switch";

// Custom fuzzy filter and sorting functions
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};
import { useEvent } from "@/store/event";
import DragDropComponent from "./dragDropComponent";
import { getData, postData, putData } from "@/lib/api.services";
import { Label } from "../ui/label";

export function DataTable({
  topCategories,
  products,
  categories,
  param,
  columns,
  data,
  loading,
}) {
  const router = useRouter();
  const reflesh = useEvent((state) => state.reflesh); // Listen to the reflesh state
  const changeTableData = useEvent((state) => state.changeTableData); // Listen to the reflesh state

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [showPrice, setShowPrice] = useState(false);

  const table = useReactTable({
    data: changeTableData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy",
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });
  const [loadingPrice, setLoadingPrice] = useState(false);

  useEffect(() => {
    if (table?.getState().columnFilters[0]?.id === "fullName") {
      if (table.getState().sorting[0]?.id !== "fullName") {
        table.setSorting([{ id: "fullName", desc: false }]);
      }
    }
    const fetchData = async () => {
      try {
        const show = await getData(
          "/api/product-visibility",
          "product-visibility"
        );
        console.log({ show });
      } catch (error) {
        console.log(error);
      }
    };
    if (param == "changeProduct") {
      fetchData();
    }
  }, [table]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const show = await getData(
          `/api/product-visibility`,
          "product-visibility"
        );
        if (show) {
          setShowPrice(Boolean(show?.show));
        }
        console.log(show);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleShowPrice = async (bool) => {
    try {
      setLoadingPrice(true);
      const show = await postData(
        `/api/product-visibility`,
        { show: bool },
        "product-visibility"
      );
      console.log(show);
      if (show) {
        setShowPrice(bool);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPrice(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 py-4">
        <Button
          variant="outline"
          className="text-xs lg:text-base"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 size-4 lg:size-6" /> Назад
        </Button>

        <Input
          placeholder="Поиск по всем столбцам..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(String(e.target.value))}
          className="max-w-[250px]"
        />
        {param === "changeProduct" && (
          <div className="w-full justify-end items-center flex">
            <div className="flex items-center space-x-2">
              <div className="relative flex justify-center items-center">
                <Switch
                  id="show_price"
                  checked={showPrice}
                  onCheckedChange={() => {
                    handleShowPrice(!showPrice);
                  }}
                  disabled={loadingPrice}
                  className={`${
                    loadingPrice
                      ? "opacity-50 cursor-not-allowed border-2 border-gray-300"
                      : ""
                  }`}
                />
                {loadingPrice && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-t-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <Label htmlFor="show_price">Показать сумму</Label>
            </div>
          </div>
        )}
        <DataTableViewOptions table={table} />
      </div>
      <>
        {loading ? (
          <div className="w-full flex justify-center items-center gap-2 px-2 py-3 rounded-md border">
            <Loader />
            <h1>Загрузка...</h1>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table?.getHeaderGroups()?.map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table?.getRowModel()?.rows?.length ? (
                  table?.getRowModel()?.rows?.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const findTopCategoryName =
                          cell.column.columnDef.accessorKey ==
                            "topCategoryId" &&
                          topCategories.find(
                            (item) => item.id == cell.getValue()
                          );
                        let findTopProductName =
                          cell.column.columnDef.accessorKey == "productId" &&
                          products.find((item) => item.id == cell.getValue());
                        if (
                          !findTopProductName &&
                          cell.column.columnDef.accessorKey == "categoryId"
                        ) {
                          findTopProductName =
                            cell.column.columnDef.accessorKey == "categoryId" &&
                            categories?.find(
                              (item) => item.id == cell.getValue()
                            );
                        }

                        return (
                          <TableCell key={cell.id}>
                            {cell.column.columnDef.accessorKey ==
                            "createdAt" ? (
                              formatFullDate(cell.getValue())
                            ) : cell.column.columnDef.accessorKey ==
                              "topCategoryId" ? (
                              findTopCategoryName?.name
                            ) : cell.column.columnDef.accessorKey ==
                              "productId" ? (
                              findTopProductName?.name
                            ) : cell.column.columnDef.accessorKey ==
                              "categoryId" ? (
                              findTopProductName?.name
                            ) : cell.column.columnDef.accessorKey ==
                              "feature" ? (
                              truncateText(cell.getValue(), 10)
                            ) : cell.column.columnDef.accessorKey == "brand" ? (
                              truncateText(cell.getValue(), 15)
                            ) : cell.column.columnDef.accessorKey == "price" ? (
                              `${cell.getValue()}$`
                            ) : cell.column.columnDef.accessorKey == "image" ? (
                              <CustomImage
                                className={"w-14"}
                                src={`${cell.getValue()}`}
                                alt={`${cell.getValue()}`}
                              />
                            ) : (
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Нет результатов.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 p-4">
              <DataTablePagination table={table} />
            </div>
          </div>
        )}
      </>
      {data.length > 0 && (
        <div className="p-4 rounded-md border mt-2">
          {(param === "changeTopCategory" || param === "changeBanner") && (
            <DragDropComponent
              param={param}
              data={data}
              products={products}
              categories={categories}
            />
          )}
        </div>
      )}
    </>
  );
}
