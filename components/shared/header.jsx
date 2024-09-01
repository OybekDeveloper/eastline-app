"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import { Logo } from "@/public/img";
import { Phone } from "lucide-react";
import { navItems } from "@/lib/iterationDetails";
import Link from "next/link";
import SearchComponent from "./searchComponent";
import { HeaderDropdown } from "./header-dropdown";
import HeroTitle from "./hero-title";
import Container from "./container";

export default function Home({ topCategories, productsData }) {
  // const [categories, setCategories] = useState([]);
  // const [topCategories, setTopCategories] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const topCategories = await ApiService.getData("/api/topCategory");
  //       const categories = await ApiService.getData("/api/category");
  //       setTopCategories(topCategories);
  //       setCategories(categories);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <Suspense>
      <header className="textSmall">
        <Container className="flex-col w-full bg-primary items-start">
          <div className="flex items-center justify-between w-10/12 mx-auto text-secondary py-2 gap-1 md:gap-5">
            <p className="hidden lg:block">
              Более 20-ти лет опыта на рынке систем безопасности и мини АТС
            </p>
            <div className="flex flex-col sm:flex-row justify-end items-center gap-1 md:gap-5 lg:hidden">
              <p>info@elt.uz</p>
              <a href="tel:+998555108033" className="flex items-center">
                +998 55 510-80-33
              </a>
              <a href="tel:+998555108133" className="flex items-center">
                +998 55 510-81-33
              </a>
            </div>
            <p className="ml-auto text-right w-[40%]">
              Режим работы: ПН, ВТ, СР, ЧТ, СБ, ВС | с 10:00 - 20:00 Выходной:
              ПТ
            </p>
          </div>
          <div className="w-full bg-secondary py-4">
            <Container>
              <Link href={"/"}>
                <Image src={Logo} alt="Logo" className="w-[12vw] min-w-24" />
              </Link>
              <SearchComponent productsData={productsData || []} />
            </Container>
          </div>
        </Container>
      </header>
      <nav className="text-secondary textSmall bg-primary sticky top-0 z-[999]">
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
                      <HeaderDropdown topCategory={topCategories || []} />
                    </div>
                  ) : (
                    <Link href={`${item.path}`} className="py-2 px-3">
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
            <li className="h-10 flex items-center justify-center">
              <Link href={`/dashboard`} className="py-2">
                Test dashboard
              </Link>
            </li>
          </ul>
          <div className="hidden items-center gap-1 md:gap-5 lg:flex">
            <p>info@elt.uz</p>
            <a href="tel:+998555108033" className="flex items-center gap-2">
              <Phone size={16} />
              +998 55 510-80-33
            </a>
            <a href="tel:+998555108133" className="flex items-center gap-2">
              <Phone size={16} />
              +998 55 510-81-33
            </a>
          </div>
        </Container>
      </nav>
      <HeroTitle />
    </Suspense>
  );
}
