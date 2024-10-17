"use client";
import React, { useState } from "react";

const data = [
  {
    id: 1,
    title: "Характеристика",
  },
];

const ProductType = ({ productData }) => {
  const { description, feature } = productData[0];
  const [activeTab, setActiveTab] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false); // State to handle expansion

  const handleActiveTab = (id) => {
    setActiveTab(id);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
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
        {activeTab === 2 && (
          <aside className="space-y-4">
            <p>{description}</p>
          </aside>
        )}
        {activeTab === 1 && (
          <div className="relative">
            {/* Characteristic content with partial view */}
            <div
              className={`ProseMirror whitespace-pre-line overflow-hidden transition-all duration-500 ${
                isExpanded ? "max-h-full" : "max-h-[200px]"
              }`}
              dangerouslySetInnerHTML={{ __html: feature }}
              style={{ whiteSpace: "pre-line" }}
            />

            {/* White shadow effect (fade-out) */}
            {!isExpanded && (
              <div className="absolute bottom-5 left-0 right-0 h-20 bg-gradient-to-t from-white"></div>
            )}

            {/* View All / Show Less button */}
            <button
              onClick={toggleExpand}
              className="mt-2 text-blue-500 underline"
            >
              {isExpanded ? "Показать меньше" : "Просмотреть все"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductType;
