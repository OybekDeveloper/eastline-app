import db from "@/db/db";

export async function GET(req) {
  const id = await req.nextUrl.searchParams.get("id");

  if (id) {
    const getBanner = await db.banner.findMany({
      where: { id: String(id) },
    });
    return Response.json({ data: getBanner });
  } else {
    const getBanner = await db.banner.findMany();
    return Response.json({ data: getBanner });
  }
}

export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deleteBanner = await db.banner.delete({
      where: { id: String(id) },
    });

    return new Response(JSON.stringify({ success: true, data: deleteBanner }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const data = await req.json();
  console.log(data);

  const createBanner = await db.banner.create({
    data,
  });
  return Response.json({ data: createBanner });
}

export async function PATCH(req) {
  const data = await req.json();
  try {
    const id = await req.nextUrl.searchParams.get("id");

    const updateBanner = await db.banner.update({
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
