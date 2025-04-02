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
import { rankItem } from "@tanstack/match-sorter-utils";
import { formatFullDate, truncateText } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Custom fuzzy filter and sorting functions
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};
import { useEvent } from "@/store/event";
import { DataTableViewOptions } from "../shared/dataTableViewOptions";
import CustomImage from "../shared/customImage";
import { DataTablePagination } from "../shared/dataTablePagination";
import Loader from "../shared/loader";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../shared/dataTableColumnHeader";
import toast from "react-hot-toast";
import DeleteItemReview from "../pages/dashboard/delete-review";
import { getData, postData } from "@/lib/api.services";

export default function SelectReview() {
  const router = useRouter();
  const {
    tableSelectReview,
    tableReview,
    setTableReview,
    reflesh,
    setReflesh,
  } = useEvent();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  function useReviewTable(data, columns) {
    return useReactTable({
      data,
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
  }

  const table1 = useReviewTable(tableReview, selectReviewTable1);
  const table2 = useReviewTable(tableSelectReview, selectReviewTable2);

  useEffect(() => {
    async function fetchData() {
      try {
        const reviews = await getData(
          `/api/review`,
          "review"
        );
        const selectReviewData = await getData(`/api/selectReview`, "review");
        const selectReviewIds = selectReviewData?.map(
          (selectReview) => selectReview.reviewId
        );

        const filteredReviews = reviews?.filter(
          (review) => !selectReviewIds?.includes(review?.id)
        );

        setTableReview(filteredReviews, selectReviewData.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [reflesh]);

  const handleSubmit = async () => {
    const selectedRows = table1
      .getSelectedRowModel()
      .rows.map((row) => row.original);

    if (selectedRows?.length <= 0) {
      toast.error("Вы не выбрали пользователя");
      return;
    }

    const updatedReviews = selectedRows.map(({ id, createdAt, ...rest }) => ({
      ...rest,
      reviewId: id,
    }));
    console.log("updatedReviews: ", updatedReviews);

    setIsLoading(true);

    try {
      const response = await postData(
        "/api/selectReview",
        {
          updatedReviews,
        },
        "review"
      );

      if (response.status === 200) {
        setReflesh();
        toast.success("Data submitted successfully");
      } else {
        toast.error("Failed to submit data");
      }
    } catch (error) {
      console.error("Error submitting data", error);
      toast.error("Error submitting data");
    } finally {
      setIsLoading(false); // Reset loading state after the request is completed
    }
  };

  return (
    <div className="w-full py-10 container mx-auto">
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
        <DataTableViewOptions table={table1} />
      </div>

      <>
        {loading ? (
          <div className="w-full flex justify-center items-center gap-2 px-2 py-3 rounded-md border">
            <Loader />
            <h1>Загрузка...</h1>
          </div>
        ) : (
          <main className="space-y-2">
            <h1 className="font-medium textNormal">Отзывы пользователей</h1>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table1?.getHeaderGroups()?.map((headerGroup) => (
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
                  {table1?.getRowModel()?.rows?.length ? (
                    table1?.getRowModel()?.rows?.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {/* Use Checkbox component for row selection */}
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <TableCell key={cell.id}>
                              {cell.column.columnDef.accessorKey ==
                              "createdAt" ? (
                                formatFullDate(cell.getValue())
                              ) : cell.column.columnDef.accessorKey ==
                                "brand" ? (
                                truncateText(cell.getValue(), 15)
                              ) : cell.column.columnDef.accessorKey ==
                                "price" ? (
                                `${cell.getValue()}$`
                              ) : cell.column.columnDef.accessorKey ==
                                "image" ? (
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
                        colSpan={selectReviewTable1?.length}
                        className="h-24 text-center"
                      >
                        Нет результатов.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-end space-x-2 p-4">
                <DataTablePagination table={table1} />
              </div>
            </div>
            <div className="mt-4 flex w-full justify-start items-center p-2">
              <Button onClick={handleSubmit} className="">
                {isLoading ? (
                  <div className="flex items-center gap-4">
                    <Loader />
                    Загрузка...
                  </div>
                ) : (
                  <h1>Подтверждение</h1>
                )}
              </Button>
            </div>
            <h1 className="font-medium textNormal">Утвержденные</h1>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table2?.getHeaderGroups()?.map((headerGroup) => (
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
                  {table2?.getRowModel()?.rows?.length ? (
                    table2?.getRowModel()?.rows?.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {/* Use Checkbox component for row selection */}
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <TableCell key={cell.id}>
                              {cell.column.columnDef.accessorKey ==
                              "createdAt" ? (
                                formatFullDate(cell.getValue())
                              ) : cell.column.columnDef.accessorKey ==
                                "brand" ? (
                                truncateText(cell.getValue(), 15)
                              ) : cell.column.columnDef.accessorKey ==
                                "price" ? (
                                `${cell.getValue()}$`
                              ) : cell.column.columnDef.accessorKey ==
                                "image" ? (
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
                        colSpan={selectReviewTable2?.length}
                        className="h-24 text-center"
                      >
                        Нет результатов.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-end space-x-2 p-4">
                <DataTablePagination table={table2} />
              </div>
            </div>
          </main>
        )}
      </>
    </div>
  );
}

// Define your column definitions
//Reviews
const selectReviewTable1 = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Message" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DeleteItemReview payment={row.original} path="review" />
    ),
  },
];
//Select Reviews
const selectReviewTable2 = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Message" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DeleteItemReview payment={row.original} path="selectReview" />
    ),
  },
];
