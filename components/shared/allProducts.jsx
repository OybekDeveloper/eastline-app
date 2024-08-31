/* eslint-disable react/display-name */
"use client";
import React, { memo, useCallback, useState } from "react";
import Container from "./container";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Button } from "../ui/button";
import { f, getLastItems, truncateText } from "@/lib/utils";
import CustomImage from "./customImage";

const AllProducts = ({ products, categories, currency }) => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [renderedProducts, setRenderedProducts] = useState(products);

  const getCurrencySum = (dollar) => {
    if (currency.length) {
      const sum = currency[0].sum;
      return Number(sum) * Number(dollar);
    }
  };

  const changeProducts = useCallback(
    (idx, item) => {
      setCurrentCategory(idx);
      setRenderedProducts(
        item === "new" ? products : getLastItems(item.products, 4)
      );
    },
    [products]
  );

  return (
    <Container className="pt-5 w-[95%] overflow-clip flex-col lg:w-10/12 lg:mx-auto justify-end items-start md:justify-center mx-0 ml-auto">
      <p className="textNormal5 font-semibold mb-7">
        <span className="text-primary">Новинки</span> и товары
      </p>
      <Carousel className="w-full text-foreground" paginate={"false"}>
        <CarouselContent>
          <CarouselItem className="basis-[40%] md:basis-[10%] lg:basis-[12%] mr-5">
            <Button
              variant={`${currentCategory === 0 ? "" : "secondary"}`}
              onClick={() => changeProducts(0, "new")}
              className="textSmall3 font-semibold"
            >
              Новинки
            </Button>
          </CarouselItem>
          {categories.map((item, i) => {
            return (
              <CarouselItem
                key={i}
                className="basis-[60%] md:basis-[40%] lg:basis-[30%] mr-5"
              >
                <Button
                  variant={`${currentCategory === i + 1 ? "" : "secondary"}`}
                  onClick={() => changeProducts(i + 1, item)}
                  className="textSmall3 font-semibold w-full lg:block"
                >
                  {truncateText(item.name, 20)}
                </Button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      <section className="py-5 w-full flex justify-between gap-5 items-start">
        <div className="lg:grid w-1/2 grid-cols-1 gap-5 hidden">
          {renderedProducts.length > 0 &&
            renderedProducts
              .slice(0, 2)
              .map((item, i) => (
                <Cards
                  variant={"first"}
                  props={item}
                  key={i}
                  currency={currency}
                  getCurrencySum={getCurrencySum}
                />
              ))}
        </div>
        <div className="w-full lg:w-1/2">
          <Carousel
            className="lg:hidden w-full text-foreground overflow-x-clip"
            paginate={"false"}
          >
            <CarouselContent>
              {renderedProducts.length > 0 &&
                renderedProducts.map((item, i) => {
                  return (
                    <CarouselItem
                      key={i}
                      className="basis-[90%] sm:basis-[50%] md:basis-[40%]"
                    >
                      <Cards
                        variant={"second"}
                        props={item}
                        currency={currency}
                        getCurrencySum={getCurrencySum}
                      />
                    </CarouselItem>
                  );
                })}
            </CarouselContent>
          </Carousel>
          <div className="hidden w-full lg:grid grid-cols-2 gap-5">
            {renderedProducts.length > 0 &&
              renderedProducts.map((item, i) => (
                <Cards
                  variant={"second"}
                  props={item}
                  key={i}
                  currency={currency}
                  getCurrencySum={getCurrencySum}
                />
              ))}
          </div>
        </div>
      </section>
    </Container>
  );
};

const Cards = memo(({ props, variant, currency, getCurrencySum }) => {
  const { name, image, price } = props;

  return (
    <>
      {variant === "second" ? (
        <article className="border rounded-xl flex flex-col items-center justify-center py-5 gap-4 md:h-[400px] 2xl:h-[500px] 4xl:h-[600px]">
          <p>{truncateText(name, 15)}</p>
          <span className="text-xs bg-black text-white rounded-md px-2 py-1 z-[7]">
            NEW
          </span>
          <div className="w-full cursor-pointer h-[300px] relative flex justify-center items-center">
            <CustomImage
              src={`${image[0]}`}
              className="w-[70%] md:w-[50%] lg:w-[60%] aspect-square"
              alt={`${image[0]}`}
            />
          </div>
          <p>{f(getCurrencySum(price))} сум</p>
        </article>
      ) : (
        <article className="border w-full rounded-xl flex items-center justify-center p-5 gap-5 textNormal md:h-[400px] 2xl:h-[500px] 4xl:h-[600px]">
          <div className="relative w-full flex justify-center items-center">
            <CustomImage
              src={`${image[0]}`}
              className="md:w-[50%] aspect-square"
              alt={`${image[0]}`}
            />
          </div>
          <div className="flex flex-col gap-5 items-start justify-between h-[80%]">
            <p>{name}</p>
            <span className="text-xs bg-black text-white rounded-md px-2 py-1 ">
              NEW
            </span>
            <p>{f(getCurrencySum(price))} сум</p>
          </div>
        </article>
      )}
    </>
  );
});

export default AllProducts;
