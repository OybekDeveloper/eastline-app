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
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useEvent } from "@/store/event";
import { revalidatePath } from "@/lib/revalidate";
import { ApiService } from "@/lib/api.services";

const DeleteItem = ({ payment, only }) => {
  const { setReflesh } = useEvent();
  const { setTableData, changeTableData } = useEvent();

  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const deleteItem = async (payment) => {
    const pathName =
      pathname.split("/")[2].slice(6).toLowerCase().slice(0, 1) +
      pathname.split("/")[2].slice(6).slice(1);
    try {
      const response = await axios.delete(`/api/${pathName}`, {
        params: {
          id: payment.id,
        },
      });

      if (pathName == "topCategory") {
        const topCategorySortData = await axios.get(`/api/topCategorySort`);
        const delId = topCategorySortData.find(
          (c) => +c.topCategoryId === payment.id
        ).id;
        if (delId) {
          await axios.delete(`/api/topCategorySort`, {
            params: {
              id: delId,
            },
          });
        }
      }
      if (pathName == "banner") {
        const bannerSortData = await axios.get(`/api/bannerSort`);
        const delId = bannerSortData.data.data.find(
          (c) => +c.bannerId === payment.id
        ).id;
        if (delId) {
          await axios.delete(`/api/bannerSort`, {
            params: {
              id: delId,
            },
          });
        }
      }
      if (pathName == "category") {
        const categorySort = await axios.get(`/api/categorySort`);
        const delId = categorySort.data.data.find(
          (c) => +c.categoryId === payment.id
        ).id;
        if (delId) {
          await axios.delete(`/api/categorySort`, {
            params: {
              id: delId,
            },
          });
        }
      }
      if (response) {
        // Force refresh by navigating to the same page
        router.push(pathname);
      }

      setOpen(false); // Close dialog after successful deletion
    } catch (error) {
      console.error(error); // Handle any errors during deletion
    }
  };
  const handleDelete = () => {
    revalidatePath(
      `${
        pathname.split("/")[2].slice(6).toLowerCase().slice(0, 1) +
        pathname.split("/")[2].slice(6).slice(1)
      }`
    );
    const callFunction = deleteItem(payment);
    const filterData = changeTableData.filter((c) => +c.id !== +payment.id);
    setTableData(filterData);
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
          <DropdownMenuItem onClick={() => console.log(payment)}>
            <Link
              href={`/dashboard/${`create${pathname
                .split("/")[2]
                .slice(6)}`}?id=${payment.id}`}
            >
              Изменить продукт
            </Link>
          </DropdownMenuItem>
          {!only && (
            <DropdownMenuItem
              onClick={() => {
                setOpen(true);
              }}
            >
              Удалить
            </DropdownMenuItem>
          )}
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

export default DeleteItem;
