"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../shared/customFormField";
import { Banner } from "@/lib/validation";
import SubmitButton from "../shared/submitButton";
import axios from "axios";
import toast from "react-hot-toast";
import Container from "../shared/container";
import { ChevronLeft } from "lucide-react";
import DropTarget from "../shared/fileDnd";
import { sanitizeString, supabase } from "@/lib/utils";
import { SelectItem } from "../ui/select";
import { topCategory } from "../tableColumns/topCategory";
import { revalidatePath } from "@/lib/revalidate";

const BannerForm = ({ products, categories }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState([]);
  const form = useForm({
    resolver: zodResolver(Banner),
    defaultValues: {
      name: "",
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
    const categoryData = categories.find((c) =>
      c.products?.some((product) => +product.id === +values.productId)
    );

    if (!image.length) {
      toast.error("Пожалуйста, выберите изображение");
      return;
    }

    setIsLoading(true);
    let uploadedUrl = "";

    let imageToUpload = image[0]?.file;
    if (imageToUpload) {
      if (image[0]?.cropped) {
        imageToUpload = dataURLToBlob(image[0].url);
      }

      try {
        const imageName = sanitizeString(image[0].name);

        if (!imageName) {
          throw new Error("Image name is undefined or invalid");
        }

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
        setIsLoading(false);
        return;
      }
    }

    try {
      if (categoryData) {
        const { topCategoryId } = categoryData;
        if (id) {
          await axios.patch(`/api/banner?id=${id}`, {
            productId: Number(values.productId),
            topCategoryId: Number(topCategoryId),
            categoryId: Number(categoryData?.id),
            image: uploadedUrl ? uploadedUrl : image[0].url,
          });
          toast.success("Партнер изменена успешно!");
          router.back()
        } else {
          await axios.post("/api/banner", {
            productId: Number(values.productId),
            image: uploadedUrl,
            topCategoryId: Number(topCategoryId),
            categoryId: Number(categoryData?.id),
          });
          toast.success("Партнер создана успешно!");
        }
        form.reset();
        setImage([]);
        revalidatePath("changeBanner");
        revalidatePath("banner");
      }
    } catch (error) {
      console.error("Error creating partner:", error);
      toast.error("Что-то пошло не так. Пожалуйста, повторите попытку позже.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function updateData() {
      try {
        const res = await axios.get(`/api/banner?id=${id}`);
        if (res) {
          const { productId, image } = res.data.data[0];
          form.setValue("productId", productId);
          setImage([
            {
              url: image,
              name: image,
            },
          ]);
        }
      } catch (error) {
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
            onClick={() => router.back()}
          />
          <p>{id ? "Обновить баннер" : "Создать баннер"}</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 w-full"
          >
            <div className="w-full space-y-6 lg:w-1/2">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="productId"
                label="Продукт"
                placeholder="Выбрать продукт"
              >
                {products.map((item) => (
                  <SelectItem key={item.id} value={`${item.id}`}>
                    <p>{item.name}</p>
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

export default BannerForm;
