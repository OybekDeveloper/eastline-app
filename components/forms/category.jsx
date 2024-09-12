"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../shared/customFormField";
import { Category } from "@/lib/validation";
import SubmitButton from "../shared/submitButton";
import axios from "axios";
import toast from "react-hot-toast";
import Container from "../shared/container";
import { ChevronLeft } from "lucide-react";
import { SelectItem } from "../ui/select";
import { revalidatePath } from "@/lib/revalidate";
import DropTarget from "../shared/fileDnd";
import { sanitizeString, supabase } from "@/lib/utils";

const CategoryForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [topCategories, setTopCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState([]);

  const form = useForm({
    resolver: zodResolver(Category),
    defaultValues: {
      name: "",
      topCategoryId: "",
    },
  });

  function dataURLToBlob(dataURL) {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const onSubmit = async (values) => {
    if (!image.length) {
      toast.error("Пожалуйста, выберите изображение");
      return;
    }
    setIsLoading(true);

    if (id && image.length <= 0) {
      toast.error("Изображение обязательно для заполнения.");
      setIsLoading(false);
      return;
    }

    let uploadedUrl = "";

    let imageToUpload = image[0]?.file;

    if (imageToUpload) {
      if (image[0]?.cropped) {
        imageToUpload = dataURLToBlob(image[0].url);
      }

      try {
        if (image.cropped) {
          imageToUpload = dataURLToBlob(image[0].url);
        }
        const imageName = sanitizeString(image[0].name);
        // File doesn't exist, upload it
        const { data, error: uploadError } = await supabase.storage
          .from("eastLine_images")
          .upload(imageName, imageToUpload);

        if (uploadError && uploadError.statusCode == 409) {
          const { data: newPublicUrlData } = await supabase.storage
            .from("eastLine_images")
            .getPublicUrl(imageName);

          uploadedUrl = newPublicUrlData.publicUrl;
        } else {
          const { data: newPublicUrlData } = await supabase.storage
            .from("eastLine_images")
            .getPublicUrl(imageName);

          uploadedUrl = newPublicUrlData.publicUrl;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Ошибка загрузки изображения. Попробуйте еще раз.");
      }
    }

    try {
      if (id) {
        await axios.patch(`/api/category?id=${id}`, {
          ...values,
          image: uploadedUrl ? uploadedUrl : image[0].url,
        });
        toast.success("Категория изменена успешно!");
        router.back();
      } else {
        await axios.post("/api/category", {
          ...values,
          image: uploadedUrl,
        });
        toast.success("Категория создана успешно!");
      }

      form.reset();
      setImage([]);
      revalidatePath("changeCategory");
      revalidatePath("home");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Что-то пошло не так. Пожалуйста, повторите попытку позже.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function updateData() {
      try {
        const res = await axios.get(`/api/category?id=${id}`);
        if (res) {
          form.setValue("name", res.data.data[0].name);
          form.setValue("topCategoryId", res.data.data[0].topCategoryId);
          setImage([
            {
              url: res.data.data[0].image,
              name: res.data.data[0].image,
            },
          ]);
        }
      } catch (error) {
        console.log(error);
      }
    }
    const getCategories = async () => {
      const { data } = await axios.get("/api/topCategory");
      setTopCategories(data.data);
    };
    getCategories();

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
            onClick={() => router.back()}
          />
          <p>{id ? "Обновить категорию" : "Создать категорию"}</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 w-full"
          >
            <div className="w-full space-y-6 lg:w-1/2">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Название категории"
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="topCategoryId"
                label="Верхнюю категория"
                placeholder="Выберите верхнюю категорию"
              >
                {topCategories.map((category) => (
                  <SelectItem
                    className="z-[99999]"
                    key={`${category.id}`}
                    value={`${category.id}`}
                  >
                    <p>{category.name}</p>
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>
            <div className="my-6">
              <DropTarget images={image} setImages={setImage} limitImg={1} />
            </div>
            <SubmitButton isLoading={isLoading} className="w-full">
              Отправить
            </SubmitButton>
          </form>
        </Form>
      </Container>
    </Suspense>
  );
};

export default CategoryForm;
