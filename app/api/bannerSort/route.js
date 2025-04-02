import db from "@/db/db";

export async function GET(req) {
  const id = await req.nextUrl.searchParams.get("id");

  if (id) {
    const getBannerSort = await db.bannerSort.findMany({
      where: { id: String(id) },
    });
    return Response.json({ data: getBannerSort });
  } else {
    const getBannerSort = await db.bannerSort.findMany();
    return Response.json({ data: getBannerSort });
  }
}

export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deleteBannerSort = await db.bannerSort.delete({
      where: { id: String(id) },
    });

    return new Response(
      JSON.stringify({ success: true, data: deleteBannerSort }),
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
  const one = await req.nextUrl.searchParams.get("one");
  console.log(data);

  try {
    if (one) {
      const createBannerSort = await db.bannerSort.create({ data });
      return Response.json({ data: createBannerSort });
    } else {
      await db.bannerSort.deleteMany();
      const createdRecords = [];
      for (const item of data) {
        const created = await db.bannerSort.create({ data: item });
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
  const data = await req.json();
  try {
    const id = await req.nextUrl.searchParams.get("id");

    const updateBanner = await db.bannerSort.update({
      where: { id: String(id) },
      data,
    });

    return new Response(JSON.stringify({ success: true, data: updateBanner }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
