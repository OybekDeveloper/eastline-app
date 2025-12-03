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
import { sanitizeString } from "@/lib/utils";
import { getData, patchData, postData } from "@/lib/api.services";
import DragDropComponent from "../shared/dragDropComponent";
import SeoMetadataForm, { createSeoDefaults } from "./seoMetadata";
import {
  mapCustomMetaEntries,
  stringifyStructuredData,
  toCustomMetaArray,
} from "./seoFormHelpers";

const CategoryForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [topCategories, setTopCategories] = useState([]);
  const [productSort, setProductSort] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState([]);
  const [productsData, setProducts] = useState([]);

  const form = useForm({
    resolver: zodResolver(Category),
    defaultValues: {
      name: "",
      topCategoryId: "",
      seo: createSeoDefaults("category"),
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

      const customMetaMap = mapCustomMetaEntries(values.seo?.custom_meta);
      const seoPayload = {
        ...values.seo,
        custom_meta: customMetaMap,
      };
      const payload = {
        ...values,
        seo: seoPayload,
        meta_title: seoPayload.meta_title || null,
        meta_description: seoPayload.meta_description || null,
      };

    // Handle form submission
    if (id) {
        const categorySort = await getData(
          `/api/categorySort?categoryId=${id}`,
          "category"
        );
        await patchData(
          `/api/category?id=${id}`,
          {
            ...payload,
            image: uploadedUrl,
          },
          "category"
        );
        if (categorySort[0]) {
          const { categoryId, id: sort_id, uniqueId } = categorySort[0];
          await patchData(
            `/api/categorySort?id=${sort_id}`,
            {
              categoryId: categoryId,
              topCategorySortId: values.topCategoryId,
              name: values.name,
              uniqueId: uniqueId,
            },
            "category"
          );
        }
        toast.success("Категория изменена успешно!");
        router.back();
      } else {
        const res = await postData(
          "/api/category",
          {
            ...payload,
            image: uploadedUrl,
          },
          "category"
        );
        if (res.data) {
          const { name, id, topCategoryId } = res.data;
          const ress = await postData(
            `/api/categorySort`,
            {
              name: name,
              topCategorySortId: topCategoryId,
              categoryId: id,
              uniqueId: 9999,
            },
            "category"
          );
          if (ress) {
            toast.success("Категория создана успешно!");
            form.reset();
            setImage([]);
          }
        }
      }
      revalidatePath("category"); // Revalidate category path
    } catch (error) {
      console.error("Error processing category:", error);
      toast.error("Что-то пошло не так. Пожалуйста, повторите попытку позже.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function updateData() {
      try {
        const res = await getData(`/api/category?id=${id}`, "category");
        const productSortRes = await getData(`/api/productSort`, "product");
        const product = await getData(`/api/product`, "product");
        setProducts(product);
        const filterProduct = product?.filter((p) => String(p.categoryId) === String(id))
        if (res) {
          const {
            name,
            topCategoryId,
            image,
            products,
            meta_title,
            meta_description,
            seo = {},
          } = res[0];
          form.setValue("name", name);
          form.setValue("topCategoryId", topCategoryId);
          form.setValue("seo.meta_title", seo.meta_title || meta_title || "");
          form.setValue(
            "seo.meta_description",
            seo.meta_description || meta_description || ""
          );
          form.setValue("seo.meta_keywords", seo.meta_keywords || []);
          form.setValue("seo.meta_robots", seo.meta_robots || "");
          form.setValue("seo.canonical_url", seo.canonical_url || "");
          form.setValue(
            "seo.open_graph.og_title",
            seo.open_graph?.og_title || ""
          );
          form.setValue(
            "seo.open_graph.og_description",
            seo.open_graph?.og_description || ""
          );
          form.setValue(
            "seo.open_graph.og_image",
            seo.open_graph?.og_image || ""
          );
          form.setValue(
            "seo.open_graph.og_type",
            seo.open_graph?.og_type || "category"
          );
          form.setValue(
            "seo.open_graph.og_locale",
            seo.open_graph?.og_locale || ""
          );
          form.setValue(
            "seo.twitter.twitter_card",
            seo.twitter?.twitter_card || ""
          );
          form.setValue(
            "seo.twitter.twitter_title",
            seo.twitter?.twitter_title || ""
          );
          form.setValue(
            "seo.twitter.twitter_description",
            seo.twitter?.twitter_description || ""
          );
          form.setValue(
            "seo.twitter.twitter_image",
            seo.twitter?.twitter_image || ""
          );
          form.setValue(
            "seo.structured_data",
            stringifyStructuredData(seo.structured_data)
          );
          form.setValue("seo.custom_meta", toCustomMetaArray(seo.custom_meta));
          setImage([
            {
              url: image,
              name: image,
            },
          ]);

          // Filter products by categoryId
          const filterProductData = productSortRes?.filter(
            (p) => String(p.categoryId) === String(id)
          );
          console.log({ filterProductData, filterProduct })
          const noSortDatas = filterProductData?.filter(pr => filterProduct?.find(pd => pd?.id == pr?.productId))
          const noSortDatasProduct = filterProduct?.filter(pr => !filterProductData?.find(pd => pd?.productId == pr?.id)).map((p, idx) => {
            return {
              categoryId: p?.categoryId,
              productId: p?.id,
              uniqueId: 999 + idx,
              name: p?.name,
              id: 1000 + idx
            }
          })
          const filterSortData = [...noSortDatas, ...noSortDatasProduct]
          console.log({ noSortDatas, filterSortData, noSortDatasProduct })
          if (filterProductData?.length > 0) {
            setProductSort(filterSortData);
          } else {
            setProductSort(products || []);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    const getCategories = async () => {
      const topCategory = await getData("/api/topCategory", "topCategory");
      setTopCategories(topCategory);
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
              <SeoMetadataForm form={form} />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="topCategoryId"
                label="Верхнюю категорию"
                placeholder="Выберите верхнюю категорию"
              >
                {topCategories.map((category, idx) => (
                  <SelectItem
                    className="z-[99999]"
                    key={idx}
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
        {productSort.length > 0 && (
          <div className="p-4 rounded-md border mt-2 w-full">
            <h2 className="font-bold mb-4 textNormal3">
              Регулирование продуктов
            </h2>
            <DragDropComponent
              param="productSort"
              data={productSort}
              products={productsData}
              categories={[]}
              id={id}
            />
          </div>
        )}
      </Container>
    </Suspense>
  );
};

export default CategoryForm;
