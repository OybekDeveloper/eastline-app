"use client";

import { AboutBanner, productImage } from "@/public/img";
import Image from "next/image";
import React, { useState } from "react";

const data = [
  {
    id: 1,
    title: "Описания",
  },
  {
    id: 2,
    title: "Характеристика",
  },
];

const ProductType = ({ productData }) => {
  const { description, feature } = productData[0];
  const [activeTab, setActiveTab] = useState(1);

  const handleActiveTab = (id) => {
    setActiveTab(id);
  };

  return (
    <main className="flex flex-col gap-5 pt-5">
      <div className="flex gap-3">
        {data.map((item, idx) => (
          <div key={idx} onClick={() => handleActiveTab(item.id)}>
            <button
              className={`${
                activeTab === item.id && "font-bold text-black"
              } textNormal`}
            >
              {item.title}
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        {activeTab === 1 && (
          <aside className="space-y-4">
            <p>{description}</p>
            {/* <CustomImage
              url={`${productData[0].image[0]}`}
              title={`img`}
              className={"w-full h-[400px] caption-top"}
            /> */}
            {/* <Image
              src={AboutBanner}
              alt="ddd"
              width={100}
              height={100}
              className="w-full h-[300px] rounded-md border"
            />
            <div className="space-y-3">
              <h1 className="font-bold textNormal">
                Основное назначение Hikvision DS-2CD2421G0-I
              </h1>
              <p>
                Камера Hikvision DS-2CD2421G0-I разработана для внутреннего
                мониторинга за домом, квартирой или офисом. С ее помощью можно
                контролировать и наблюдать за домашними питомцами, общаться с
                детьми, которые остаются одни дома и даже контролировать работу
                в офисе. Оптимальная температура для ее работы -10° C - +40° C.
                <br />
                <br />
                Для улучшения видео, видеокамера использует такие функции как
                цифровой широкий динамический диапазон, компенсация внешней
                засветки (фоновой и точечной), трехмерное шумоподавление.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Image
                  src={productImage}
                  alt="ddd"
                  width={100}
                  height={100}
                  className="w-full h-[300px] rounded-md border"
                />{" "}
                <Image
                  src={productImage}
                  alt="ddd"
                  width={100}
                  height={100}
                  className="w-full h-[300px] rounded-md border"
                />
              </div>
            </div> */}
          </aside>
        )}
        {activeTab === 2 && (
          <div
            className={`ProseMirror whitespace-pre-line`}
            style={{ whiteSpace: "pre-line" }}
            dangerouslySetInnerHTML={{ __html: feature }}
          />
        )}
        {/* {activeTab === 1 && <p>{productData[0].description}</p>}
        {activeTab === 2 && <p>{productData[0].brand}</p>} */}
      </div>
    </main>
  );
};

export default ProductType;
