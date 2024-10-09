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

const Banner = ({ banner }) => {
  return (
    <Container
      className={
        "max-w-[1440px] pt-5 w-[95%] flex-col mx-auto justify-end items-start md:justify-center lg:mx-0 ml-auto"
      }
    >
      <section className="flex items-center w-full justify-center h-full">
        {/* Mobile View */}
        <div className="bg-primary pt-8 pb-3 px-3 rounded-xl w-full lg:hidden">
          <Carousel
            plugins={[
              emblaCarouselAutoplay({
                delay: 7000,
              }),
            ]}
            className="w-full text-secondary "
          >
            <CarouselContent className="mb-2">
              {banner.map((item, i) => {
                return (
                  <CarouselItem key={i} className="md:basis-1/2">
                    <Link
                      className="mt-1"
                      href={`/${item.topCategoryId}/${item.categoryId}/${item.productId}`}
                    >
                      <div className="relative">
                        <CustomImage
                          src={item.image}
                          alt={`banner-img`}
                          className="w-full mx-auto aspect-square object-contain mb-5"
                        />
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselCounter classNameCounter={"bg-white"} />
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
            className="w-full h-full text-secondary"
          >
            <CarouselContent className="mb-4 space-x-4">
              {banner.map((item, i) => {
                return (
                  <CarouselItem
                    key={i}
                    className="w-full h-[340px] md:basis-1/2 cursor-pointer bg-primary rounded-md py-4"
                  >
                    <Link
                      className="mt-1 w-full rounded-xl overflow-hidden relative"
                      href={`/${item.topCategoryId}/${item.categoryId}/${item.productId}`}
                    >
                      <div className="relative">
                        <CustomImage
                          object={"dd"}
                          src={item.image}
                          alt={`banner-img`}
                          className={`w-[100%] h-[300px] mx-auto mb-5`}
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
