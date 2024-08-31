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
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SearchComponent({ categories }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null); // No initial selection

  const handleClick = (item) => {
    setSelected(null);
    setQuery("");
  };

  const filteredCategories =
    query === ""
      ? categories
      : categories.filter((category) => {
          return category.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      value={selected}
      onChange={(value) => setSelected(value)}
      onClose={() => setQuery("")}
    >
      <div className="relative z-[10000]">
        <ComboboxInput
          placeholder="Поиск по сайту"
          className={
            "rounded-3xl border border-primary pl-3 w-[170px] sm:w-[200px] md:w-[250px] px-3 py-2 h-10 focus:ring-0 focus:border-primary outline-none"
          }
          displayValue={(category) => category?.name || ""}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ComboboxButton className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary rounded-full text-foreground h-[85%] aspect-square flex items-center justify-center">
          <Search className="text-secondary w-3 md:w-5" />
        </ComboboxButton>
      </div>

      <ComboboxOptions
        anchor="bottom"
        transition
        className={clsx(
          "w-[var(--input-width)] h-[400px] rounded-xl border bg-secondary p-1 ",
          "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 z-[9999]"
        )}
      >
        {filteredCategories.map((category) => (
          <Link
            key={category.id}
            href={`/${category.topCategoryId}/${category.id}`}
          >
            <ComboboxOption
              onClick={() => handleClick(category)}
              value={category}
              className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white"
            >
              <div className="text-sm/6">{category.name}</div>
            </ComboboxOption>
          </Link>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}
