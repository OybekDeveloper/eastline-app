const CYRILLIC_MAP = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
  ў: "u",
  қ: "q",
  ғ: "g",
  ҳ: "h",
};

export function slugifyText(value) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .split("")
    .map((char) => CYRILLIC_MAP[char] ?? char)
    .join("")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalized || "item";
}

export function getEntitySegment(entity) {
  if (!entity) return "";
  return entity.slug || entity.id || "";
}

export function buildCategoryPath(topCategory, category) {
  const topSegment = getEntitySegment(topCategory);
  const categorySegment = getEntitySegment(category);
  if (!topSegment || !categorySegment) {
    return "/";
  }
  return `/${topSegment}/${categorySegment}`;
}

export function buildProductPath(topCategory, category, product) {
  const categoryPath = buildCategoryPath(topCategory, category);
  const productSegment = getEntitySegment(product);
  if (categoryPath === "/" || !productSegment) {
    return categoryPath;
  }
  return `${categoryPath}/${productSegment}`;
}

export function isObjectIdLike(value) {
  return /^[a-f0-9]{24}$/i.test(String(value ?? "").trim());
}
