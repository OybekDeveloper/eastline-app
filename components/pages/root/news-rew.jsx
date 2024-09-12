import Container from "@/components/shared/container";
import CustomImage from "@/components/shared/customImage";
import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { timeAgo, truncateText } from "@/lib/utils";
import React from "react";

const NewsRew = ({ newsItem, reviews }) => {
  const pairItems = (newsItems) => {
    const pairedArray = [];

    for (let i = 0; i < newsItems.length; i += 2) {
      pairedArray.push(newsItems.slice(i, i + 2));
    }

    return pairedArray;
  };
  const doubleItems = pairItems(newsItem);

  return (
    <Container className="mt-5 h-full py-6 rounded-xl gap-4 md:w-11/12 md:mx-auto grid md:grid-cols-2 grid-cols-1">
      <div className="py-8 md:rounded-lg bg-primary col-span-1 h-full">
        <div className="px-4 flex justify-between items-center gap-3 mb-5">
          <h1 className="font-medium text-white textNormal4">Новости</h1>
        </div>
        <Carousel className="relative" paginate={"false"}>
          <CarouselPrevious className="hidden md:flex absolute top-[43%] -left-0 rounded-md z-30 shadow-md" />
          <CarouselContent className="h-full max-md:pb-8">
            {doubleItems.map((itemPair, index) => {
              return (
                <CarouselItem
                  key={index}
                  className="basis-full h-full flex flex-col justify-between gap-2 cursor-pointer"
                >
                  {itemPair.map((item, i) => (
                    <div
                      key={i}
                      className={`w-full h-[150px] md:h-[150px] lg:h-[130px] flex gap-2 p-4 rounded-xl bg-white ${
                        i == 0 ? "md:rounded-t-xl" : "md:rounded-b-xl"
                      }`}
                    >
                      <div className="w-1/3 rounded-md border flex items-center justify-center overflow-clip">
                        <CustomImage
                          src={item.image}
                          alt={item.name}
                          className="w-full sm:w-1/2 md:w-[70%] lg:w-[40%] aspect-square"
                        />
                      </div>
                      <div className="w-2/3 flex flex-col justify-between gap-2">
                        <h1>{truncateText(item.name, 70)}</h1>
                        <p className="textSmall">{timeAgo(item.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselNext className="hidden md:flex absolute top-[43%] -right-0 rounded-md shadow-md z-30" />
          <CarouselCounter
            className="md:hidden pb-1"
            classNameCounter="bg-white"
          />
        </Carousel>
      </div>
      {/* Отзывы клиентов carusel */}
      <Carousel
        className="col-span-1 md:px-4 py-8 rounded-lg md:bg-primary w-full h-full text-foreground flex flex-col"
        paginate={"false"}
      >
        <div className="md:flex justify-between items-center gap-3 mb-5">
          <h1 className="px-4 font-medium textNormal4 md:text-white text-foreground">
            Отзывы клиентов
          </h1>
          <div className="gap-2 hidden md:flex">
            <CarouselPrevious className="rounded-full p-0" />
            <CarouselNext className="rounded-full p-0" />
          </div>
        </div>
        <CarouselContent className="md:h-full">
          {reviews.map((item, index) => {
            return (
              <CarouselItem key={index} className="basis-full">
                <div className="cursor-pointer h-auto md:h-[300px] space-y-5 lg:h-[260px] md:bg-white bg-primary text-white md:text-foreground rounded-xl p-4 flex flex-col justify-between gap-4">
                  <article className="flex flex-col gap-8">
                    <p className="textSmall3">
                      {truncateText(item.message, 300)}
                    </p>
                  </article>
                  <aside className="w-full flex justify-start gap-2 items-center">
                    <div className="w-full flex justify-start items-center gap-2">
                      <div className="w-12 h-12 rounded-full border-2 flex justify-center items-center">
                        <h1 className="textNormal">{item.name.slice(0, 1)}</h1>
                      </div>
                      <div>
                        <h1 className="w-full font-medium">
                          {item.name}{" "}
                          {/* <span className="textSmall text-green-400">
                          Покупатель
                        </span> */}
                        </h1>
                        <p className="textSmall2 w-full flex justify-between">
                          Город Ташкент{"  "}
                          {/* <span className="md:text-[#4B3EC4] textSmall underline">
                          IP камера HIKVISION N77777 V1
                        </span> */}
                        </p>
                      </div>
                    </div>
                  </aside>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselCounter
          className="md:hidden pb-1"
          classNameCounter="bg-primary md:bg-white"
        />
      </Carousel>
    </Container>
  );
};

export default NewsRew;
