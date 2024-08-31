import db from "@/db/db";

export async function GET(req) {
  const id = await req.nextUrl.searchParams.get("id");

  if (id) {
    const getTopCategroies = await db.category.findMany({
      where: { id: Number(id) },
    });
    return Response.json({ data: getTopCategroies });
  } else {
    const getTopCategroies = await db.category.findMany();
    return Response.json({ data: getTopCategroies });
  }
}

export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deleteCategory = await db.category.delete({
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
  const data = await req.json();
  const createCategory = await db.category.create({
    data: {
      name: data.name,
      topCategory: {
        connect: {
          id: Number(data.topCategoryId),
        },
      },
      image: data.image,
    },
  });
  return Response.json({ data: createCategory });
}

export async function PATCH(req) {
  const data = await req.json();
  try {
    const id = await req.nextUrl.searchParams.get("id");

    const updateCategory = await db.category.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        topCategory: {
          connect: {
            id: Number(data.topCategoryId),
          },
        },
        image: data.image,
      },
    });

    return new Response(
      JSON.stringify({ success: true, data: updateCategory }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
