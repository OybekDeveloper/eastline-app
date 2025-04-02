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
import { sanitizeString } from "@/lib/utils";
import { getData, patchData, postData } from "@/lib/api.services";

const LicenseForm = () => {
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

      // Handle form submission
      if (id) {
        await patchData(
          `/api/license?id=${id}`,
          {
            ...values,
            image: uploadedUrl,
          },
          "license"
        );
        toast.success("Сертификат изменена успешно!");
        router.back();
      } else {
        await postData(
          "/api/license",
          { ...values, image: uploadedUrl },
          "license"
        );
        toast.success("Сертификат создана успешно!");
      }

      form.reset();
      setImage([]);
      revalidatePath("changelicense");
      revalidatePath("license");
    } catch (error) {
      console.error("Error processing license:", error);
      toast.error("Что-то пошло не так. Пожалуйста, повторите попытку позже.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function updateData() {
      try {
        const res = await getData(`/api/license?id=${id}`, "license");
        if (res) {
          const { name, image } = res[0];
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
          <p>Создать лицензия</p>
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
                label="Название лицензия"
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

export default LicenseForm;