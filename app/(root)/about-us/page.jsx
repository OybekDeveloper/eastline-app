import AnimatedCounter from "@/components/shared/animatedCounter";
import Container from "@/components/shared/container";
import { AboutBanner, AboutCard1, AboutCard2 } from "@/public/img";
import Image from "next/image";
import React from "react";
import JsonLd from "@/components/seo/json-ld";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildMetadata,
  siteConfig,
} from "@/lib/seo";

export const metadata = buildMetadata({
  title: "О компании EAST LINE TELEKOM",
  description:
    "История, компетенции и ценности EAST LINE TELEKOM – официального поставщика систем безопасности и мини АТС в Узбекистане.",
  path: "/about-us",
});

async function AboutUs() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "О компании", path: "/about-us" },
  ]);
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "О компании EAST LINE TELEKOM",
    description: metadata.description,
    url: absoluteUrl("/about-us"),
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.company,
    },
  };

  return (
    <main className="mb-40">
      <JsonLd id="about-breadcrumbs" data={breadcrumbJsonLd} />
      <JsonLd id="about-schema" data={aboutSchema} />
      <Container className={`flex-col`}>
        <section className="mt-5 lg:mt-20 lg:border rounded-lg">
          <div className="flex flex-col items-start justify-center space-y-3 lg:shadow-lg rounded-lg lg:px-12 py-3 lg:py-8 relative overflow-hidden min-h-[130px]">
            <Image
              src={AboutBanner}
              className="w-full h-full absolute top-0 right-0 -z-10"
              alt="Команда EAST LINE TELEKOM"
            />
            <p className="textBig font-semibold w-[75%]">
              Более 10-ти лет успешно работаем на рынке систем безопасности и
              мини АТС
            </p>
            <p className="textNormal hidden lg:block w-[75%] text-secondary-foreground">
              Основным направлением деятельности которой являются оптовые и
              розничные поставки технического оборудования. Широкий ассортимент,
              качественная продукция, ценовой уровень, ориентированный на разные
              категории потребителей. Партнерская программа, грамотные
              консультанты и квалифицированная техническая поддержка — вот
              основные составляющие успеха компании.
            </p>
          </div>
          <p className="textNormal block lg:hidden text-secondary-foreground">
            Основным направлением деятельности которой являются оптовые и
            розничные поставки технического оборудования. Широкий ассортимент,
            качественная продукция, ценовой уровень, ориентированный на разные
            категории потребителей. Партнерская программа, грамотные
            консультанты и квалифицированная техническая поддержка — вот
            основные составляющие успеха компании.
          </p>
          <div className="lg:px-12 py-3 lg:py-8 lg:flex items-center justify-between space-y-5 mt-3">
            <p className="textSmall2 uppercase font-semibold lg:w-2/5">
              Мы с уверенностью смотрим в{" "}
              <span className="text-primary">будущее</span>, основывая свою
              деятельность на принципах{" "}
              <span className="text-primary">честности</span>,{" "}
              <span className="text-primary">открытости</span> и{" "}
              <span className="text-primary">порядочности</span>, стремясь c
              каждым днем <span className="text-primary">развиваться</span> и{" "}
              <span className="text-primary">совершенствоваться</span>.
            </p>
            <ul className="md:flex gap-5 lg:w-1/2 items-start textSmall3 text-center">
              <li className="flex flex-col items-center md:border-none border-b py-5">
                <span className="textBig2 font-semibold flex items-center gap-1">
                  <AnimatedCounter from={0} to={1000} /> <p>+</p>
                </span>
                <p className="uppercase text-secondary-foreground">
                  Довольных клиентов
                </p>
              </li>
              <li className="flex flex-col items-center md:border-none border-b py-5">
                <span className="textBig2 font-semibold flex items-center gap-1">
                  <AnimatedCounter from={0} to={100} /> <p>+</p>
                </span>
                <p className="uppercase text-secondary-foreground">
                  Договоров и партнёрств с лидирующими компаниями
                </p>
              </li>
              <li className="flex flex-col items-center md:border-none border-b py-5">
                <span className="textBig2 font-semibold flex items-center gap-1">
                  <AnimatedCounter from={0} to={10000} /> <p>+</p>
                </span>
                <p className="uppercase text-secondary-foreground">
                  Большой ассортимент товаров
                </p>
              </li>
            </ul>
          </div>
        </section>
        <section className="mt-5 lg:mt-20 grid xl:grid-cols-2 gap-x-3 gap-y-8">
          <Image
            src={AboutCard1}
            className="hidden xl:block w-[50vw]"
            alt="Эксперты EAST LINE TELEKOM за работой"
          />
          <Container className="xl:bg-primary xl:text-secondary w-full flex-col justify-center items-start rounded-lg px-10 py-4 gap-8 overflow-hidden">
            <div>
              <p className="textNormal2 font-semibold">
                Деятельность компании «ELT» охватывает различные направления
                рынка безопасности
              </p>
              <ul className="textSmall2 translate-x-5 mt-3 list-disc">
                <li>Системы видео-наблюдения</li>
                <li>Охрана-пожарная сигнализация</li>
                <li>Мини АТС</li>
                <li>Системы контроля доступа, турникеты</li>
              </ul>
            </div>
            <div>
              <p className="textNormal2 font-semibold">
                Наша главная задача — максимально облегчить клиенту процесс
                выбора и приобретения оборудования. Для этого мы используем
                следующие принципы работы:
              </p>
              <ul className="textSmall2 translate-x-5 mt-3 list-disc">
                <li>Большой ассортимент товаров</li>
                <li>
                  Предлагаем вступить в Партнерскую программу, благодаря которой
                  вы получаете специальные цены и рассрочку платежа
                </li>
                <li>
                  Обеспечиваем грамотную и оперативную техническую поддержку: от
                  консультации до ремонта/замены оборудования.
                </li>
                <li>
                  Помогаем подобрать оптимальный комплект оборудования
                  индивидуально для каждого клиента
                </li>
              </ul>
            </div>
          </Container>
          <Container className="xl:bg-primary xl:text-secondary w-full flex-col justify-center items-start rounded-lg px-10 py-4 gap-8">
            <div>
              <p className="textNormal2 font-semibold">
                Коллектив компании «ELT»
              </p>
              <p className="textSmall2 mt-5">
                – это главный потенциал нашего бизнеса. Мы уделяем особое
                внимание обучению и повышению профессионального уровня
                сотрудников, регулярно проводя семинары с производителями
                оборудования. Каждый сотрудник компании — это специалист
                высокого класса в своей области, который стремится работать на
                благо общего дела.
              </p>
            </div>
            <div>
              <p className="textNormal2">
                Наша команда – это высококвалифицированные, сертифицированные
                специалисты
              </p>
              <p className="textNormal2 font-semibold mt-5">
                Наши клиенты – это монтажные и торговые организации,
                государственные структуры, коммерческие организации различных
                форм собственности. Многие известные фирмы остановили свой выбор
                именно на нашей компании, как на своем надежном партнере.
              </p>
            </div>
          </Container>
          <Image
            src={AboutCard2}
            className="hidden xl:block w-[50vw]"
            alt="Лицензии и сертификаты EAST LINE TELEKOM"
          />
        </section>
        <p className="textNormal3 text-primary font-bold text-center w-10/12 mt-8 lg:mt-20">
          Мы с уверенностью смотрим в будущее, основывая свою деятельность на
          принципах честности, открытости и порядочности, стремясь c каждым днем
          развиваться и совершенствоваться.
        </p>
      </Container>
    </main>
  );
}
export default AboutUs
