import { z } from "zod";

export const ReviewsFormValidation = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать не менее 2 символов")
    .max(50, "Имя должно содержать не более 50 символов"),
  email: z.string().email("Неверный адрес электронной почты"),
  phone: z
    .string()
    .refine(
      (phone) => /^\+\d{10,15}$/.test(phone),
      "Неправильный номер телефона"
    ),
  message: z
    .string()
    .min(20, "Сообщение должно быть не менее 20 символов")
    .max(500, "Сообщение должно содержать не более 500 символов"),
});
export const TopCategory = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать не менее 2 символов")
    .max(50, "Имя должно содержать не более 30 символов"),
});
export const Category = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать не менее 2 символов")
    .max(100, "Имя должно содержать не более 100 символов"),
  topCategoryId: z.string().nonempty("Выберите одну из верхнюю категорий"),
  meta_title: z
    .string()
    .max(150, "Meta title должно содержать не более 150 символов")
    .optional()
    .or(z.literal("")),
  meta_description: z
    .string()
    .max(300, "Meta description должно содержать не более 300 символов")
    .optional()
    .or(z.literal("")),
});
export const Currency = z.object({
  sum: z.string().refine((val) => !isNaN(Number(val.replace(/\s/g, ""))), {
    message: "Неверная сумма",
  }),
});

export const Sertificate = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать не менее 2 символов")
    .max(30, "Имя должно содержать не более 30 символов"),
});
export const AdminValidate = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать не менее 2 символов")
    .max(30, "Имя должно содержать не более 30 символов"),
  password: z
    .string()
    .min(4, "Имя должно содержать не менее 2 символов")
    .max(30, "Имя должно содержать не более 30 символов"),
});

export const Product = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать не менее 2 символов")
    .max(100, "Имя должно содержать не более 100 символов"),
  categoryId: z.string().nonempty(),
  description: z
    .string()
    .min(10, "Сообщение должно быть не менее 10 символов")
    .max(500, "Сообщение должно содержать не более 500 символов"),
  feature: z.string(),
  price: z.string().min(1, "В это поле необходимо ввести информацию "),
  brand: z.string().min(1, "В это поле необходимо ввести информацию "),
  meta_title: z
    .string()
    .max(150, "Meta title должно содержать не более 150 символов")
    .optional()
    .or(z.literal("")),
  meta_description: z
    .string()
    .max(300, "Meta description должно содержать не более 300 символов")
    .optional()
    .or(z.literal("")),
});
export const Banner = z.object({
  productId: z.string().optional(), // productId majburiy emas
  categoryId: z.string().optional() // categoryId majburiy emas
});
export const LoginValidate = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать не менее 2 символов")
    .max(50, "Имя должно содержать не более 50 символов"),
  password: z.string().min(2, "Имя должно содержать не менее 2 символов"),
});

export const ContactsValidation = z.object({
  company_name: z
    .string()
    .min(2, "Название компании должно содержать не менее 2 символов")
    .max(100, "Название компании не должно превышать 100 символов")
    .refine((value) => value.trim() !== "", "Название компании обязательно"), // Check for non-empty

  phone1: z
    .string()
    .refine((phone) => phone, "Неправильный номер телефона")
    .refine((value) => value.trim() !== "", "Телефон обязателен"), // Check for non-empty

  phone2: z.string().optional(),

  work_hours: z
    .string()
    .min(2, "Часы работы должны содержать не менее 2 символов")
    .max(200, "Часы работы не должны превышать 50 символов")
    .refine((value) => value.trim() !== "", "Часы работы обязательны"), // Check for non-empty

  email: z
    .string()
    .email("Неверный адрес электронной почты")
    .refine((value) => value.trim() !== "", "Электронная почта обязательна"), // Check for non-empty

  address: z
    .string()
    .min(5, "Адрес должен содержать не менее 5 символов")
    .max(200, "Адрес не должен превышать 200 символов")
    .refine((value) => value.trim() !== "", "Адрес обязателен"), // Check for non-empty

  telegram: z.string().optional(),
  telegram_bot: z.string().optional(),

  facebook: z.string().optional(),

  instagram: z.string().optional(),

  youtube: z.string().optional(),

  footer_info: z
    .string()
    .min(10, "Footer info должно содержать не менее 10 символов")
    .refine((value) => value.trim() !== "", "Footer info обязательно"), // Check for non-empty

  experience_info: z
    .string()
    .min(10, "Experience info должно содержать не менее 10 символов")
    .refine((value) => value.trim() !== "", "Experience info обязательно"), // Check for non-empty
    more_call_info: z
    .string()
    .min(1, "Experience info должно содержать не менее 10 символов")
    .refine((value) => value.trim() !== "", "Experience info обязательно"), // Check for non-empty

  createdAt: z.date().optional(), // Optional to handle auto-generated field
  updateAt: z.date().optional(), // Optional to handle auto-generated field
});
