import db from "@/db/db";

export async function GET(req) {
  const id = req.nextUrl.searchParams.get("id");
  const categoryId = req.nextUrl.searchParams.get("categoryId");

  if (id) {
    const getTopCategories = await db.categorySort.findMany({
      where: { id: String(id) },
    });
    return Response.json({ data: getTopCategories });
  } else if (categoryId) {
    const getTopCategories = await db.categorySort.findMany({
      where: { categoryId: String(categoryId) },
    });
    return Response.json({ data: getTopCategories });
  } else {
    const getTopCategories = await db.categorySort.findMany();
    return Response.json({ data: getTopCategories });
  }
}

export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const deleteCategory = await db.categorySort.delete({
      where: { id: String(id) },
    });

    return new Response(
      JSON.stringify({ success: true, data: deleteCategory }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const all = req.nextUrl.searchParams.get("all");
  const data = await req.json();
  console.log(data);

  if (all) {
    for (const item of data) {
      await db.categorySort.create({
        data: item,
      });
    }
    return Response.json({ success: true, message: "All items created" });
  } else {
    const createCategory = await db.categorySort.create({
      data: {
        name: data.name,
        topCategorySortId: data.topCategorySortId,
        categoryId: data.categoryId,
        uniqueId: data.uniqueId,
      },
    });
    return Response.json({ data: createCategory });
  }
}

export async function PATCH(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const all = req.nextUrl.searchParams.get("all");
    const data = await req.json();
    console.log(data);

    if (all) {
      if (Array.isArray(data)) {
        for (const item of data) {
          await db.categorySort.update({
            where: { id: String(item.id) },
            data: {
              uniqueId: item.uniqueId,
            },
          });
        }
        return new Response(
          JSON.stringify({ success: true, message: "All items updated" }),
          { status: 200 }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, error: "Data must be an array" }),
          { status: 400 }
        );
      }
    }

    if (id) {
      const { name, categoryId, uniqueId, topCategorySortId } = data;
      const updateCategory = await db.categorySort.update({
        where: { id: String(id) },
        data: {
          name: name,
          categoryId: String(categoryId),
          uniqueId: Number(uniqueId),
          topCategorySortId: String(topCategorySortId),
        },
      });
      return new Response(
        JSON.stringify({ success: true, data: updateCategory }),
        { status: 200 }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
