/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../shared/dataTableColumnHeader";
import DeleteItem from "../pages/dashboard/deleteItems"; // Assuming you have a DeleteItem component for removing items

export const contacts = [
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
    accessorKey: "company_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Название компании" />
    ),
  },
  {
    accessorKey: "phone1",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Телефон 1" />
    ),
  },
  {
    accessorKey: "phone2",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Телефон 2" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Электронная почта" />
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Адрес" />
    ),
  },
  {
    accessorKey: "telegram",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Телеграм" />
    ),
  },
  {
    accessorKey: "telegram_bot",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Телеграм-бот" />
    ),
  },
  {
    accessorKey: "instagram",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Инстаграм" />
    ),
  },
  {
    accessorKey: "facebook",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Фейсбук" />
    ),
  },
  {
    accessorKey: "youtube",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ютуб" />
    ),
  },
  {
    accessorKey: "work_hours",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Часы работы" />
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
    cell: ({ row }) => <DeleteItem payment={row.original} />, // Pass the contact data for deletion
  },
];
