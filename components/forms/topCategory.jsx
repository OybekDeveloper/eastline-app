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
import { revalidatePath } from "@/lib/revalidate";
import DragDropComponent from "../shared/dragDropComponent";

const TopCategoryForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [categorySort, setCategorySort] = useState([]);
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
      const topCategories = await axios.get("/api/topCategorySort");
      const topCategorySortData = topCategories.data.data;
      if (id) {
        await axios.patch(`/api/topCategory?id=${id}`, values);
        toast.success("Если нужно что-то изменить или уточнить, дайте знать!");
        const findCategory = topCategorySortData.find(
          (c) => +c.topCategoryId === +id
        );
        if (findCategory) {
          await axios.patch(
            `/api/topCategorySort?id=${findCategory.id}`,
            values
          );
        }
        router.back();
      } else {
        const res = await axios.post("/api/topCategory", values);
        if (res.data.data) {
          const { name, id } = res.data.data;
          const unqId = topCategorySortData.length + 1;
          await axios.post("/api/topCategorySort?one=one", {
            name: name,
            topCategoryId: id,
            uniqueId: unqId,
          });
        }

        toast.success("Верхняя категория создана успешно!");
      }
      revalidatePath("changeTopCategory");
      revalidatePath("topCategory");
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
        const res = await axios.get(`/api/topCategory?id=${id}`);
        const categorySort = await axios.get(`/api/categorySort`);
        const filterCategoryData = categorySort?.data?.data?.filter(
          (c) => +c.topCategorySortId === +id
        );
        console.log(filterCategoryData, "This is filter");

        if (res) {
          const { name } = res.data.data[0];
          form.setValue("name", name);
          setCategorySort(filterCategoryData);
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
            <DragDropComponent param={"categorySort"} data={categorySort} />
          </div>
        )}
      </Container>
    </Suspense>
  );
};

export default TopCategoryForm;
