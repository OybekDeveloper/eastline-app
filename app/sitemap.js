import { absoluteUrl } from "@/lib/seo";
import { getServerData } from "@/lib/server-data";
import { buildCategoryPath, buildProductPath } from "@/lib/slugs";

export default async function sitemap() {
  const now = new Date().toISOString();
  const staticRoutes = ["", "/services", "/about-us", "/contacts"].map(
    (path) => ({
      url: absoluteUrl(path || "/"),
      lastModified: now,
    })
  );

  let categories = [];
  let products = [];
  try {
    const [categoriesResponse, productsResponse] = await Promise.all([
      getServerData("/api/category"),
      getServerData("/api/product"),
    ]);
    categories = categoriesResponse || [];
    products = productsResponse || [];
  } catch (error) {
    console.error("Sitemap data fetch error:", error);
  }

  const categoryEntries = categories.map((category) => ({
    url: absoluteUrl(buildCategoryPath(category.topCategory, category)),
    lastModified: category.updateAt || category.createdAt || now,
  }));

  const categoryMap = new Map(
    categories.map((category) => [category.id, category])
  );

  const productEntries = products.map((product) => {
    const category = product.category || categoryMap.get(product.categoryId);
    const topCategory = category?.topCategory;
    return {
      url: absoluteUrl(buildProductPath(topCategory, category, product)),
      lastModified: product.updateAt || product.createdAt || now,
      images: (product.image || []).map((image) => ({
        url: image,
        caption: product.name,
      })),
    };
  });

  return [...staticRoutes, ...categoryEntries, ...productEntries];
}
