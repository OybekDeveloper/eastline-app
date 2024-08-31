"use client";

import React from "react";
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
import { truncateText } from "@/lib/utils";
import CustomImage from "./customImage";

const Banner = ({ productData, categories }) => {
  const findTopCategoryId = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.id : null;
  };

  return (
    <Container
      className={
        "pt-5 w-[95%] flex-col mx-auto justify-end items-start md:justify-center lg:mx-0 ml-auto"
      }
    >
      <section className="flex items-center w-full justify-center h-full">
        {/* Mobile View */}
        <div className="bg-primary pt-8 pb-3 px-3 rounded-xl w-full lg:hidden">
          <Carousel
            plugins={[
              emblaCarouselAutoplay({
                delay: 3000,
              }),
            ]}
            className="w-full text-secondary"
          >
            <CarouselContent className="mb-2">
              {productData.map((item, i) => {
                if (!item.product) return null; // Skip if the product is not loaded
                return (
                  <CarouselItem key={i} className="md:basis-1/2">
                    <div className="px-3 flex flex-col gap-y-3 h-full justify-between">
                      <div className="flex justify-between items-start">
                        <h1 className="font-medium textNormal4 leading-7">
                          {item.product.name}
                        </h1>
                        <Link
                          className="mt-1"
                          href={`/${item.topCategoryId}/${item.categoryId}/${item.productId}`}
                        >
                          <Button className="bg-secondary text-foreground px-3 h-8 rounded-md font-medium text-xs">
                            Подробно
                          </Button>
                        </Link>
                      </div>
                      <p className="textSmall2 w-[50%] whitespace-normal break-words overflow-wrap">
                        {truncateText(item?.product?.description, 50)}
                      </p>
                      <div className="relative">
                        <CustomImage
                          src={item.image}
                          width={100}
                          height={100}
                          alt={`banner-img-${item.id}`}
                          className="w-[70%] mx-auto aspect-square object-contain mb-5"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselCounter classNameCounter={"bg-white"} />
          </Carousel>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block w-full text-secondary space-y-5">
          {/* <section className="flex gap-5">
            {productData[0]?.product && (
              <div className="p-5 w-4/6 flex justify-between gap-y-1 bg-primary rounded-xl">
                <div className="relative w-full">
                  <CustomImage
                    src={productData[0].image}
                    width={100}
                    height={100}
                    alt={`banner-img-${productData[0].product.id}`}
                    className={`w-[60%] mx-auto aspect-square object-contain mb-5`}
                  />
                </div>
                <div className="flex flex-col gap-5 justify-between items-end py-5 px-3">
                  <div className="space-y-5">
                    <h1 className="font-medium textNormal4 text-right leading-7">
                      {productData[0].product.name}
                    </h1>
                    <p className="textSmall3 text-right w-[70%] whitespace-normal break-words overflow-wrap ml-auto">
                      {truncateText(productData[0].product.description, 50)}
                    </p>
                  </div>
                  <Link
                    className="mt-1"
                    href={`/${findTopCategoryId(
                      productData[0].product.categoryId
                    )}/${productData[0].product.categoryId}/${
                      productData[0].product.id
                    }`}
                  >
                    <Button className="bg-secondary text-foreground rounded-md font-medium">
                      Подробно
                    </Button>
                  </Link>
                </div>
              </div>
            )}
            {productData[2]?.product && (
              <div className="p-5 w-2/6 bg-primary rounded-xl flex flex-col gap-y-1">
                <div className="flex justify-between items-start">
                  <h1 className="font-medium textNormal4 leading-7">
                    {productData[2].product.name}
                  </h1>
                  <Link
                    className="mt-1"
                    href={`/${findTopCategoryId(
                      productData[2].product.categoryId
                    )}/${productData[2].product.categoryId}/${
                      productData[2].product.id
                    }`}
                  >
                    <Button className="bg-secondary text-foreground px-3 h-8 rounded-md font-medium text-xs">
                      Подробно
                    </Button>
                  </Link>
                </div>
                <p className="textSmall2 w-[70%] whitespace-normal break-words overflow-wrap">
                  {truncateText(productData[2].product.description, 50)}
                </p>
                <div className="relative">
                  <CustomImage
                    src={productData[2].image}
                    width={100}
                    height={100}
                    alt={`banner-img-${productData[2].product.id}`}
                    className={`w-[70%] mx-auto aspect-square object-contain mb-5`}
                  />
                </div>
              </div>
            )}
          </section>
          <section className="flex gap-5">
            {productData[1]?.product && (
              <div className="p-5 flex w-4/6 justify-between gap-y-1 bg-primary rounded-xl">
                <div className="relative w-full">
                  <CustomImage
                    src={productData[1].image}
                    width={100}
                    height={100}
                    alt={`banner-img-${productData[1].product.id}`}
                    className={`w-[60%] mx-auto aspect-square object-contain mb-5`}
                  />
                </div>
                <div className="flex flex-col gap-5 justify-between items-end py-5 px-3">
                  <div className="space-y-5">
                    <h1 className="font-medium textNormal4 text-right leading-7">
                      {productData[1].product.name}
                    </h1>
                    <p className="textSmall3 text-right w-[70%] whitespace-normal break-words overflow-wrap ml-auto">
                      {truncateText(productData[1].product.description, 50)}
                    </p>
                  </div>
                  <Link
                    className="mt-1"
                    href={`/${findTopCategoryId(
                      productData[1].product.categoryId
                    )}/${productData[1].product.categoryId}/${
                      productData[1].product.id
                    }`}
                  >
                    <Button className="bg-secondary text-foreground rounded-md font-medium">
                      Подробно
                    </Button>
                  </Link>
                </div>
              </div>
            )}
            {productData[3]?.product && (
              <div className="p-5 w-2/6 bg-primary rounded-xl flex flex-col gap-y-1">
                <div className="flex justify-between items-start">
                  <h1 className="font-medium textNormal4 text-left leading-7">
                    {productData[3].product.name}
                  </h1>
                  <Link
                    className="mt-1"
                    href={`/${findTopCategoryId(
                      productData[3].product.categoryId
                    )}/${productData[3].product.categoryId}/${
                      productData[3].product.id
                    }`}
                  >
                    <Button className="bg-secondary text-foreground px-3 h-8 rounded-md font-medium text-xs">
                      Подробно
                    </Button>
                  </Link>
                </div>
                <p className="textSmall2 w-[70%] whitespace-normal break-words overflow-wrap">
                  {truncateText(productData[3].product.description, 50)}
                </p>
                <div className="relative">
                  <CustomImage
                    src={productData[3].image}
                    width={100}
                    height={100}
                    alt={`banner-img-${productData[3].product.id}`}
                    className={`w-[70%] mx-auto aspect-square object-contain mb-5`}
                  />
                </div>
              </div>
            )}
          </section> */}
          <Carousel
            plugins={[
              emblaCarouselAutoplay({
                delay: 3000,
              }),
            ]}
            className="w-full h-full text-secondary"
          >
            <CarouselContent className="mb-4">
              {productData.map((item, i) => {
                if (!item.product) return null; // Skip if the product is not loaded
                return (
                  <CarouselItem key={i} className="md:basis-1/2 cursor-pointer">
                    <div className="p-5 h-full flex justify-between gap-y-1 bg-primary rounded-xl">
                      <div className="relative w-full">
                        <CustomImage
                          src={item.image}
                          width={100}
                          height={100}
                          alt={`banner-img-${item.product.id}`}
                          className={`w-[70%] mx-auto aspect-square object-contain mb-5`}
                        />
                      </div>
                      <div className="flex flex-col gap-5 justify-between items-end py-5 px-3">
                        <div className="space-y-5">
                          <h1 className="font-medium textNormal4 text-right leading-7">
                            {truncateText(item.product.name, 20)}
                          </h1>
                          <p className="textSmall3 text-right w-[70%] whitespace-normal break-words overflow-wrap ml-auto">
                            {truncateText(item.product.description, 30)}
                          </p>
                        </div>
                        <Link
                          className="mt-1"
                          href={`/${findTopCategoryId(
                            item.product.categoryId
                          )}/${item.product.categoryId}/${item.product.id}`}
                        >
                          <Button className="bg-secondary text-foreground rounded-md font-medium">
                            Подробно
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselCounter classNameCounter="bg-primary" className={""} />
          </Carousel>
        </div>
      </section>
    </Container>
  );
};

export default Banner;
