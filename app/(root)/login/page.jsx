"use client";

import Container from "@/components/shared/container";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/customFormField";
import SubmitButton from "@/components/shared/submitButton";
import { Form } from "@/components/ui/form";
import { LoginValidate } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Cookies from "js-cookie"; // Import js-cookie
import Link from "next/link";

function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(LoginValidate),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    const response = await fetch(`/api/product`, {
      next: { tags: [`product`] },
      cache: "no-cache",
      cache: "no-store",
    });
    const { data } = await response.json();
    console.log(data,"data");
    
    setIsLoading(true);
    try {
      const user = {
        name: values.name,
        password: values.password,
      };
      const res = await axios.post("/api/admin", user);
      toast.success("Вы успешно авторизованы!");
      Cookies.set(
        "date",
        JSON.stringify({
          expiresAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
        })
      );
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error(
        error.response.data.message
          ? error.response.data.message
          : "Неправильное имя пользователя или пароль."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="h-screen w-screen py-10 flex justify-center items-center flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-[400px] max-sm:w-10/12 space-y-4 w-full"
        >
          <h1 className="text-primary textNormal5 font-semibold mb-5">
            Вход в систему
          </h1>
          <div className="w-full space-y-6">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Имя пользователя"
              placeholder="Имя пользователя"
            />
            <CustomFormField
              fieldType={FormFieldType.PASSWORDINPUT}
              control={form.control}
              name="password"
              label="Ваш пароль"
              placeholder="Пароль"
            />
          </div>
          <SubmitButton isLoading={isLoading} className="w-full">
            Входить
          </SubmitButton>
        </form>
        <Link className="mt-4 font-medium text-primary textSmall4" href={"/"}>
          Вернуться в главное меню
        </Link>
      </Form>
    </Container>
  );
}

export default Login;
