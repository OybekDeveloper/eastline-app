import "server-only";

import { cache } from "react";
import db from "@/db/db";
import { normalizeMediaPayload } from "@/lib/media";

function withId(value) {
  if (value == null) return undefined;
  const normalized = String(value).trim();
  if (!normalized || normalized === "undefined" || normalized === "null") {
    return undefined;
  }
  return normalized;
}

function withMedia(data) {
  return normalizeMediaPayload(data);
}

export const getServerData = cache(async (url) => {
  const requestUrl = new URL(url, "http://localhost");
  const { pathname, searchParams } = requestUrl;

  switch (pathname) {
    case "/api/topCategory": {
      const id = withId(searchParams.get("id"));
      return withMedia(
        await db.topCategory.findMany({
          ...(id ? { where: { id } } : {}),
          include: {
            categories: true,
          },
        })
      );
    }

    case "/api/topCategorySort": {
      const id = withId(searchParams.get("id"));
      return withMedia(
        await db.topCategorySort.findMany({
          ...(id ? { where: { id } } : {}),
          orderBy: { uniqueId: "asc" },
        })
      );
    }

    case "/api/category": {
      const id = withId(searchParams.get("id"));
      const topCategoryId = withId(searchParams.get("topCategoryId"));
      const where = id
        ? { id: withId(id) }
        : topCategoryId
          ? { topCategoryId: withId(topCategoryId) }
          : undefined;

      return withMedia(
        await db.category.findMany({
          ...(where ? { where } : {}),
          include: {
            products: true,
          },
        })
      );
    }

    case "/api/categorySort": {
      const id = withId(searchParams.get("id"));
      const categoryId = withId(searchParams.get("categoryId"));
      const where = id
        ? { id: withId(id) }
        : categoryId
          ? { categoryId: withId(categoryId) }
          : undefined;

      return withMedia(
        await db.categorySort.findMany({
          ...(where ? { where } : {}),
          orderBy: { uniqueId: "asc" },
        })
      );
    }

    case "/api/product": {
      const id = withId(searchParams.get("id"));
      const categoryId = withId(searchParams.get("categoryId"));
      const where = id
        ? { id: withId(id) }
        : categoryId
          ? { categoryId: withId(categoryId) }
          : undefined;

      return withMedia(
        await db.product.findMany({
          ...(where ? { where } : {}),
        })
      );
    }

    case "/api/productSort": {
      const productId = withId(searchParams.get("productId"));
      const categoryId = withId(searchParams.get("categoryId"));
      const where = {
        ...(productId ? { productId: withId(productId) } : {}),
        ...(categoryId ? { categoryId: withId(categoryId) } : {}),
      };

      return await db.sortProduct.findMany({
        ...(Object.keys(where).length ? { where } : {}),
        orderBy: { uniqueId: "asc" },
      });
    }

    case "/api/product-visibility":
      return await db.productVisibility.findFirst();

    case "/api/contact": {
      const id = withId(searchParams.get("id"));
      if (id) {
        return await db.contacts.findUnique({
          where: { id: withId(id) },
        });
      }

      return await db.contacts.findMany();
    }

    case "/api/background":
      return withMedia(await db.background.findMany());

    case "/api/banner":
      return withMedia(await db.banner.findMany());

    case "/api/bannerSort":
      return withMedia(await db.bannerSort.findMany({ orderBy: { uniqueId: "asc" } }));

    case "/api/currency":
      return await db.currency.findMany();

    case "/api/license":
      return withMedia(await db.license.findMany());

    case "/api/news":
      return withMedia(await db.news.findMany());

    case "/api/partner":
      return withMedia(await db.partner.findMany());

    case "/api/selectReview":
      return await db.selectReview.findMany();

    case "/api/sertificate":
      return withMedia(await db.sertificate.findMany());

    default:
      throw new Error(`Unsupported server data route: ${pathname}`);
  }
});
