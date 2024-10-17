"use client";

import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CustomImage from "@/components/shared/customImage";
import ZoomImage from "@/components/shared/zoom-image";

const ProductCarousel = ({ item }) => {
  const [mainImage, setMainImage] = useState(item.image[0]);
  const [selectImage, setSelectImage] = useState(null);
  const [zoom, setZoom] = useState(false);
  const handleClick = (img) => {
    if (mainImage !== img) {
      setMainImage(img);
    }
  };

  const handleOpenLupa = (img) => {
    setZoom(!zoom);
    setSelectImage(img);
  };

  return (
    <main>
      <section className="hidden lg:block">
        {/* Main Image */}
        <div
          onClick={() => handleOpenLupa(mainImage)}
          className="w-full relative h-[250px]"
        >
          <CustomImage
            src={mainImage}
            alt={item.name}
            className="w-[60%] mx-auto aspect-square object-contain mb-5"
          />
        </div>
        {/* Thumbnail Images */}
        <div className="w-full flex gap-4 mt-2">
          {item.image.map((image, index) => (
            <div
              key={index}
              className={`bg-white border-2 rounded-md relative h-[60px] w-[60px] m-2 overflow-hidden cursor-pointer ${
                mainImage == image ? "border-primary" : "border-gray-300"
              }`}
              onClick={() => handleClick(image)}
            >
              <CustomImage
                src={image}
                alt={item.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          ))}
        </div>
      </section>
      <section className="lg:hidden">
        <Carousel
          className="w-full mx-auto bg-secondary p-8 rounded-md h-full text-foreground flex flex-col justify-end"
          paginate={"false"}
        >
          <CarouselPrevious className="absolute left-2 top-1/2 rounded-full p-0 z-50" />
          <CarouselContent className="min-h-[300px] lg:h-full">
            {item.image.map((c, idx) => (
              <CarouselItem
                key={idx}
                className="bg-white rounded-md basis-full flex justify-center items-center p-2"
              >
                <div
                  onClick={() => handleOpenLupa(c)}
                  className="relative max-h-[400px] overflow-hidden"
                >
                  <CustomImage
                    src={c}
                    alt={item.name}
                    className="w-full rounded-md"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className="absolute right-2 top-1/2 rounded-full p-0 z-50" />
        </Carousel>
      </section>
      <ZoomImage
        selectImage={selectImage}
        zoom={zoom}
        handleClose={handleOpenLupa}
      />
    </main>
  );
};

export default ProductCarousel;
