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
  const getTopCategories = await db.topCategorySort.findMany({
    ...queryOptions,
    orderBy: { uniqueId: "asc" },
  });
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
      const incomingTopCategoryIds = data.map((item) => String(item.topCategoryId));
      const existingRows = await db.topCategorySort.findMany();
      const existingByTopCategoryId = new Map(
        existingRows.map((item) => [String(item.topCategoryId), item])
      );
      const touchedIds = new Set();
      const createdRecords = [];

      for (const item of data) {
        const normalizedTopCategoryId = String(item.topCategoryId);
        const existing = existingByTopCategoryId.get(normalizedTopCategoryId);

        if (existing) {
          const updated = await db.topCategorySort.update({
            where: { id: String(existing.id) },
            data: {
              name: item.name,
              topCategoryId: normalizedTopCategoryId,
              uniqueId: Number(item.uniqueId),
            },
          });
          touchedIds.add(String(existing.id));
          createdRecords.push(updated);
        } else {
          const created = await db.topCategorySort.create({
            data: {
              name: item.name,
              topCategoryId: normalizedTopCategoryId,
              uniqueId: Number(item.uniqueId),
            },
          });
          touchedIds.add(String(created.id));
          createdRecords.push(created);
        }
      }

      const staleRows = existingRows.filter(
        (item) =>
          !incomingTopCategoryIds.includes(String(item.topCategoryId)) &&
          !touchedIds.has(String(item.id))
      );

      if (staleRows.length > 0) {
        await db.topCategorySort.deleteMany({
          where: {
            id: {
              in: staleRows.map((item) => String(item.id)),
            },
          },
        });
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
