import db from "@/db/db";

export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deleteTopCategory = await db.topCategorySort.delete({
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

  const queryOptions = {};

  if (id) {
    queryOptions.where = {
      id: Number(id),
    };
  }

  const getTopCategories = await db.topCategorySort.findMany(queryOptions);

  return Response.json({ data: getTopCategories });
}

export async function POST(req) {
  const data = await req.json();
  const createTopCategory = await db.topCategorySort.createMany({
    data,
    skipDuplicates: true,
  });
  return Response.json({ data: createTopCategory });
}
export async function PATCH(req) {
  const data = await req.json();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const updateTopCategory = await db.topCategorySort.updateMany({
      where: { id: Number(id) },
      data: { uniqueId: data.uniqueId },
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
