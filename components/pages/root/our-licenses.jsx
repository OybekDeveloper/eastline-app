import CustomImage from "@/components/shared/customImage";
import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";

const OurLicenses = ({ sertificate, license }) => {
  return (
    <section className="bg-primary py-8 w-full h-full mt-5">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-8 gap-y-5 pt-5 w-[95%] flex-col lg:w-10/12 lg:mx-auto justify-end items-start md:justify-center mx-0 ml-auto">
        <div className="h-full col-span-2 flex flex-col-reverse lg:flex-col justify-end gap-3">
          <p className="text-secondary textSmall">
            Наша команда – это высококвалифицированные, сертифицированные
            специалисты
          </p>
          <h1 className="font-medium textNormal4 text-white">
            Наши <br className="max-md:hidden" /> сертификаты
          </h1>
          <Carousel paginate="false" className="">
            <CarouselContent className="pb-4">
              {sertificate.map((item, index) => {
                return (
                  <CarouselItem key={index}>
                    <CustomImage
                      src={item.image}
                      alt="img"
                      height={100}
                      width={100}
                      className="h-full w-full hidden lg:block"
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselCounter
              classNameCounter="lg:hidden bg-white"
            />
          </Carousel>
        </div>
        <Carousel
          className="w-full h-full text-foreground flex flex-col justify-end col-span-3"
          paginate={"false"}
        >
          <div className="hidden lg:flex justify-between items-center gap-3 mb-5">
            <h1 className="font-medium text-white textNormal3">
              Наши лицензии
            </h1>
            <div className="flex gap-2">
              <CarouselPrevious className="rounded-full p-0" />
              <CarouselNext className="rounded-full p-0" />
            </div>
          </div>
          <CarouselContent className="h-full max-md:pb-4">
            {license.map((item, index) => {
              return (
                <CarouselItem
                  key={index}
                  className="h-full basis-auto md:basis-[50%] lg:basis-[33.3%]"
                >
                  <CustomImage
                    src={item.image}
                    alt={`${item.image}`}
                    className="w-full h-full"
                    width={100}
                    height={100}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselCounter className="lg:hidden" classNameCounter="bg-white" />
        </Carousel>
      </div>
    </section>
  );
};

export default OurLicenses;
