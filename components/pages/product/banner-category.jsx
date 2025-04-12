"use client";

import CustomImage from "@/components/shared/customImage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { f, truncateText } from "@/lib/utils";
import emblaCarouselAutoplay from "embla-carousel-autoplay";
import Link from "next/link";

const BannerProducts = ({ randomProducts, categories }) => {
  const findTopCategoryId = (categoryId) => {
    const category = categories?.find((cat) => cat.id === categoryId);
    return category ? category.id : "top";
  };
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
      {randomProducts[0] && (
        <Link
          href={`/${findTopCategoryId(randomProducts[0]?.categoryId)?.id}/${
            randomProducts[0]?.categoryId
          }/${randomProducts[0]?.id}`}
          className="max-lg:hidden p-5 flex justify-between gap-y-1 border-2 rounded-xl"
        >
          <div className="relative w-full">
            <CustomImage
              src={randomProducts[0].image[0]}
              width={100}
              height={100}
              alt={`banner-img-${randomProducts[0].id}`}
              className={`w-[60%] mx-auto aspect-square object-contain mb-5`}
            />
          </div>
          <div className="flex flex-col gap-5 justify-between items-end py-5 px-3">
            <div className="space-y-5">
              <h1 className="font-medium textNormal4 text-right leading-7">
                {truncateText(randomProducts[0].name, 30)}
              </h1>
              <p className="textSmall3 text-right w-[70%] whitespace-normal break-words overflow-wrap ml-auto">
                {truncateText(randomProducts[0].description, 50)}
              </p>
            </div>
            {/* <Link
              className="mt-1"
              href={`/${findTopCategoryId(randomProducts[0].categoryId).id}/${
                randomProducts[0].categoryId
              }/${randomProducts[0].id}`}
            >
              <Button className="bg-secondary text-foreground rounded-md font-medium">
                Подробно
              </Button>
            </Link> */}
          </div>
        </Link>
      )}
      <div className="rounded-xl w-full h-full">
        <Carousel
          plugins={[
            emblaCarouselAutoplay({
              delay: 3000,
            }),
          ]}
          opts={{
            align: "start",
          }}
          paginate={"false"}
          className="w-full h-full text-secondary"
        >
          <CarouselContent className="max-md:pb-4 h-full">
            {randomProducts?.map((item, i) => {
              if (!item) return null; // Skip if item is empty
              return (
                <CarouselItem
                  key={i}
                  className="text-center text-black basis-full md:basis-[45%] min-h-[300px] border-2 py-3 rounded-xl mr-2"
                >
                  <Link
                    href={`/${
                      findTopCategoryId(item.categoryId)?.id
                        ? findTopCategoryId(item.categoryId)?.id
                        : "top"
                    }/${item?.categoryId}/${item?.id}`}
                    className="h-full px-3 flex flex-col gap-y-1 rounded-md justify-between"
                  >
                    <h1 className="textSmall3 font-bold">
                      {truncateText(item.name, 30)}
                    </h1>
                    <div className="relative bg-white rounded-md">
                      <CustomImage
                        src={item.image[0]}
                        width={100}
                        height={100}
                        alt={`banner-img-${item.id}`}
                        className={`w-[70%] mx-auto aspect-square object-contain mb-5`}
                      />
                    </div>
                    {/* <p className="textSmall4 font-bold">
                      {" "}
                      {f(getCurrencySum(item.price))} сум
                    </p> */}
                    <p className="textSmall">
                      {truncateText(item.description, 20)}
                    </p>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          {/* <CarouselPrevious /> */}
          {/* <CarouselNext /> */}
        </Carousel>
      </div>
    </div>
  );
};

export default BannerProducts;
