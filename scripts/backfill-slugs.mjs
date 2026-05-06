import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

function slugifyText(value) {
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

function getCategoryPath(topCategory, category) {
  const topSlug = topCategory?.slug || topCategory?.id;
  const categorySlug = category?.slug || category?.id;
  return topSlug && categorySlug ? `/${topSlug}/${categorySlug}` : null;
}

function getProductPath(topCategory, category, product) {
  const categoryPath = getCategoryPath(topCategory, category);
  const productSlug = product?.slug || product?.id;
  return categoryPath && productSlug ? `${categoryPath}/${productSlug}` : null;
}

async function backfillModel(modelName) {
  const model = prisma[modelName];
  const rows = await model.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, slug: true },
  });

  const usedSlugs = new Set();
  let updated = 0;

  for (const row of rows) {
    const baseSlug = slugifyText(row.name);
    let nextSlug = row.slug?.trim() || baseSlug;

    if (usedSlugs.has(nextSlug)) {
      let counter = 2;
      while (usedSlugs.has(`${baseSlug}-${counter}`)) {
        counter += 1;
      }
      nextSlug = `${baseSlug}-${counter}`;
    }

    usedSlugs.add(nextSlug);

    if (row.slug !== nextSlug) {
      await model.update({
        where: { id: row.id },
        data: { slug: nextSlug },
      });
      updated += 1;
    }
  }

  return updated;
}

async function fixSeoCanonicalUrls() {
  const [topCategories, categories, products] = await Promise.all([
    prisma.topCategory.findMany({
      select: { id: true, slug: true, name: true },
    }),
    prisma.category.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        seo: true,
        topCategoryId: true,
      },
    }),
    prisma.product.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        seo: true,
        categoryId: true,
      },
    }),
  ]);

  const topCategoryMap = new Map(topCategories.map((item) => [item.id, item]));
  const categoryMap = new Map(categories.map((item) => [item.id, item]));
  let updatedCategories = 0;
  let updatedProducts = 0;

  for (const category of categories) {
    const topCategory = topCategoryMap.get(category.topCategoryId);
    const canonicalUrl = getCategoryPath(topCategory, category);
    if (!canonicalUrl || !category.seo || typeof category.seo !== "object") {
      continue;
    }
    if (category.seo.canonical_url === canonicalUrl) {
      continue;
    }

    await prisma.category.update({
      where: { id: category.id },
      data: {
        seo: {
          ...category.seo,
          canonical_url: canonicalUrl,
        },
      },
    });
    updatedCategories += 1;
  }

  for (const product of products) {
    const category = categoryMap.get(product.categoryId);
    const topCategory = topCategoryMap.get(category?.topCategoryId);
    const canonicalUrl = getProductPath(topCategory, category, product);
    if (!canonicalUrl || !product.seo || typeof product.seo !== "object") {
      continue;
    }
    if (product.seo.canonical_url === canonicalUrl) {
      continue;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: {
        seo: {
          ...product.seo,
          canonical_url: canonicalUrl,
        },
      },
    });
    updatedProducts += 1;
  }

  return { updatedCategories, updatedProducts };
}

async function fixBannerReferences() {
  const [categories, products, banners, bannerSorts] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, topCategoryId: true },
    }),
    prisma.product.findMany({
      select: { id: true, categoryId: true },
    }),
    prisma.banner.findMany(),
    prisma.bannerSort.findMany(),
  ]);

  const categoryMap = new Map(categories.map((item) => [item.id, item]));
  const productMap = new Map(products.map((item) => [item.id, item]));
  const nextBannerMap = new Map();

  let updatedBanners = 0;
  let updatedBannerSorts = 0;

  for (const banner of banners) {
    const product = banner.productId ? productMap.get(banner.productId) : null;
    const category = product
      ? categoryMap.get(product.categoryId)
      : banner.categoryId
        ? categoryMap.get(banner.categoryId)
        : null;

    const nextCategoryId = product?.categoryId || category?.id || null;
    const nextTopCategoryId = category?.topCategoryId || null;
    const nextProductId = product?.id || null;

    if (
      banner.productId !== nextProductId ||
      banner.categoryId !== nextCategoryId ||
      banner.topCategoryId !== nextTopCategoryId
    ) {
      const updatedBanner = await prisma.banner.update({
        where: { id: banner.id },
        data: {
          productId: nextProductId,
          categoryId: nextCategoryId,
          topCategoryId: nextTopCategoryId,
        },
      });
      nextBannerMap.set(updatedBanner.id, updatedBanner);
      updatedBanners += 1;
      continue;
    }

    nextBannerMap.set(banner.id, banner);
  }

  for (const bannerSort of bannerSorts) {
    const banner = bannerSort.bannerId
      ? nextBannerMap.get(bannerSort.bannerId) || null
      : null;
    const product = bannerSort.productId ? productMap.get(bannerSort.productId) : null;
    const category = product
      ? categoryMap.get(product.categoryId)
      : bannerSort.categoryId
        ? categoryMap.get(bannerSort.categoryId)
        : null;

    const nextCategoryId = banner?.categoryId || product?.categoryId || category?.id || null;
    const nextTopCategoryId =
      banner?.topCategoryId || category?.topCategoryId || null;
    const nextProductId = banner?.productId || product?.id || null;
    const nextBannerId = banner ? banner.id : null;
    const nextImage = banner?.image || bannerSort.image;

    if (
      bannerSort.bannerId !== nextBannerId ||
      bannerSort.categoryId !== nextCategoryId ||
      bannerSort.topCategoryId !== nextTopCategoryId ||
      bannerSort.productId !== nextProductId ||
      bannerSort.image !== nextImage
    ) {
      await prisma.bannerSort.update({
        where: { id: bannerSort.id },
        data: {
          bannerId: nextBannerId,
          categoryId: nextCategoryId,
          topCategoryId: nextTopCategoryId,
          productId: nextProductId,
          image: nextImage,
        },
      });
      updatedBannerSorts += 1;
    }
  }

  return { updatedBanners, updatedBannerSorts };
}

async function fixTopCategorySorts() {
  const [topCategories, topCategorySorts] = await Promise.all([
    prisma.topCategory.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true },
    }),
    prisma.topCategorySort.findMany({
      orderBy: { uniqueId: "asc" },
      select: { id: true, name: true, topCategoryId: true, uniqueId: true },
    }),
  ]);

  const sortByTopCategoryId = new Map(
    topCategorySorts
      .filter((item) => item.topCategoryId)
      .map((item) => [item.topCategoryId, item])
  );
  const usedOrders = new Set(
    topCategorySorts
      .map((item) => Number(item.uniqueId))
      .filter((value) => Number.isFinite(value))
  );

  let updatedTopCategorySorts = 0;
  let createdTopCategorySorts = 0;

  for (const topCategory of topCategories) {
    const existingSort = sortByTopCategoryId.get(topCategory.id);

    if (existingSort) {
      if (existingSort.name !== topCategory.name) {
        await prisma.topCategorySort.update({
          where: { id: existingSort.id },
          data: { name: topCategory.name },
        });
        updatedTopCategorySorts += 1;
      }
      continue;
    }

    let nextUniqueId = 1;
    while (usedOrders.has(nextUniqueId)) {
      nextUniqueId += 1;
    }
    usedOrders.add(nextUniqueId);

    const created = await prisma.topCategorySort.create({
      data: {
        name: topCategory.name,
        topCategoryId: topCategory.id,
        uniqueId: nextUniqueId,
      },
    });

    sortByTopCategoryId.set(topCategory.id, created);
    createdTopCategorySorts += 1;
  }

  return {
    updatedTopCategorySorts,
    createdTopCategorySorts,
  };
}

async function fixCategorySorts() {
  const [categories, topCategorySorts, categorySorts] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true, topCategoryId: true },
    }),
    prisma.topCategorySort.findMany({
      select: { id: true, topCategoryId: true },
    }),
    prisma.categorySort.findMany({
      orderBy: { uniqueId: "asc" },
      select: {
        id: true,
        uniqueId: true,
        categoryId: true,
        topCategorySortId: true,
        name: true,
      },
    }),
  ]);

  const categoryMap = new Map(categories.map((item) => [item.id, item]));
  const topCategorySortMap = new Map(
    topCategorySorts
      .filter((item) => item.topCategoryId)
      .map((item) => [item.topCategoryId, item])
  );

  let updatedCategorySorts = 0;
  let deletedCategorySorts = 0;

  for (const categorySort of categorySorts) {
    const category = categoryMap.get(categorySort.categoryId);

    if (!category?.topCategoryId) {
      await prisma.categorySort.delete({
        where: { id: categorySort.id },
      });
      deletedCategorySorts += 1;
      continue;
    }

    const topCategorySort = topCategorySortMap.get(category.topCategoryId);

    if (!topCategorySort) {
      await prisma.categorySort.delete({
        where: { id: categorySort.id },
      });
      deletedCategorySorts += 1;
      continue;
    }

    if (
      categorySort.topCategorySortId !== topCategorySort.id ||
      categorySort.name !== category.name
    ) {
      await prisma.categorySort.update({
        where: { id: categorySort.id },
        data: {
          topCategorySortId: topCategorySort.id,
          name: category.name,
        },
      });
      updatedCategorySorts += 1;
    }
  }

  return {
    updatedCategorySorts,
    deletedCategorySorts,
  };
}

async function fixProductSorts() {
  const [products, productSorts] = await Promise.all([
    prisma.product.findMany({
      select: { id: true, name: true, categoryId: true },
    }),
    prisma.sortProduct.findMany({
      orderBy: { uniqueId: "asc" },
      select: {
        id: true,
        productId: true,
        categoryId: true,
        uniqueId: true,
        name: true,
      },
    }),
  ]);

  const productMap = new Map(products.map((item) => [item.id, item]));
  const productSortMap = new Map(
    productSorts.map((item) => [`${item.productId}:${item.categoryId}`, item])
  );
  let updatedProductSorts = 0;
  let deletedProductSorts = 0;

  for (const productSort of productSorts) {
    const product = productMap.get(productSort.productId);

    if (!product?.categoryId) {
      await prisma.sortProduct.delete({
        where: { id: productSort.id },
      });
      deletedProductSorts += 1;
      continue;
    }

    if (
      productSort.categoryId !== product.categoryId ||
      productSort.name !== product.name
    ) {
      const targetKey = `${product.id}:${product.categoryId}`;
      const existingTarget = productSortMap.get(targetKey);

      if (existingTarget && existingTarget.id !== productSort.id) {
        await prisma.sortProduct.delete({
          where: { id: productSort.id },
        });
        deletedProductSorts += 1;
        continue;
      }

      await prisma.sortProduct.update({
        where: { id: productSort.id },
        data: {
          categoryId: product.categoryId,
          name: product.name,
        },
      });
      productSortMap.delete(`${productSort.productId}:${productSort.categoryId}`);
      productSortMap.set(targetKey, {
        ...productSort,
        categoryId: product.categoryId,
        name: product.name,
      });
      updatedProductSorts += 1;
    }
  }

  return {
    updatedProductSorts,
    deletedProductSorts,
  };
}

async function ensureUniqueIndex(collectionName, indexName) {
  try {
    await prisma.$runCommandRaw({
      createIndexes: collectionName,
      indexes: [
        {
          key: { slug: 1 },
          name: indexName,
          unique: true,
          partialFilterExpression: {
            slug: { $type: "string" },
          },
        },
      ],
    });
  } catch (error) {
    const message = String(error?.message || "");
    if (!message.includes("already exists")) {
      throw error;
    }
  }
}

async function main() {
  const topCategoryUpdated = await backfillModel("topCategory");
  const categoryUpdated = await backfillModel("category");
  const productUpdated = await backfillModel("product");
  const seoUpdates = await fixSeoCanonicalUrls();
  const bannerUpdates = await fixBannerReferences();
  const topCategorySortUpdates = await fixTopCategorySorts();
  const categorySortUpdates = await fixCategorySorts();
  const productSortUpdates = await fixProductSorts();

  await ensureUniqueIndex("TopCategory", "TopCategory_slug_unique");
  await ensureUniqueIndex("Category", "Category_slug_unique");
  await ensureUniqueIndex("Product", "Product_slug_unique");

  console.log(
    JSON.stringify(
      {
        topCategoryUpdated,
        categoryUpdated,
        productUpdated,
        ...seoUpdates,
        ...bannerUpdates,
        ...topCategorySortUpdates,
        ...categorySortUpdates,
        ...productSortUpdates,
      },
      null,
      2
    )
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Slug backfill completed.");
  })
  .catch(async (error) => {
    console.error("Slug backfill failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
