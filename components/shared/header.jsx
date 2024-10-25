"use client";
import React, { Suspense, useEffect } from "react";
import Image from "next/image";
import { Logo } from "@/public/img";
import { Phone } from "lucide-react";
import { navItems } from "@/lib/iterationDetails";
import Link from "next/link";
import SearchComponent from "./searchComponent";
import { HeaderDropdown } from "./header-dropdown";
import HeroTitle from "./hero-title";
import Container from "./container";
import { usePathname, useRouter } from "next/navigation";

export default function Home({
  background,
  topCategories,
  productsData,
  contactData,
  topCategoriesSort,
  categorySortData,
}) {
  const { experience_info, work_hours, email, phone1, phone2 } = contactData;
  const pathname = usePathname();
  const urlBack = background[0].image;
  return (
    <Suspense>
      <header className={`textSmall ${pathname === "/login" ? "hidden" : ""}`}>
        <Container className="flex-col w-full bg-primary items-start">
          <div className="flex items-center justify-between w-10/12 mx-auto text-secondary py-2 gap-1 md:gap-5">
            <p className="hidden lg:block">{experience_info}</p>
            <div className="flex flex-col sm:flex-row justify-end items-center gap-1 md:gap-5 lg:hidden">
              <p>{email}</p>
              {phone1 && (
                <a href="tel:+998555108033" className="flex items-center">
                  {phone1}
                </a>
              )}
              {phone2 && (
                <a href="tel:+998555108133" className="flex items-center">
                  {phone2}
                </a>
              )}
            </div>
            <p className="ml-auto text-right w-[40%]">{work_hours}</p>
          </div>
          <div
            className="w-full py-4 bg-secondary"
            style={{
              backgroundImage: `url(${urlBack})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow:
                "inset -70px 0 20px -5px rgba(255, 255, 255, 0.5), inset 130px 0 20px -5px rgba(255, 255, 255, 0.5)",
            }}
          >
            <Container>
              <Link href={"/"}>
                <Image src={Logo} alt="Logo" className="w-[12vw] min-w-24" />
              </Link>
              <SearchComponent productsData={productsData || []} />
            </Container>
          </div>
        </Container>
      </header>
      <nav
        className={`${
          pathname === "/login" ? "hidden" : ""
        } text-secondary textSmall bg-primary sticky top-0 z-[999]`}
      >
        <Container>
          <ul className="flex items-center gap-2 md:gap-10">
            {navItems.map((item) => {
              if (item.id === 1) return null;
              return (
                <li
                  key={item.id}
                  className="h-10 flex items-center justify-center"
                >
                  {item.id === 2 ? (
                    <div className="cursor-pointer">
                      <HeaderDropdown
                        categorySortData={categorySortData}
                        topCategoriesSort={topCategoriesSort || []}
                        topCategory={topCategories || []}
                      />
                    </div>
                  ) : (
                    <Link href={`${item.path}`} className="py-2 px-3">
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="hidden items-center gap-1 md:gap-5 lg:flex">
            <p>{email}</p>
            {phone1 && (
              <a href="tel:+998555108033" className="flex items-center gap-2">
                <Phone size={16} />
                {phone1}
              </a>
            )}
            {phone2 && (
              <a href="tel:+998555108133" className="flex items-center gap-2">
                <Phone size={16} />
                {phone2}
              </a>
            )}
          </div>
        </Container>
      </nav>
      <HeroTitle />
    </Suspense>
  );
}
