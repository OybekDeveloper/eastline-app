import { describe, expect, it } from "vitest";

import {
  buildCategoryPath,
  buildProductPath,
  isObjectIdLike,
  slugifyText,
} from "@/lib/slugs";

describe("slug helpers", () => {
  it("transliterates cyrillic names into readable slugs", () => {
    expect(slugifyText("Промышленное оборудование")).toBe(
      "promyshlennoe-oborudovanie"
    );
    expect(slugifyText("Насос Wilo")).toBe("nasos-wilo");
  });

  it("builds category and product paths from slug-first segments", () => {
    const topCategory = { id: "1", slug: "promyshlennoe-oborudovanie" };
    const category = { id: "2", slug: "nasosy" };
    const product = { id: "3", slug: "nasos-wilo" };

    expect(buildCategoryPath(topCategory, category)).toBe(
      "/promyshlennoe-oborudovanie/nasosy"
    );
    expect(buildProductPath(topCategory, category, product)).toBe(
      "/promyshlennoe-oborudovanie/nasosy/nasos-wilo"
    );
  });

  it("recognizes legacy mongo object ids", () => {
    expect(isObjectIdLike("649fd1234567890abcdef123")).toBe(true);
    expect(isObjectIdLike("nasosy")).toBe(false);
  });
});
