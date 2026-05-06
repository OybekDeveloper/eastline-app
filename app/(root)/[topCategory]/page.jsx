import AllCategories from "@/components/shared/allCategories";
import { buildMetadata, siteConfig } from "@/lib/seo";
import { getServerData } from "@/lib/server-data";
import { resolveTopCategoryRoute } from "@/lib/catalog";
import { notFound, permanentRedirect } from "next/navigation";

export async function generateMetadata({ params }) {
  const route = await resolveTopCategoryRoute(params.topCategory);
  const topCategory = route?.topCategory;

  return buildMetadata({
    title: topCategory?.name || "Каталог товаров",
    description: topCategory?.name
      ? `${topCategory.name} в каталоге ${siteConfig.name}.`
      : siteConfig.description,
    path: route?.canonicalPath || `/${params.topCategory}`,
    type: "website",
  });
}

export default async function Page({ params }) {
  const route = await resolveTopCategoryRoute(params.topCategory);

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
