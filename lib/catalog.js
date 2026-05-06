import "server-only";

import db from "@/db/db";
import { buildCategoryPath, buildProductPath, isObjectIdLike, slugifyText } from "@/lib/slugs";

async function findBySlugOrId(model, segment, options = {}) {
  const normalized = String(segment ?? "").trim();
  if (!normalized) return null;

  const bySlug = await db[model].findFirst({
    where: { slug: normalized },
    ...options,
  });
  if (bySlug) return bySlug;

  if (isObjectIdLike(normalized)) {
    return db[model].findUnique({
      where: { id: normalized },
      ...options,
    });
  }

  return null;
}

export async function generateUniqueSlug(model, name, excludeId) {
  const baseSlug = slugifyText(name);
  const existingRows = await db[model].findMany({
    where: {
      slug: { startsWith: baseSlug },
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    select: { slug: true },
  });

  const existingSlugs = new Set(
    existingRows
      .map((item) => item.slug)
      .filter(Boolean)
  );

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;
  while (existingSlugs.has(`${baseSlug}-${counter}`)) {
    counter += 1;
  }

  return `${baseSlug}-${counter}`;
}

export async function resolveCategoryRoute(topCategorySegment, categorySegment) {
  const category = await findBySlugOrId("category", categorySegment, {
    include: {
      products: true,
      topCategory: true,
    },
  });

  if (!category?.topCategory) {
    return null;
  }

  const canonicalPath = buildCategoryPath(category.topCategory, category);
  const requestedPath = `/${topCategorySegment}/${categorySegment}`;

  return {
    category,
    topCategory: category.topCategory,
    canonicalPath,
    shouldRedirect: canonicalPath !== requestedPath,
  };
}

export async function resolveTopCategoryRoute(topCategorySegment) {
  const topCategory = await findBySlugOrId("topCategory", topCategorySegment, {
    include: {
      categories: true,
    },
  });

  if (!topCategory) {
    return null;
  }

  const canonicalPath = `/${topCategory.slug || topCategory.id}`;

  return {
    topCategory,
    canonicalPath,
    shouldRedirect: canonicalPath !== `/${topCategorySegment}`,
  };
}

export async function resolveProductRoute(
  topCategorySegment,
  categorySegment,
  productSegment
) {
  const product = await findBySlugOrId("product", productSegment, {
    include: {
      category: {
        include: {
          topCategory: true,
        },
      },
    },
  });

  if (!product?.category?.topCategory) {
    return null;
  }

  const canonicalPath = buildProductPath(
    product.category.topCategory,
    product.category,
    product
  );
  const requestedPath = `/${topCategorySegment}/${categorySegment}/${productSegment}`;

  return {
    product,
    category: product.category,
    topCategory: product.category.topCategory,
    canonicalPath,
    shouldRedirect: canonicalPath !== requestedPath,
  };
}
