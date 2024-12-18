"use client";

import React from "react";
import Container from "./container";
import { navItems } from "@/lib/iterationDetails";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Bot, Send } from "lucide-react";
import {
  FaTelegram,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";
import { usePathname } from "next/navigation";

const Footer = ({ contactData }) => {
  const pathname = usePathname();
  const {
    company_name,
    address,
    telegram,
    telegram_bot,
    instagram,
    facebook,
    youtube,
  } = contactData;

  return (
    <footer className={`${pathname === "/login" ? "hidden" : ""} relative`}>
      <div className="absolute w-full h-full bg-secondary -z-10"></div>
      <Container className="w-full lg:w-8/12 items-start max-lg:bg-primary text-secondary lg:text-foreground">
        <div className="flex justify-between w-full items-center lg:items-start lg:flex-row flex-col py-8 max-lg:gap-4">
          <section className="flex justify-between items-start gap-20">
            <ul className="space-y-2 lg:space-y-4 textSmall3 hidden lg:block">
              <li className="font-semibold textNormal4 lg:text-black">
                Компания
              </li>
              {navItems.map((item) => {
                if (item.id === 2) return null;
                return (
                  <li key={item.id}>
                    <Link href={`${item.path}`}>{item.name}</Link>
                  </li>
                );
              })}
            </ul>
            <ul className="space-y-2 lg:space-y-4 textSmall3">
              <li className="font-semibold textNormal4 lg:text-black">
                {company_name}
              </li>
              <li className="space-y-2 lg:space-y-4">
                <p>{`ООО «${company_name}»`}</p>
                <p>
                  Адрес:{" "}
                  {address.split(", ").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </li>
              <li></li>
            </ul>
          </section>
          <section className="flex flex-col gap-10">
            <div className="space-y-3">
              <p className="font-semibold textNormal4 lg:text-black">
                Не пропускайте новости
              </p>
              <div className="flex items-center gap-1 textSmall3">
                <Input
                  type="email"
                  className="rounded-none"
                  placeholder="Почта"
                />
                <Send
                  size={40}
                  className="text-primary lg:text-secondary p-2 bg-secondary lg:bg-primary"
                />
              </div>
            </div>
            <ul className="text-xl flex items-center justify-center lg:justify-end gap-2 border-t lg:border-none max-lg:pt-3">
              {telegram && (
                <li className="lg:border p-2 rounded-full items-block">
                  <a className="w-full h-full" target="_blank" href={telegram}>
                    <FaTelegram />
                  </a>
                </li>
              )}
              {telegram_bot && (
                <li className="lg:border p-2 rounded-full items-block">
                  <a className="w-full h-full" target="_blank" href={telegram_bot}>
                    <Bot />
                  </a>
                </li>
              )}
              {facebook && (
                <li className="lg:border p-2 rounded-full items-block">
                  <a className="w-full h-full" target="_blank" href={facebook}>
                    <FaFacebookF />
                  </a>
                </li>
              )}
              {instagram && (
                <li className="lg:border p-2 rounded-full items-block">
                  <a className="w-full h-full" target="_blank" href={instagram}>
                    <FaInstagram />
                  </a>
                </li>
              )}
              {youtube && (
                <li className="lg:border p-2 rounded-full items-block">
                  <a className="w-full h-full" target="_blank" href={youtube}>
                    <FaYoutube />
                  </a>
                </li>
              )}
              {/* <li className="lg:border p-2 rounded-full items-block">
                <CiMail />
              </li> */}
            </ul>
          </section>
        </div>
      </Container>
      <section className="bg-primary text-secondary h-20 flex items-center py-5">
        <Container className="flex-col gap-5">
          <div className="flex lg:hidden items-center gap-3 justify-center text-sm font-semibold">
            <Link href="/about-us">О нас</Link>
            <Link href="/contacts">Контакты</Link>
          </div>
          <p className="textSmall2 text-secondary text-center lg:text-left w-full">
            Все права защищены 2014—2024. OOO «EAST LINE TELEKOM»
          </p>
        </Container>
      </section>
    </footer>
  );
};

export default Footer;
