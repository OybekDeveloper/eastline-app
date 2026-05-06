import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import db from "@/db/db";
import { normalizeMediaPayload } from "@/lib/media";

const withCache = typeof cache === "function" ? cache : (fn) => fn;
const REVALIDATE_SECONDS = 60 * 60 * 24;
const ROUTE_TAGS = {
  "/api/background": "background",
  "/api/banner": "banner",
  "/api/bannerSort": "bannerSort",
  "/api/category": "category",
  "/api/categorySort": "categorySort",
  "/api/contact": "contact",
  "/api/currency": "currency",
  "/api/license": "license",
  "/api/news": "news",
  "/api/partner": "partner",
  "/api/product": "product",
  "/api/product-visibility": "product-visibility",
  "/api/productSort": "productSort",
  "/api/selectReview": "selectReview",
  "/api/sertificate": "sertificate",
  "/api/topCategory": "topCategory",
  "/api/topCategorySort": "topCategorySort",
};

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

function getCacheTags(url) {
  const requestUrl = new URL(url, "http://localhost");
  const tag = ROUTE_TAGS[requestUrl.pathname];
  return tag ? [tag] : [];
}

const getServerDataUncached = async (url) => {
  const requestUrl = new URL(url, "http://localhost");
  const { pathname, searchParams } = requestUrl;

  switch (pathname) {
    case "/api/topCategory": {
      const id = withId(searchParams.get("id"));
      const slug = withId(searchParams.get("slug"));
      const summary = searchParams.get("summary") === "1";
      return withMedia(
        await db.topCategory.findMany({
          ...((slug || id) ? { where: slug ? { slug } : { id } } : {}),
          include: {
            categories: summary
              ? {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    image: true,
                    topCategoryId: true,
                  },
                }
              : true,
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
      const slug = withId(searchParams.get("slug"));
      const topCategoryId = withId(searchParams.get("topCategoryId"));
      const summary = searchParams.get("summary") === "1";
      const where = slug
        ? { slug: withId(slug) }
        : id
        ? { id: withId(id) }
        : topCategoryId
          ? { topCategoryId: withId(topCategoryId) }
          : undefined;

      return withMedia(
        await db.category.findMany({
          ...(where ? { where } : {}),
          ...(summary
            ? {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  image: true,
                  topCategoryId: true,
                  topCategory: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              }
            : {
                include: {
                  products: true,
                  topCategory: true,
                },
              }),
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
      const slug = withId(searchParams.get("slug"));
      const categoryId = withId(searchParams.get("categoryId"));
      const search = searchParams.get("search") === "1";
      const latest = Number(searchParams.get("latest") || 0);
      const where = slug
        ? { slug: withId(slug) }
        : id
        ? { id: withId(id) }
        : categoryId
          ? { categoryId: withId(categoryId) }
          : undefined;

      if (search) {
        return withMedia(
          await db.product.findMany({
            select: {
              id: true,
              name: true,
              slug: true,
              categoryId: true,
              category: {
                select: {
                  id: true,
                  slug: true,
                  topCategory: {
                    select: {
                      id: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          })
        );
      }

      if (Number.isFinite(latest) && latest > 0) {
        return withMedia(
          await db.product.findMany({
            take: latest,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              price: true,
              brand: true,
              image: true,
              categoryId: true,
            },
          })
        );
      }

      return withMedia(
        await db.product.findMany({
          ...(where ? { where } : {}),
          include: {
            category: {
              include: {
                topCategory: true,
              },
            },
          },
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
};

export const getServerData = withCache(async (url) => {
  const getCachedUrl = unstable_cache(
    async () => getServerDataUncached(url),
    ["server-data", url],
    {
      revalidate: REVALIDATE_SECONDS,
      tags: getCacheTags(url),
    }
  );

  return getCachedUrl();
});
