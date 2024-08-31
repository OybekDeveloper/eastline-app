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
import { sanitizeString, supabase } from "@/lib/utils";
import Todo from "../shared/note/NotePicker";

const ProductForm = ({ categories }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

  const handleContentChange = (reason) => {
    setContent(reason);
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
    },
  });

  const upload = async () => {
    let urlArr = [];

    for (const image of images) {
      let imageToUpload = image.file;
      if (!imageToUpload) {
        urlArr.push(image.url);
        continue;
      }

      if (image.cropped) {
        imageToUpload = dataURLToBlob(image.url);
      }
      const imageName = sanitizeString(image.name);

      // File doesn't exist, upload it
      const { data, error: uploadError } = await supabase.storage
        .from("eastLine_images")
        .upload(imageName, imageToUpload);

      if (uploadError) {
        console.log("Error uploading image:", uploadError);
        const { data: newPublicUrlData } = supabase.storage
          .from("eastLine_images")
          .getPublicUrl(imageName);

        console.log("Exist URL:", newPublicUrlData.publicUrl);
        urlArr.push(newPublicUrlData.publicUrl);
      } else {
        console.log("Image uploaded successfully:", data);

        const { data: newPublicUrlData } = supabase.storage
          .from("eastLine_images")
          .getPublicUrl(imageName);

        console.log("Public URL:", newPublicUrlData.publicUrl);
        urlArr.push(newPublicUrlData.publicUrl);
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
        const updateImages = console.log(imagesUpload, "upload image");
        const res = await axios.patch(`/api/product?id=${id}`, {
          ...values,
          images: imagesUpload,
        });
        if (res) {
          toast.success("Товар изменена успешно!");
          router.back()
        }
      } else {
        await axios.post("/api/product", { ...values, images: imagesUpload });
        toast.success("Товар создан успешно!");
      }

      form.reset();
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
        const res = await axios.get(`/api/product?id=${id}`);
        if (res) {
          const { name, description, feature, brand, price, categoryId, image } =
            res.data.data[0];
          form.setValue("name", name);
          form.setValue("description", description);
          form.setValue("feature", feature);
          form.setValue("brand", brand);
          form.setValue("price", price);
          form.setValue("categoryId", categoryId);
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
        {/* <Notes /> */}
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
              <div>
                <FormLabel className="text-xs lg:text-base">
                  Характеристика продукта
                </FormLabel>
                <Todo
                  handleContentChange={handleContentChange}
                  content={content}
                />
                {/* <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="feature"
              label="Характеристика продукта"
            /> */}
              </div>
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="categoryId"
                label="Категория"
                placeholder="Выберите категорию"
              >
                {categories.map((category) => (
                  <SelectItem key={category.id} value={`${category.id}`}>
                    <p>{category.name}</p>
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>
            <div className="my-6">
              <DropTarget images={images} setImages={setImages} />
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
