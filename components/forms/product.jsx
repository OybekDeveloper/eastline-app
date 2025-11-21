"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormLabel } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../shared/customFormField";
import { Product } from "@/lib/validation";
import SubmitButton from "../shared/submitButton";
import axios from "axios";
import toast from "react-hot-toast";
import Container from "../shared/container";
import { ChevronLeft } from "lucide-react";
import { SelectItem } from "../ui/select";
import DropTarget from "../shared/fileDnd";
import { sanitizeString } from "@/lib/utils";
import Todo from "../shared/note/NotePicker";
import { revalidatePath } from "@/lib/revalidate";
import {
  getData,
  patchData,
  postData,
  revalidateUpdate,
} from "@/lib/api.services";

const ProductForm = ({ categories }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

  const handleContentChange = (reason) => {
    form.setValue("feature", reason);
  };

  const dataURLToBlob = (dataURL) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const form = useForm({
    resolver: zodResolver(Product),
    defaultValues: {
      categoryId: "",
      description: "",
      feature: "",
      brand: "",
      name: "",
      topCategoryId: "",
      meta_title: "",
      meta_description: "",
    },
  });

  const upload = async () => {
    let urlArr = [];

    for (const image of images) {
      // If the image is already uploaded (has a URL but no file), keep the existing URL
      if (!image.file) {
        urlArr.push(image.url);
        continue;
      }

      // Prepare the file to upload
      let fileToUpload = image.file;
      if (image.cropped) {
        fileToUpload = dataURLToBlob(image.url);
      }

      const formData = new FormData();
      formData.append("file", fileToUpload, sanitizeString(image.name));

      try {
        // Make API call to Cloudflare R2 upload endpoint
        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          urlArr.push(response.data.url);
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        console.error("Error uploading to Cloudflare R2:", error);
        toast.error(`Failed to upload ${image.name}`);
      }
    }

    return urlArr;
  };

  const onSubmit = async (values) => {
    if (!images.length) {
      toast.error("Пожалуйста, выберите изображение");
      return;
    }

    if (!values.feature.length) {
      toast.error("Напишите, пожалуйста, характеристика");
      return;
    }
    setIsLoading(true);

    try {
      const imagesUpload = await upload();
      if (id) {
        const res = await patchData(
          `/api/product?id=${id}`,
          {
            ...values,
            images: imagesUpload,
          },
          "product"
        );
        if (res) {
          toast.success("Товар изменена успешно!");
          router.back();
        }
      } else {
        await postData(
          "/api/product",
          { ...values, images: imagesUpload },
          "product"
        );
        toast.success("Товар создан успешно!");
      }
      await revalidateUpdate("category");
      await revalidateUpdate("topCategory");

      form.reset();
      revalidatePath("product");
      revalidatePath("changeProduct");
      setImages([]);
      setIsLoading(false);
      setContent("");
    } catch (error) {
      console.log(error);
      toast.error("Что-то пошло не так. Пожалуйста, повторите попытку позже.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function updateData() {
      try {
        const res = await getData(`/api/product?id=${id}`, "product");
        if (res) {
          const {
            name,
            description,
            feature,
            brand,
            price,
            categoryId,
            image,
            meta_title,
            meta_description,
          } = res[0];
          form.setValue("name", name);
          form.setValue("description", description);
          form.setValue("feature", feature);
          form.setValue("brand", brand);
          form.setValue("price", price);
          form.setValue("categoryId", categoryId);
          form.setValue("meta_title", meta_title || "");
          form.setValue("meta_description", meta_description || "");
          setImages(
            image.map((img) => {
              return {
                url: img,
              };
            })
          );
          setContent(feature);
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
            onClick={() => router.back()}
          />
          <p>{id ? "Изменить" : "Создать"} товар</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 w-full "
          >
            <div className="w-full space-y-6 lg:w-1/2">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Название товара"
              />
              <CustomFormField
                fieldType={FormFieldType.NUMBER}
                control={form.control}
                name="price"
                label="Цена продукта"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="brand"
                label="Бренд продукта"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="description"
                label="Описание продукта"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="meta_title"
                label="Meta Title"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="meta_description"
                label="Meta Description"
              />
              <div>
                <FormLabel className="text-xs lg:text-base">
                  Характеристика продукта
                </FormLabel>
                <Todo
                  handleContentChange={handleContentChange}
                  content={content}
                />
              </div>
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="categoryId"
                label="Категория"
                placeholder="Выберите категорию"
              >
                {categories.map((category, idx) => (
                  <SelectItem key={idx} value={`${category.id}`}>
                    <p>{category.name}</p>
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>
            <div className="my-6">
              <DropTarget images={images} setImages={setImages} limitImg={3} />
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

export default ProductForm;
