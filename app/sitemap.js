import { getData } from "@/lib/api.services";
import { absoluteUrl } from "@/lib/seo";

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
      getData("/api/category", "category"),
      getData("/api/product", "product"),
    ]);
    categories = categoriesResponse || [];
    products = productsResponse || [];
  } catch (error) {
    console.error("Sitemap data fetch error:", error);
  }

  const categoryEntries = categories.map((category) => ({
    url: absoluteUrl(`/${category.topCategoryId}/${category.id}`),
    lastModified: category.updateAt || category.createdAt || now,
  }));

  const categoryMap = new Map(
    categories.map((category) => [category.id, category])
  );

  const productEntries = products.map((product) => {
    const category = categoryMap.get(product.categoryId);
    const topCategoryId = category?.topCategoryId || "top";
    return {
      url: absoluteUrl(`/${topCategoryId}/${product.categoryId}/${product.id}`),
      lastModified: product.updateAt || product.createdAt || now,
      images: (product.image || []).map((image) => ({
        url: image,
        caption: product.name,
      })),
    };
  });

  return [...staticRoutes, ...categoryEntries, ...productEntries];
}
