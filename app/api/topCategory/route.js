import db from "@/db/db";
import { generateUniqueSlug } from "@/lib/catalog";

export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deleteTopCategory = await db.topCategory.delete({
      where: { id: String(id) },
    });

    return new Response(
      JSON.stringify({ success: true, data: deleteTopCategory }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const rawId = await req.nextUrl.searchParams.get("id");
  const rawSlug = await req.nextUrl.searchParams.get("slug");
  const id =
    rawId && rawId !== "undefined" && rawId !== "null" ? String(rawId) : null;
  const slug =
    rawSlug && rawSlug !== "undefined" && rawSlug !== "null"
      ? String(rawSlug)
      : null;

  const queryOptions = {
    include: {
      categories: true,
    },
  };

  if (slug) {
    queryOptions.where = {
      slug,
    };
  } else if (id) {
    queryOptions.where = {
      id,
    };
  }

  const getTopCategories = await db.topCategory.findMany(queryOptions);

  return Response.json({ data: getTopCategories });
}

export async function POST(req) {
  const data = await req.json();
  const name = String(data?.name ?? "").trim();

  if (!name) {
    return new Response(
      JSON.stringify({ success: false, error: "Name is required" }),
      { status: 400 }
    );
  }

  const slug = await generateUniqueSlug("topCategory", name);
  const createTopCategory = await db.topCategory.create({
    data: {
      ...data,
      name,
      slug,
    },
  });
  return Response.json({ data: createTopCategory });
}
export async function PATCH(req) {
  const data = await req.json();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const name = String(data?.name ?? "").trim();

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing ID" }),
        { status: 400 }
      );
    }

    if (!name) {
      return new Response(
        JSON.stringify({ success: false, error: "Name is required" }),
        { status: 400 }
      );
    }

    const slug = await generateUniqueSlug("topCategory", name, String(id));

    const updateTopCategory = await db.topCategory.update({
      where: { id: String(id) },
      data: {
        name,
        slug,
      },
    });

    return new Response(
      JSON.stringify({ success: true, data: updateTopCategory }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
