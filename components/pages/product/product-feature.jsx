"use client";

import { cardsLogoData } from "@/lib/iterationDetails";
import Image from "next/image";
import React, { useState } from "react";

const ProductFeature = ({ feature }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="col-span-2 space-y-3">
      <div className="max-lg:hidden bg-secondary p-4 rounded-md space-y-3">
        <h1 className="font-bold textSmall2">Характеристика</h1>
        <div
          className={`textSmall2 ProseMirror whitespace-pre-line px-2 py-1 ${
            isExpanded ? "" : "max-h-[300px] overflow-hidden"
          }`}
          style={{ whiteSpace: "pre-line" }}
          dangerouslySetInnerHTML={{ __html: feature }}
        />
        {!isExpanded && (
          <button
            onClick={handleToggleExpand}
            className="mt-2 textSmall text-blue-500 hover:underline"
          >
            Полный просмотр
          </button>
        )}
        {isExpanded && (
          <button
            onClick={handleToggleExpand}
            className="mt-2 textSmall text-blue-500 hover:underline"
          >
            Скрыть
          </button>
        )}
        <hr className="border" />
        <p className="font-medium textSmall">Возможность оплаты с помощью</p>
        <div>
          {cardsLogoData.map((item, idx) => (
            <Image
              key={idx}
              width={100}
              height={100}
              className="w-14 inline-flex"
              src={item}
              alt="img"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col max-lg:justify-start max-lg:items-start gap-2 bg-secondary rounded-md p-4">
        <p className="textSmall cursor-pointer bg-black text-center inline-block text-secondary py-1 px-2 rounded-md">
          Больше инфо. при вызове
        </p>
        <a className="font-bold textSmall3" href="tel:(90) 933-78-80">
          (90) 933-78-80
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
