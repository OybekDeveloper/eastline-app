"use client";

import { cardsLogoData } from "@/lib/iterationDetails";
import { Bot } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegram,
  FaYoutube,
} from "react-icons/fa6";

const ProductFeature = ({ contactData, feature }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    telegram,
    telegram_bot,
    instagram,
    facebook,
    youtube,
    phone1,
    phone2,
  } = contactData;
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // <div className="max-lg:hidden bg-secondary p-4 rounded-md space-y-3">
  //   <h1 className="font-bold textSmall2">Характеристика</h1>
  //   <div
  //     className={`textSmall2 ProseMirror whitespace-pre-line px-2 py-1 ${
  //       isExpanded ? "" : "max-h-[300px] overflow-hidden"
  //     }`}
  //     style={{ whiteSpace: "pre-line" }}
  //     dangerouslySetInnerHTML={{ __html: feature }}
  //   />
  //   {!isExpanded && (
  //     <button
  //       onClick={handleToggleExpand}
  //       className="mt-2 textSmall text-blue-500 hover:underline"
  //     >
  //       Полный просмотр
  //     </button>
  //   )}
  //   {isExpanded && (
  //     <button
  //       onClick={handleToggleExpand}
  //       className="mt-2 textSmall text-blue-500 hover:underline"
  //     >
  //       Скрыть
  //     </button>
  //   )}
  //   <hr className="border" />
  //   <p className="font-medium textSmall">Возможность оплаты с помощью</p>
  //   {/* <div>
  //     {cardsLogoData.map((item, idx) => (
  //       <Image
  //         key={idx}
  //         width={100}
  //         height={100}
  //         className="w-14 inline-flex"
  //         src={item}
  //         alt="img"
  //       />
  //     ))}
  //   </div> */}
  // </div>
  return (
    <div className="col-span-2 space-y-3">
      <div className="flex flex-col max-lg:justify-start max-lg:items-start gap-4 bg-secondary rounded-md p-4">
        <ul className="text-xl max-lg:hidden w-full">
          {telegram && (
            <li className="lg:border inline-flex mr-2 p-2 rounded-full items-block">
              <a className="w-full h-full" target="_blank" href={telegram}>
                <FaTelegram />
              </a>
            </li>
          )}
          {telegram_bot && (
            <li className="lg:border inline-flex mr-2 p-2 rounded-full items-block">
              <a className="w-full h-full" target="_blank" href={telegram_bot}>
                <Bot />
              </a>
            </li>
          )}
          {facebook && (
            <li className="lg:border inline-flex mr-2 p-2 rounded-full items-block">
              <a className="w-full h-full" target="_blank" href={facebook}>
                <FaFacebookF />
              </a>
            </li>
          )}
          {instagram && (
            <li className="lg:border inline-flex mr-2 p-2 rounded-full items-block">
              <a className="w-full h-full" target="_blank" href={instagram}>
                <FaInstagram />
              </a>
            </li>
          )}
          {youtube && (
            <li className="lg:border inline-flex mr-2 p-2 rounded-full items-block">
              <a className="w-full h-full" target="_blank" href={youtube}>
                <FaYoutube />
              </a>
            </li>
          )}
        </ul>
        <p className="textSmall cursor-pointer bg-black text-center inline-block text-secondary py-1 px-2 rounded-md">
          Больше инфо. при вызове
        </p>
        {phone1 && (
          <a className="font-bold textSmall3" href="tel:(55) 510-80-33">
            {phone1}
          </a>
        )}
        {phone2 && (
          <a className="font-bold textSmall3" href="tel:(55) 510-81-33">
            {phone2}
          </a>
        )}
      </div>
      <p className="underline font-medium textSmall">Доставляется с Ташкента</p>
    </div>
  );
};

export default ProductFeature;
