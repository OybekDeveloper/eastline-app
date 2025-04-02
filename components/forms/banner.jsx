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
import { sanitizeString } from "@/lib/utils";
import { SelectItem } from "../ui/select";
import { topCategory } from "../tableColumns/topCategory";
import { revalidatePath } from "@/lib/revalidate";
import { Button } from "../ui/button";
import { getData, patchData, postData } from "@/lib/api.services";

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
    let categoryData;
    console.log(categories);

    if (values.productId) {
      categoryData = categories.find((c) =>
        c.products?.some(
          (product) => String(product.id) == String(values.productId)
        )
      );
    } else {
      categoryData = categories.find(
        (c) => String(c.id) === String(values.categoryId)
      );
    }

    if (!image.length) {
      toast.error("Пожалуйста, выберите изображение");
      return;
    }

    setIsLoading(true);
    let uploadedUrl = "";

    try {
      // If there's a file to upload (new or cropped image)
      if (image[0]?.file) {
        let imageToUpload = image[0].file;
        if (image[0]?.cropped) {
          imageToUpload = dataURLToBlob(image[0].url);
        }

        const formData = new FormData();
        formData.append("file", imageToUpload, sanitizeString(image[0].name));

        // Upload to Cloudflare R2 via API
        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          uploadedUrl = response.data.url;
        } else {
          throw new Error("Upload failed");
        }
      } else {
        // If no file (existing image), use the current URL
        uploadedUrl = image[0].url;
      }
      console.log(categoryData);

      // Handle form submission
      if (categoryData) {
        const { topCategoryId, id: categoryId } = categoryData;
        const bannerSortData = await getData("/api/bannerSort", "banner");

        let data = {
          topCategoryId: String(topCategoryId),
          categoryId: String(categoryId),
          image: uploadedUrl,
        };

        if (values?.productId) {
          data.productId = String(values.productId);
        }

        if (id) {
          await patchData(`/api/banner?id=${id}`, data, "banner");

          const findBanner = bannerSortData.find(
            (c) => String(c.bannerId) === String(id)
          );

          if (findBanner) {
            let updatedData = {
              topCategoryId: String(topCategoryId),
              categoryId: String(categoryId),
              image: uploadedUrl,
            };

            if (values?.productId) {
              updatedData.productId = String(values.productId);
            }

            await patchData(
              `/api/bannerSort?id=${findBanner.id}`,
              updatedData,
              "banner"
            );
          }

          toast.success("Партнер изменена успешно!");
          router.back();
        } else {
          const res = await postData("/api/banner", data, "banner");

          if (res) {
            console.log(res, "banner data post");

            await postData(
              "/api/bannerSort?one=one",
              {
                ...data,
                bannerId: res.data.id,
                uniqueId: bannerSortData.length + 1,
              },
              "banner"
            );
          }

          toast.success("Партнер создана успешно!");
        }

        form.reset();
        setImage([]);
      }
    } catch (error) {
      console.error("Error processing banner:", error);
      toast.error("Что-то пошло не так. Пожалуйста, повторите попытку позже.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = (e) => {
    e.preventDefault();
    form.setValue("productId", "");
    form.setValue("categoryId", "");
  };

  useEffect(() => {
    async function updateData() {
      try {
        const res = await getData(`/api/banner?id=${id}`, "banner");
        if (res) {
          const { productId, image } = res[0];
          form.setValue("productId", productId);
          setImage([
            {
              url: image,
              name: image,
            },
          ]);
        }
      } catch (error) {}
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
        <h1 className="text-yellow-500">
          Выберите только один продукт или категорию
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 w-full space-y-2"
          >
            <div
              onClick={() => form.setValue("productId", "")}
              className="w-full space-y-6 lg:w-1/2"
            >
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="categoryId"
                label="Категория"
                placeholder="Выбрать категория"
              >
                {categories.map((item) => (
                  <SelectItem key={item.id} value={`${item.id}`}>
                    <p>{item.name}</p>
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>
            <div
              onClick={() => form.setValue("categoryId", "")}
              className="w-full space-y-6 lg:w-1/2"
            >
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
            <Button onClick={handleResetForm}>перезагрузить</Button>
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
