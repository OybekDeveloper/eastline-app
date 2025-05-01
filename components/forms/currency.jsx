"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../shared/customFormField";
import { Currency } from "@/lib/validation";
import SubmitButton from "../shared/submitButton";
import axios from "axios";
import toast from "react-hot-toast";
import Container from "../shared/container";
import { ChevronLeft } from "lucide-react";
import { getData, patchData } from "@/lib/api.services";

const CurrencySum = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(Currency),
    defaultValues: {
      sum: "",
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);

    try {
      await patchData("/api/currency", values, "currency");

      toast.success("Валюта успешно изменена!");
      localStorage.setItem("sum", values.sum);
    } catch (error) {
      console.error("Error creating currency:", error);
      toast.error("Что-то пошло не так. Пожалуйста, повторите попытку позже.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData("/api/currency", "currency");
        console.log(response);

        const data = response[0];
        form.setValue("sum", data.sum);
      } catch (error) {
        console.error("Error fetching currency data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container className="my-10 lg:my-20 flex-col items-start">
      <div className="text-primary textNormal5 font-semibold mb-5 flex items-center">
        <ChevronLeft
          className="cursor-pointer w-8 h-8 lg:w-12 lg:h-12"
          onClick={() => router.back()}
        />
        <p>Изменить валюту</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 w-full">
          <div className="w-full space-y-6 lg:w-1/2">
            <p className="textSmall3">Введите сумму в сомах к 1 доллару</p>

            <CustomFormField
              fieldType={FormFieldType.CURRENCY}
              control={form.control}
              name="sum"
              label="Сум"
            />
            <SubmitButton isLoading={isLoading} className="w-full">
              Отправить
            </SubmitButton>
          </div>
        </form>
      </Form>
    </Container>
  );
};

export default CurrencySum;
