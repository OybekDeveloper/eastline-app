"use client";

import { cardsLogoData } from "@/lib/iterationDetails";
import Image from "next/image";
import React, { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegram,
  FaYoutube,
} from "react-icons/fa6";

const ProductFeature = ({ feature }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
        <ul className="text-xl flex gap-3 max-lg:hidden">
          <li className="bg-border lg:border p-2 rounded-full items-block">
            <a
              className="w-full h-full"
              target="_blank"
              href="https://t.me/ELTprice_bot"
            >
              <FaTelegram />
            </a>
          </li>
          <li className="bg-border lg:border p-2 rounded-full items-block">
            <a
              className="w-full h-full"
              target="_blank"
              href="https://www.facebook.com/eastlinetelecom"
            >
              <FaFacebookF />
            </a>
          </li>
          <li className="bg-border lg:border p-2 rounded-full items-block">
            <a
              className="w-full h-full"
              target="_blank"
              href="https://www.instagram.com/_elt_uz?igsh=dXNnZWt3a3N3ejV6&utm_source=qr"
            >
              <FaInstagram />
            </a>
          </li>
          <li className="bg-border lg:border p-2 rounded-full items-block">
            <a
              className="w-full h-full"
              target="_blank"
              href="https://www.youtube.com/@AnpArtSer"
            >
              <FaYoutube />
            </a>
          </li>
        </ul>
        <p className="textSmall cursor-pointer bg-black text-center inline-block text-secondary py-1 px-2 rounded-md">
          Больше инфо. при вызове
        </p>
        <a className="font-bold textSmall3" href="tel:(55) 510-80-33">
          (55) 510-80-33
        </a>
        <a className="font-bold textSmall3" href="tel:(55) 510-81-33">
          (55) 510-81-33
        </a>
      </div>
      <p className="underline font-medium textSmall">Доставляется с Ташкента</p>
    </div>
  );
};

export default ProductFeature;
