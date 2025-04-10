/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../shared/dataTableColumnHeader";
import DeleteItem from "../pages/dashboard/deleteItems";

export const topCategory = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Название товара" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Создано в" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DeleteItem payment={row.original} />,
  },
];
