"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../shared/customFormField";
import { Sertificate } from "@/lib/validation";
import SubmitButton from "../shared/submitButton";
import axios from "axios";
import toast from "react-hot-toast";
import Container from "../shared/container";
import { ChevronLeft } from "lucide-react";
import { revalidatePath } from "@/lib/revalidate";
import DropTarget from "../shared/fileDnd";
import { sanitizeString, supabase } from "@/lib/utils";

const NewsForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState([]);

  const form = useForm({
    resolver: zodResolver(Sertificate),
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
        if (image.cropped) {
          imageToUpload = dataURLToBlob(image[0].url);
        }
        const imageName = sanitizeString(image[0].name);

        // File doesn't exist, upload it
        const { data, error: uploadError } = await supabase.storage
          .from("eastLine_images")
          .upload(imageName, imageToUpload);

        if (uploadError && uploadError.statusCode == 409) {
          console.log("Error uploading image:", uploadError);
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
        await axios.patch(`/api/news?id=${id}`, {
          ...values,
          image: uploadedUrl ? uploadedUrl : image[0].url,
        });
        toast.success("Новости изменена успешно!");
        router.back()
      } else {
        await axios.post("/api/news", { ...values, image: uploadedUrl });
        toast.success("Новости создана успешно!");
      }

      form.reset();
      setImage([]);
      revalidatePath("changenews");
    } catch (error) {
      console.error("Error creating news:", error);
      toast.error("Что-то пошло не так. Пожалуйста, повторите попытку позже.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    async function updateData() {
      try {
        const res = await axios.get(`/api/news?id=${id}`);
        if (res) {
          const { name, image } = res.data.data[0];
          form.setValue("name", name);
          setImage([
            {
              url: image,
              name: image,
            },
          ]);
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
          <p>Создать новости</p>
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
                label="Название партнёр"
              />
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

export default NewsForm;
