import db from "@/db/db";

export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid or missing ID" }),
        { status: 400 }
      );
    }

    const deleteTopCategory = await db.topCategorySort.delete({
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
  const id = req.nextUrl.searchParams.get("id");
  const queryOptions = id ? { where: { id: String(id) } } : {};
  const getTopCategories = await db.topCategorySort.findMany(queryOptions);
  return Response.json({ data: getTopCategories });
}

export async function POST(req) {
  const data = await req.json();
  const one = req.nextUrl.searchParams.get("one");

  try {
    if (one) {
      const createTopCategory = await db.topCategorySort.create({ data });
      return Response.json({ data: createTopCategory });
    } else {
      await db.topCategorySort.deleteMany();
      const createdRecords = [];
      
      for (const item of data) {
        const created = await db.topCategorySort.create({ data: item });
        createdRecords.push(created);
      }
      
      return Response.json({ data: createdRecords });
    }
  } catch (error) {
    return Response.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const data = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing ID" }),
        { status: 400 }
      );
    }

    const updateTopCategory = await db.topCategorySort.update({
      where: { id: String(id) },
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
