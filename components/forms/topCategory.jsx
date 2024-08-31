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

const TopCategoryForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(TopCategory),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      if (id) {
        await axios.patch(`/api/topCategory?id=${id}`, values);
        toast.success("Если нужно что-то изменить или уточнить, дайте знать!");
        router.back();
      } else {
        await axios.post("/api/topCategory", values);
        toast.success("Верхняя категория создана успешно!");
      }

      revalidatePath("changeTopCategory");

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
        if (res) {
          form.setValue("name", res.data.data[0].name);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (id) {
      updateData();
    }
  }, [id, form]);

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
      </Container>
    </Suspense>
  );
};

export default TopCategoryForm;
