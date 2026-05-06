"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useEffect, useMemo, useState } from "react";
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
import { Button } from "../ui/button";
import { getData, patchData, postData } from "@/lib/api.services";

const normalizeSelection = (value) => {
  const normalized = String(value ?? "").trim();
  return normalized && normalized !== "undefined" && normalized !== "null"
    ? normalized
    : "";
};

const BannerForm = ({ products, categories }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState([]);
  const categoryMap = useMemo(
    () =>
      new Map(
        (categories || []).map((category) => [String(category.id), category])
      ),
    [categories]
  );
  const productMap = useMemo(
    () =>
      new Map((products || []).map((product) => [String(product.id), product])),
    [products]
  );
  const productToCategoryMap = useMemo(() => {
    const map = new Map();

    for (const category of categories || []) {
      for (const product of category.products || []) {
        map.set(String(product.id), category);
      }
    }

    return map;
  }, [categories]);
  const form = useForm({
    resolver: zodResolver(Banner),
    defaultValues: {
      categoryId: "",
      productId: "",
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
    const currentValues = form.getValues();
    let selectedProductId = normalizeSelection(
      currentValues.productId || values.productId
    );
    let selectedCategoryId = normalizeSelection(
      currentValues.categoryId || values.categoryId
    );

    if (selectedCategoryId) {
      selectedProductId = "";
    }

    let categoryData = null;

    if (selectedProductId) {
      categoryData = productToCategoryMap.get(selectedProductId) || null;

      if (!categoryData) {
        const selectedProduct = productMap.get(selectedProductId);
        const fallbackCategoryId = normalizeSelection(
          selectedProduct?.categoryId || selectedProduct?.category?.id
        );
        if (fallbackCategoryId) {
          categoryData = categoryMap.get(fallbackCategoryId) || null;
          selectedCategoryId = fallbackCategoryId;
        }
      }
    }

    if (!categoryData && selectedCategoryId) {
      categoryData = categoryMap.get(selectedCategoryId) || null;
    }

    if (!categoryData) {
      toast.error("Выберите продукт или категорию");
      return;
    }

    if (!image.length) {
      toast.error("Пожалуйста, выберите изображение");
      return;
    }

    const topCategoryId = normalizeSelection(
      categoryData.topCategoryId || categoryData.topCategory?.id
    );
    const categoryId = normalizeSelection(categoryData.id || selectedCategoryId);

    if (!topCategoryId || !categoryId) {
      toast.error("У выбранной категории не найдена верхняя категория");
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
      const bannerSortData = await getData("/api/bannerSort", "banner");
      const data = {
        topCategoryId,
        categoryId,
        productId: selectedProductId ? String(selectedProductId) : null,
        image: uploadedUrl,
      };

      if (id) {
        await patchData(`/api/banner?id=${id}`, data, "banner");

        const findBanner = bannerSortData.find(
          (c) => String(c.bannerId) === String(id)
        );

        if (findBanner) {
          await patchData(
            `/api/bannerSort?id=${findBanner.id}`,
            {
              ...data,
              bannerId: String(id),
            },
            "banner"
          );
        }

        toast.success("Баннер изменен успешно!");
        router.back();
      } else {
        const res = await postData("/api/banner", data, "banner");

        if (res) {
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

        toast.success("Баннер создан успешно!");
      }

      form.reset({
        categoryId: "",
        productId: "",
      });
      setImage([]);
    } catch (error) {
      console.error("Error processing banner:", error);
      toast.error("Что-то пошло не так. Пожалуйста, повторите попытку позже.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = (e) => {
    e.preventDefault();
    form.reset({
      categoryId: "",
      productId: "",
    });
    form.clearErrors(["categoryId", "productId"]);
  };

  const handleCategoryChange = (value) => {
    const categoryId = normalizeSelection(value);
    toast.dismiss();
    form.setValue("categoryId", categoryId, {
      shouldDirty: true,
      shouldValidate: false,
    });
    form.setValue("productId", "", {
      shouldDirty: true,
      shouldValidate: false,
    });
    form.clearErrors(["categoryId", "productId"]);
  };

  const handleProductChange = (value) => {
    const productId = normalizeSelection(value);
    toast.dismiss();
    form.setValue("productId", productId, {
      shouldDirty: true,
      shouldValidate: false,
    });
    form.setValue("categoryId", "", {
      shouldDirty: true,
      shouldValidate: false,
    });
    form.clearErrors(["categoryId", "productId"]);
  };

  useEffect(() => {
    async function updateData() {
      try {
        const res = await getData(`/api/banner?id=${id}`, "banner");
        const banner = res?.[0];

        if (banner) {
          const { productId, categoryId, image } = banner;
          const initialProductId = normalizeSelection(productId);
          const initialCategoryId = normalizeSelection(categoryId);

          form.reset({
            productId: initialProductId,
            categoryId: initialProductId ? "" : initialCategoryId,
          });
          form.clearErrors(["categoryId", "productId"]);
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
            <div className="w-full space-y-6 lg:w-1/2">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="categoryId"
                label="Категория"
                placeholder="Выбрать категория"
                onValueChange={handleCategoryChange}
              >
                {categories.map((item, idx) => (
                  <SelectItem key={idx} value={`${item.id}`}>
                    <p>{item.name}</p>
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>
            <div className="w-full space-y-6 lg:w-1/2">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="productId"
                label="Продукт"
                placeholder="Выбрать продукт"
                onValueChange={handleProductChange}
              >
                {products.map((item, idx) => (
                  <SelectItem key={idx} value={`${item.id}`}>
                    <p>{item.name}</p>
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>
            <Button type="button" onClick={handleResetForm}>
              перезагрузить
            </Button>
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
