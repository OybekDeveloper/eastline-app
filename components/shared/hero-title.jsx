"use client";
import { Logo } from "@/public/img";
import { usePathname } from "next/navigation";
import Image from "next/image";
import React, { Suspense } from "react";
import { heroTitle } from "@/lib/iterationDetails";

const HeroTitle = () => {
  const path = usePathname();
  const findPath = heroTitle.find((item) => item.path == path);

  return (
    <Suspense>
      <section
        className={`w-10/12 mx-auto ${
          path == "/about-us" || path == "/contacts" || path == "/services"
            ? "flex"
            : "hidden"
        } flex-col lg:flex-row items-start lg:items-center mt-10 lg:mt-20`}
      >
        <Image src={Logo} className="w-[40vw] min-w-40" alt="Big logo" />
        <p className="textBig ml-auto text-right text-primary font-semibold">
          {findPath?.name} <br />
          «EAST LINE TELEKOM»
        </p>
      </section>
    </Suspense>
  );
};

export default HeroTitle;
