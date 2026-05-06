"use client";

import React, { useEffect } from "react";
import Container from "./container";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselItem,
} from "../ui/carousel";
import emblaCarouselAutoplay from "embla-carousel-autoplay";
import Link from "next/link";
import CustomImage from "./customImage";
import { buildCategoryPath, buildProductPath } from "@/lib/slugs";

const Banner = ({ banner, bannerSort, categories, topCategories, products }) => {
  const filterBanner = bannerSort
    .filter((category) => category.uniqueId) // Faqat uniqueId mavjud bo'lganlarni qoldirish
    .sort((a, b) => a.uniqueId - b.uniqueId);
  const getHref = (item) => {
    const topCategory = topCategories?.find((row) => row.id === item.topCategoryId);
    const category = categories?.find((row) => row.id === item.categoryId);
    const product = products?.find((row) => row.id === item.productId);

    if (product && category) {
      return buildProductPath(topCategory || category.topCategory, category, product);
    }

    if (category) {
      return buildCategoryPath(topCategory || category.topCategory, category);
    }

    if (topCategory) {
      return `/${topCategory.slug || topCategory.id}`;
    }

    return "/";
  };
  const getBannerAlt = (item) => {
    if (item.productId) return `Промо баннер товара ${item.productId}`;
    if (item.categoryId) return `Промо баннер категории ${item.categoryId}`;
    return "Промо баннер EAST LINE TELEKOM";
  };

  return (
    <Container
      className={
        "pt-5 w-[95%] flex-col mx-auto justify-end items-start md:justify-center lg:mx-0 ml-auto"
      }
    >
      <section className="flex items-center w-full justify-center h-full">
        {/* Mobile View */}
        <div className="bg-transparent rounded-xl w-full lg:hidden">
          <Carousel
            paginate={"false"}
            plugins={[
              emblaCarouselAutoplay({
                delay: 3000,
              }),
            ]}
            opts={{
              loop: true, // Loopni qo'shish
              align: "start",
            }}
            className="w-full text-secondary "
          >
            <CarouselContent className="my-0 py-0">
              {filterBanner.map((item, i) => {
                return (
                  <CarouselItem key={i} className="md:basis-1/2">
                    <Link
                      className="mt-1"
                      href={getHref(item)}
                    >
                      <div className="relative max-sm:h-[250px] overflow-hidden">
                        <CustomImage
                          object={"object-contain rounded-md"}
                          src={item.image}
                          alt={getBannerAlt(item)}
                          loading="eager"
                          className="w-full mx-auto max-sm:aspect-video aspect-square mb-5"
                        />
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block w-full text-secondary space-y-5">
          <Carousel
            paginate={"false"}
            plugins={[
              emblaCarouselAutoplay({
                delay: 3000,
              }),
            ]}
            opts={{
              loop: true, // Loopni qo'shish
              align: "start",
            }}
            className="w-full h-full text-secondary"
          >
            <CarouselContent className="mb-4 space-x-4">
              {filterBanner.map((item, i) => {
                return (
                  <CarouselItem
                    key={i}
                    className="w-full md:basis-1/2 cursor-pointer rounded-md"
                  >
                    <Link
                      className="mt-1 w-full rounded-xl overflow-hidden relative"
                      href={getHref(item)}
                    >
                      <div className="relative">
                        <CustomImage
                          object={"dd rounded-md"}
                          src={item.image}
                          alt={getBannerAlt(item)}
                          className={`w-[100%] h-full aspect-video mx-auto mb-5`}
                          fill
                        />
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    </Container>
  );
};

export default Banner;
