import db from "@/db/db";

export async function GET(req) {
  const id = await req.nextUrl.searchParams.get("id");
  const categoryId = await req.nextUrl.searchParams.get("categoryId");

  if (id) {
    const getTopCategroies = await db.categorySort.findMany({
      where: { id: Number(id) },
    });
    return Response.json({ data: getTopCategroies });
  } else if (categoryId) {
    const getTopCategroies = await db.categorySort.findMany({
      where: { categoryId: Number(categoryId) },
    });
    return Response.json({ data: getTopCategroies });
  } else {
    const getTopCategroies = await db.categorySort.findMany();
    return Response.json({ data: getTopCategroies });
  }
}

export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deleteCategory = await db.categorySort.delete({
      where: { id: Number(id) },
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
  const all = await req.nextUrl.searchParams.get("all");

  const data = await req.json();
  console.log(data);

  if (all) {
    const createCategory = await db.categorySort.createMany({
      data,
      skipDuplicates: true,
    });
    return Response.json({ data: createCategory });
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
    const id = await req.nextUrl.searchParams.get("id");
    const all = await req.nextUrl.searchParams.get("all");
    const data = await req.json();
    console.log(data);

    if (all) {
      // Handle batch update if 'all=true' is passed
      if (Array.isArray(data)) {
        const updatePromises = data.map((item) =>
          db.categorySort.update({
            where: { id: Number(item.id) },
            data: {
              uniqueId: item.uniqueId, // Update the necessary fields
            },
          })
        );
        const updateCategory = await Promise.all(updatePromises);
        return new Response(
          JSON.stringify({ success: true, data: updateCategory }),
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
        where: { id: Number(id) },
        data: {
          name: name,
          categoryId: Number(categoryId),
          uniqueId: Number(uniqueId),
          topCategorySortId: Number(topCategorySortId),
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
