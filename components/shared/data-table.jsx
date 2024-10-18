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
import axios from "axios";
import CustomImage from "./customImage";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Loader from "./loader";

// Custom fuzzy filter and sorting functions
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};
import { useEvent } from "@/store/event";
import DragDropComponent from "./dragDropComponent";

export function DataTable({ param, columns, data, loading }) {
  const router = useRouter();
  const reflesh = useEvent((state) => state.reflesh); // Listen to the reflesh state
  const changeTableData = useEvent((state) => state.changeTableData); // Listen to the reflesh state

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [topCategories, setTopCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // Store selected categories/banners with order
  const [uniqueId, setUniqueId] = useState(1);
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

  const handleSelectItem = (item) => {
    const exists = selectedItems.find((selected) => selected.id === item.id);

    if (exists) {
      // Remove if already selected
      setSelectedItems((prev) =>
        prev.filter((selected) => selected.id !== item.id)
      );
    } else {
      // Add new selected item with unique ID
      setSelectedItems((prev) => [...prev, { ...item, unique_id: uniqueId }]);
      setUniqueId((prev) => prev + 1); // Increment unique ID
    }
  };

  // Fetch data on component mount and whenever reflesh changes
  useEffect(() => {
    async function fetchData() {
      const topCategory = await axios.get(`/api/topCategory`);
      const product = await axios.get(`/api/product`);
      const categories = await axios.get(`/api/category`);
      setCategories(categories);
      setTopCategories(topCategory.data.data);
      setProducts(product.data.data);
    }

    fetchData();
  }, [reflesh]); // reflesh added as a dependency

  // Ensure sorting when fuzzy filtering by fullName
  useEffect(() => {
    if (table?.getState().columnFilters[0]?.id === "fullName") {
      if (table.getState().sorting[0]?.id !== "fullName") {
        table.setSorting([{ id: "fullName", desc: false }]);
      }
    }
  }, [table]);

  console.log(selectedItems, "this is selected");

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
                        const findTopProductName =
                          cell.column.columnDef.accessorKey == "productId" &&
                          products.find((item) => item.id == cell.getValue());
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
      {/* <div className="p-4 rounded-md border mt-2">
        {(param === "changeTopCategory" || param === "changeBanner") && (
          <DragDropComponent
            param={param}
            data={data}
            products={products}
            categories={categories}
          />
        )}
      </div> */}
    </>
  );
}
