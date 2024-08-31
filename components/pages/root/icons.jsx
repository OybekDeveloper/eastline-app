import { Button } from "@/components/ui/button";
import { myServiceData } from "@/lib/iterationDetails";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Icons = () => {
  return (
    <section className="pt-5 w-[95%] lg:bg-primary rounded-xl xl:w-10/12 lg:mx-auto justify-end items-center md:justify-between mx-auto lg:flex grid grid-cols-2 gap-3 p-4 max-lg:gap-4">
      {myServiceData.map((item, idx) => {
        return (
          <div
            key={idx}
            className={cn(
              "h-full flex gap-4 lg:gap-2 max-lg:bg-secondary max-lg:p-6 rounded-lg md:items-center",
              idx === 0 || idx === 1
                ? "col-span-1 max-lg:flex-col items-start"
                : "col-span-2 items-center"
            )}
          >
            <Image
              className="max-lg:hidden w-8 h-8"
              src={item.img}
              alt={item.title}
              width={100}
              height={100}
            />
            <Image
              className="lg:hidden w-16 h-w-16"
              src={item.imgp}
              alt={item.title}
              width={100}
              height={100}
            />
            <h1 className="max-sm:textSmall3 textNormal3 max-lg:font-bold lg:textSmall3 lg:text-white text-foreground col-span-2">
              {item.title}
            </h1>
          </div>
        );
      })}
      <Link
        href={"/about-us"}
        className="flex justify-center lg:justify-end items-center max-lg:col-span-2"
      >
        <Button
          variant="primary"
          className="textNormal lg:hidden bg-primary text-white w-1/4"
        >
          О нас
        </Button>
        <Button variant="outline" className="textNormal max-lg:hidden">
          О нас
        </Button>
      </Link>
    </section>
  );
};

export default Icons;
