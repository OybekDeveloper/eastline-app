import {
  myService1,
  myService1p,
  myService2,
  myService2p,
  myService3,
  myService3p,
  myService4,
  myService4p,
} from "@/public/img";
import { Category, Product, TopCategory } from "./validation";
import { uzcard } from "@/public/img";
import { payme } from "@/public/img";
import { Click } from "@/public/img";
import { uzumNasiya } from "@/public/img";

const navItems = [
  { id: 1, name: "Главная", path: "/" },
  { id: 2, name: "Каталог", path: "/" },
  { id: 3, name: "Услуги", path: "/services" },
  { id: 4, name: "О нас", path: "/about-us" },
  { id: 5, name: "Отправить заявку", path: "/contacts" },
  //   { id: 3, name: "Партнёры", path: "/" },
];

const heroTitle = [
  { id: 3, name: "Услуги", path: "/services" },
  { id: 4, name: "О нас", path: "/about-us" },
  { id: 5, name: "Отправить заявку", path: "/contacts" },
  //   { id: 3, name: "Партнёры", path: "/" },
];

const crudPage = [
  { id: 1, title: "Создать верхнюю категорию", path: "/createTopCategory" },
  { id: 2, title: "Обновить верхнюю категорию", path: "/changeTopCategory" },
  { id: 3, title: "Создать категорию", path: "/createCategory" },
  { id: 4, title: "Обновить категорию", path: "/changeCategory" },
  { id: 5, title: "Создать товар", path: "/createProduct" },
  { id: 6, title: "Обновить товар", path: "/changeProduct" },
  { id: 7, title: "Создать сертификат", path: "/createSertificate" },
  { id: 8, title: "Обновить сертификат", path: "/changeSertificate" },
  { id: 9, title: "Создать лицензию", path: "/createLicense" },
  { id: 10, title: "Обновить лицензию", path: "/changeLicense" },
  { id: 11, title: "Создать новость", path: "/createNews" },
  { id: 12, title: "Обновить новость", path: "/changeNews" },
  { id: 13, title: "Создать партнёр", path: "/createPartner" },
  { id: 14, title: "Обновить партнёр", path: "/changePartner" },
  { id: 15, title: "Обновить валюта", path: "/changeCurrency" },
  { id: 16, title: "Обновить админ", path: "/changeAdmin" },
  { id: 17, title: "Создать баннер", path: "/createBanner" },
  { id: 18, title: "Обновить баннер", path: "/changeBanner" },
];

const postFields = [
  {
    id: 1,
    name: "Создать верхнюю категорию",
    path: "/createTopCategory",
    items: ["INPUT"],
    validation: TopCategory,
  },
  {
    id: 2,
    name: "Создать категорию",
    path: "/createCategory",
    items: ["INPUT", "SELECT"],
    validation: Category,
  },
  {
    id: 3,
    name: "Создать товар",
    path: "/createProduct",
    items: ["INPUT", "TEXTAREA", "INPUT", "INPUT", "INPUT", "IMAGE", "SELECT"],
    validation: Product,
  },
];

const myServiceData = [
  {
    id: 1,
    title: "Мы официальные дистрибьюторы",
    img: myService1,
    imgp: myService1p,
  },
  {
    id: 1,
    title: "Квалифицированные специалисты",
    img: myService2,
    imgp: myService2p,
  },
  {
    id: 1,
    title: "Гарантия на все оборудование",
    img: myService3,
    imgp: myService3p,
  },
  {
    id: 1,
    title: "Сертифицированные товары",
    img: myService4,
    imgp: myService4p,
  },
];

const cardsLogoData = [uzcard, payme, Click, uzumNasiya];

export {
  navItems,
  heroTitle,
  crudPage,
  postFields,
  myServiceData,
  cardsLogoData,
};
