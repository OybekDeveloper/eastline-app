import AllCategories from "@/components/shared/allCategories";
import { buildMetadata, siteConfig } from "@/lib/seo";
import { getServerData } from "@/lib/server-data";
import { resolveTopCategoryRoute } from "@/lib/catalog";
import { notFound, permanentRedirect } from "next/navigation";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const topCategories = await getServerData("/api/topCategory?summary=1");
    return (topCategories || []).map((tc) => ({
      topCategory: tc.slug || tc.id,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { topCategory } = await params;
  const route = await resolveTopCategoryRoute(topCategory);
  const currentTopCategory = route?.topCategory;

  return buildMetadata({
    title: currentTopCategory?.name || "Каталог товаров",
    description: currentTopCategory?.name
      ? `${currentTopCategory.name} в каталоге ${siteConfig.name}.`
      : siteConfig.description,
    path: route?.canonicalPath || `/${topCategory}`,
    type: "website",
  });
}

export default async function Page({ params }) {
  const { topCategory } = await params;
  const route = await resolveTopCategoryRoute(topCategory);

  if (!route?.topCategory) {
    notFound();
  }

  if (route.shouldRedirect) {
    permanentRedirect(route.canonicalPath);
  }

  const categories = await getServerData(
    `/api/category?topCategoryId=${route.topCategory.id}`
  );

  return (
    <div className="min-h-[50%] w-full py-10">
      <AllCategories categories={categories} />
    </div>
  );
}
