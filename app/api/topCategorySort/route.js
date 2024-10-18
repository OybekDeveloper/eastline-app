import db from "@/db/db";

export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    // Ensure the id is valid
    if (!id || isNaN(Number(id))) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid or missing ID" }),
        { status: 400 }
      );
    }

    // Delete based on the primary key (id) instead of topCategoryId
    const deleteTopCategory = await db.topCategorySort.delete({
      where: { id: Number(id) }, // Use `id` instead of `topCategoryId`
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
  const one = await req.nextUrl.searchParams.get("one");

  try {
    if (one) {
      const createTopCategory = await db.topCategorySort.create({
        data,
      });

      return Response.json({ data: createTopCategory });
    } else {
      await db.topCategorySort.deleteMany();

      const createTopCategory = await db.topCategorySort.createMany({
        data,
        skipDuplicates: true,
      });

      return Response.json({ data: createTopCategory });
    }
  } catch (error) {
    // Handle any potential errors during the process
    return Response.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  const data = await req.json();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const updateTopCategory = await db.topCategorySort.update({
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
