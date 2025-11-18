import Container from "@/components/shared/container";
import { Sertificate1, Sertificate2, ServiceBanner } from "@/public/img";
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
  title: "Услуги EAST LINE TELEKOM",
  description:
    "Проектирование, монтаж и настройка систем безопасности, мини АТС и контроля доступа от EAST LINE TELEKOM.",
  path: "/services",
});

async function Services() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Услуги", path: "/services" },
  ]);
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Монтаж и настройка систем безопасности",
    description: metadata.description,
    areaServed: "UZ",
    serviceType: [
      "Системы видеонаблюдения",
      "Охранно-пожарная сигнализация",
      "Мини АТС",
      "Системы контроля доступа",
    ],
    provider: {
      "@type": "Organization",
      name: siteConfig.company,
      url: siteConfig.siteUrl,
    },
    url: absoluteUrl("/services"),
  };

  return (
    <section className="relative min-h-screen flex items-center">
      <JsonLd id="services-breadcrumbs" data={breadcrumbJsonLd} />
      <JsonLd id="services-schema" data={servicesSchema} />
      <div className="lg:hidden block w-full h-full absolute top-20 right-0 -z-10">
        <Image
          className="absolute right-0 top-0"
          src={Sertificate1}
          alt="Лицензия EAST LINE TELEKOM"
        />
        <Image
          className="absolute right-0 top-14"
          src={Sertificate2}
          alt="Лицензии компании EAST LINE TELEKOM"
        />
      </div>
      <Container className="py-10 flex-col gap-5 items-start">
        <p className="text-primary textNormal5 font-semibold">Услуги</p>
        <article className="lg:border rounded-lg w-full">
          <div className="flex flex-col items-start justify-center space-y-3 lg:shadow-lg rounded-lg lg:px-12 py-3 lg:py-8 relative lg:overflow-hidden min-h-[130px]">
            <Image
              src={ServiceBanner}
              className="lg:block hidden w-full h-full absolute top-0 right-0 -z-10"
              alt="Монтаж и настройка оборудования EAST LINE TELEKOM"
            />
            <p className="titleBig font-semibold w-[70%]">
              Компания «East LineTelekom» осуществляет не только продажу
              оборудования, но и оказывает услуги по монтажу и настройке всего
              продеваемого оборудования.
            </p>
            <p className="textNormal w-[70%] text-secondary-foreground">
              Наша команда – это высококвалифицированные, сертифицированные
              специалисты, прошедшие обучение в России.
            </p>
            <p className="textNormal w-[70%] text-secondary-foreground">
              Мы имеем все необходимые лицензии и сертификаты необходимые для
              монтажа и настройки оборудования.
            </p>
          </div>
          <div className="flex-col items-start lg:px-12 lg:py-8 mt-8 overflow-hidden">
            <p className="textNormal2 font-semibold">
              Деятельность компании «ELT» охватывает различные направления рынка
              безопасности
            </p>
            <ul className="textSmall2 translate-x-5 mt-3 list-disc">
              <li>Системы видео-наблюдения</li>
              <li>Охрана-пожарная сигнализация</li>
              <li>Мини АТС</li>
              <li>Системы контроля доступа, турникеты</li>
            </ul>
          </div>
        </article>
      </Container>
    </section>
  );
}
export default Services
