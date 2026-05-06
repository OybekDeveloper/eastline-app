"use client";
import React, { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { useEvent } from "@/store/event";
import { deleteData } from "@/lib/api.services";

const DeleteItemReview = ({ payment, path }) => {
  const { tableSelectReview, tableReview, setTableReview, setReflesh } =
    useEvent();

  const [open, setOpen] = useState(false);

  const deleteItem = async (payment) => {
    try {
      await deleteData(`/api/${path}?id=${payment.id}`, path);
      setOpen(false); // Close dialog after successful deletion
    } catch (error) {
      console.error(error); // Handle any errors during deletion
    }
  };
  const handleDelete = () => {
    const callFunction = deleteItem(payment);
    if (path === "review") {
      const filterData = tableReview.filter(
        (c) => String(c.id) !== String(payment.id)
      );
      setTableReview(filterData, tableSelectReview);
    } else if (path === "selectReview") {
      const filterData = tableSelectReview.filter(
        (c) => String(c.id) !== String(payment.id)
      );
      setTableReview(tableReview, filterData);
      setReflesh();
    }
    toast.promise(callFunction, {
      loading: "Данные удаляются...",
      success: <p>Данные успешно удалены!</p>,
      error: (
        <p>Произошла ошибка при удалении данных. Повторите попытку позже.</p>
      ),
    });
  };
  return (
    <Suspense>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setOpen(true);
            }}
          >
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button className="hidden">Trigger</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Это навсегда удалит вашу учетную
              запись и ваши данные с наших серверов.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Отмена
            </AlertDialogCancel>

            <AlertDialogAction
              className="hover:bg-primary"
              onClick={handleDelete}
            >
              Продолжить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Suspense>
  );
};

export default DeleteItemReview;
