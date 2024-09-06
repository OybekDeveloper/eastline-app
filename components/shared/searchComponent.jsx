"use client";

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function SearchComponent({ productsData }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch all categories once when component loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/category");
        setCategories(res.data.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts =
    query === ""
      ? productsData
      : productsData.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox
      value={selected}
      onChange={(value) => setSelected(value)}
      onClose={() => setQuery("")}
    >
      <div className="relative z-[10000]">
        <ComboboxInput
          placeholder="Поиск по сайту"
          className="rounded-3xl border border-primary pl-3 w-[170px] sm:w-[200px] md:w-[250px] px-3 py-2 h-10 focus:ring-0 focus:border-primary outline-none"
          displayValue={(product) => product?.name || ""}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ComboboxButton className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary rounded-full text-foreground h-[85%] aspect-square flex items-center justify-center">
          <Search className="text-secondary w-3 md:w-5" />
        </ComboboxButton>
      </div>

      <ComboboxOptions
        anchor="bottom"
        transition
        style={{
          maxHeight: "400px",
        }}
        className={clsx(
          "w-[var(--input-width)] rounded-xl border bg-secondary p-1 mt-1 shadow-md",
          "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 z-[9999]"
        )}
      >
        {filteredProducts.length <= 0 ? (
          <div className="flex justify-center items-center py-10">
            Нет результатов.
          </div>
        ) : (
          <div className="max-h-[400px]">
            {filteredProducts.map((product) => {
              const categoryData = categories?.find(
                (category) => +category.id === +product.categoryId
              );

              const href = categoryData
                ? `/${categoryData.topCategoryId}/${categoryData.id}/${product.id}`
                : "#";

              return (
                <Link key={product.id} href={href}>
                  <ComboboxOption
                    value={product}
                    className="group flex cursor-pointer items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white"
                  >
                    <div className="text-sm/6">{product.name}</div>
                  </ComboboxOption>
                </Link>
              );
            })}
          </div>
        )}
      </ComboboxOptions>
    </Combobox>
  );
}
