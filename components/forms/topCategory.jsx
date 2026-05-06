"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";

import CustomFormField, { FormFieldType } from "../shared/customFormField";
import { TopCategory } from "@/lib/validation";
import SubmitButton from "../shared/submitButton";
import axios from "axios";
import toast from "react-hot-toast";
import Container from "../shared/container";
import { ChevronLeft } from "lucide-react";
import DragDropComponent from "../shared/dragDropComponent";
import { getData, patchData, postData } from "@/lib/api.services";
import { orderCatalogTree } from "@/lib/catalog-order";

const TopCategoryForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [categorySort, setCategorySort] = useState([]);
  const [resolvedTopCategorySortId, setResolvedTopCategorySortId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(TopCategory),
    defaultValues: {
      name: "",
    },
  });

  console.log(categorySort);

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const topCategories = await getData(
        "/api/topCategorySort",
        "topCategorySort"
      );
      const topCategorySortData = topCategories;
      if (id) {
        const topCategoryRes = await patchData(
          `/api/topCategory?id=${id}`,
          values,
          "topCategory"
        );

        if (!topCategoryRes?.success || topCategoryRes?.error) {
          throw new Error(
            topCategoryRes?.error || "Не удалось обновить верхнюю категорию"
          );
        }

        const findCategory = topCategorySortData.find(
          (c) => String(c.topCategoryId) === String(id)
        );
        if (findCategory) {
          const topCategorySortRes = await patchData(
            `/api/topCategorySort?id=${findCategory.id}`,
            values,
            "topCategorySort"
          );

          if (!topCategorySortRes?.success || topCategorySortRes?.error) {
            throw new Error(
              topCategorySortRes?.error ||
                "Не удалось обновить сортировку верхней категории"
            );
          }
        }

        toast.success("Верхняя категория изменена успешно!");
        router.back();
      } else {
        const res = await postData("/api/topCategory", values, "topCategory");

        if (!res?.data || res?.error) {
          throw new Error(res?.error || "Не удалось создать верхнюю категорию");
        }

        if (res.data) {
          const { name, id } = res.data;
          const unqId = topCategorySortData.length + 1;
          const sortRes = await postData(
            "/api/topCategorySort?one=one",
            {
              name: name,
              topCategoryId: id,
              uniqueId: unqId,
            },
            "topCategorySort"
          );

          if (!sortRes?.data || sortRes?.error) {
            throw new Error(
              sortRes?.error || "Не удалось создать сортировку верхней категории"
            );
          }
        }
        router.back();
        toast.success("Верхняя категория создана успешно!");
      }
      form.reset();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Что то пошло не так. Пожалуйста, повторите попытку позже.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function updateData() {
      try {
        const res = await getData(`/api/topCategory?id=${id}`, "topCategory");
        const categorySort = await getData(`/api/categorySort`, "categorySort");
        const topCategorySort = await getData(
          "/api/topCategorySort",
          "topCategorySort"
        );
        console.log({ res });
        const matchedTopCategorySort = topCategorySort.find(
          (c) => String(c.topCategoryId) === String(id)
        );
        const resolvedSortId = matchedTopCategorySort?.id || id;
        setResolvedTopCategorySortId(resolvedSortId);

        if (res) {
          const { name } = res[0];
          form.setValue("name", name);
          const orderedCategoryData = orderCatalogTree(
            res,
            topCategorySort,
            categorySort
          )[0]?.categories || [];
          setCategorySort(
            orderedCategoryData.map((category, index) => ({
              ...category,
              categoryId: category.id,
              topCategorySortId: resolvedSortId,
              uniqueId: Number(category.sortUniqueId ?? index + 1),
            }))
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (id) {
      updateData();
    }
  }, [id, form]);

  console.log(categorySort);

  return (
    <Suspense>
      <Container className="my-10 lg:my-20 flex-col items-start">
        <div className="text-primary textNormal5 font-semibold mb-5 flex items-center">
          <ChevronLeft
            className="cursor-pointer w-8 h-8 lg:w-12 lg:h-12"
            onClick={() => {
              router.back();
            }}
          />{" "}
          <p>
            {id ? "Обновить верхнюю категорию" : "Создать верхнюю категорию"}
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-6 w-full lg:w-1/2"
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Название категории"
            />
            <SubmitButton isLoading={isLoading} className="w-full">
              Отправить
            </SubmitButton>
          </form>
        </Form>
        {categorySort.length > 0 && (
          <div className="p-4 rounded-md border mt-2 w-full">
            <h2 className="font-bold mb-4 textNormal3">
              Регулирование категория{" "}
            </h2>
            <DragDropComponent
              param={"categorySort"}
              data={categorySort}
              id={resolvedTopCategorySortId}
            />
          </div>
        )}
      </Container>
    </Suspense>
  );
};

export default TopCategoryForm;
