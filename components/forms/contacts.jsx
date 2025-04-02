"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormLabel } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../shared/customFormField";
import { ContactsValidation } from "@/lib/validation"; // Adjust validation schema
import SubmitButton from "../shared/submitButton";
import axios from "axios";
import toast from "react-hot-toast";
import Container from "../shared/container";
import { ChevronLeft } from "lucide-react";
import { revalidatePath } from "@/lib/revalidate";
import { getData, patchData, postData } from "@/lib/api.services";
// import Todo from "../shared/note/NotePicker";

const ContactsForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

  const form = useForm({
    resolver: zodResolver(ContactsValidation), // Use validation schema for contacts
    defaultValues: {
      company_name: "",
      phone1: "",
      phone2: "",
      work_hours: "",
      email: "",
      address: "",
      telegram: "",
      telegram_bot: "",
      facebook: "",
      instagram: "",
      youtube: "",
      footer_info: "",
      experience_info: "",
      more_call_info: "",
    },
  });

  const onSubmit = async (values) => {
    console.log(values);

    setIsLoading(true);
    try {
      if (id) {
        // Update existing contact
        await patchData(`/api/contact?id=${id}`, values, "contact");
        toast.success("Контакт обновлен успешно!");
      } else {
        // Create new contact
        await postData("/api/contact", values, "contact");
        toast.success("Контакт создан успешно!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Что-то пошло не так. Пожалуйста, повторите попытку позже.");
    } finally {
      setIsLoading(false);
      revalidatePath("changecontact");
      revalidatePath("contact");
    }
  };

  useEffect(() => {
    async function updateData() {
      try {
        const res = await getData(`/api/contact?id=${id}`, "contact");
        if (res) {
          const contactData = res.data.data;
          form.setValue("company_name", contactData.company_name);
          form.setValue("phone1", contactData.phone1);
          form.setValue("phone2", contactData.phone2);
          form.setValue("work_hours", contactData.work_hours);
          form.setValue("email", contactData.email);
          form.setValue("address", contactData.address);
          form.setValue("telegram", contactData.telegram);
          form.setValue("telegram_bot", contactData.telegram_bot);
          form.setValue("facebook", contactData.facebook);
          form.setValue("instagram", contactData.instagram);
          form.setValue("youtube", contactData.youtube);
          form.setValue("footer_info", contactData.footer_info);
          form.setValue("experience_info", contactData.experience_info);
          form.setValue("more_call_info", contactData.more_call_info);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (id) {
      updateData();
    }
  }, [id, form]);

  const handleContentChange = (reason) => {
    setContent(reason);
    form.setValue("address", reason);
  };

  return (
    <Suspense>
      <Container className="my-10 lg:my-20 flex-col items-start">
        <div className="text-primary textNormal5 font-semibold mb-5 flex items-center">
          <ChevronLeft
            className="cursor-pointer w-8 h-8 lg:w-12 lg:h-12"
            onClick={() => router.back()}
          />
          <p>{"Изменить"} контакт</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 w-full space-y-3"
          >
            <div className="w-full space-y-6 lg:w-1/2">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="company_name"
                label="Название компании"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="phone1"
                label="Телефон 1"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="phone2"
                label="Телефон 2"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="more_call_info"
                label="Больше инфо. при вызове"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="work_hours"
                label="Часы работы"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Электронная почта"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Адрес"
              />
              {/* <div>
                <FormLabel className="text-xs lg:text-base">Адрес</FormLabel>
                <Todo
                  handleContentChange={handleContentChange}
                  content={content}
                />
              </div> */}
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="telegram"
                label="Telegram"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="telegram_bot"
                label="Telegram Bot"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="facebook"
                label="Facebook"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="instagram"
                label="Instagram"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="youtube"
                label="YouTube"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="footer_info"
                label="Информация о футере"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="experience_info"
                label="Информация о навигационной панели"
              />
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

export default ContactsForm;
