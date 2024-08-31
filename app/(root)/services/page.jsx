import Container from "@/components/shared/container";
import { Sertificate1, Sertificate2, ServiceBanner } from "@/public/img";
import Image from "next/image";
import React from "react";

async function Services() {
  return (
    <section className="relative min-h-screen flex items-center">
      <div className="lg:hidden block w-full h-full absolute top-20 right-0 -z-10">
        <Image
          className="absolute right-0 top-0"
          src={Sertificate1}
          alt="sertificate1"
        />
        <Image
          className="absolute right-0 top-14"
          src={Sertificate2}
          alt="sertificate2"
        />
      </div>
      <Container className="py-10 flex-col gap-5 items-start">
        <p className="text-primary textNormal5 font-semibold">Услуги</p>
        <article className="lg:border rounded-lg w-full">
          <div className="flex flex-col items-start justify-center space-y-3 lg:shadow-lg rounded-lg lg:px-12 py-3 lg:py-8 relative lg:overflow-hidden min-h-[130px]">
            <Image
              src={ServiceBanner}
              className="lg:block hidden w-full h-full absolute top-0 right-0 -z-10"
              alt="bgBanner"
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