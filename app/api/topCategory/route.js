import db from "@/db/db";

export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deleteTopCategory = await db.topCategory.delete({
      where: { id: Number(id) },
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
  const id = await req.nextUrl.searchParams.get("id");

  const queryOptions = {
    include: {
      categories: true,
    },
  };

  if (id) {
    queryOptions.where = {
      id: Number(id),
    };
  }

  const getTopCategories = await db.topCategory.findMany(queryOptions);

  return Response.json({ data: getTopCategories });
}

export async function POST(req) {
  const data = await req.json();
  const createTopCategory = await db.topCategory.create({
    data,
  });
  console.log("error", createTopCategory);
  return Response.json({ data: createTopCategory });
}
export async function PATCH(req) {
  const data = await req.json();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const updateTopCategory = await db.topCategory.update({
      where: { id: Number(id) },
      data: { name: data.name },
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
