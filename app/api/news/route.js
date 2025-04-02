import db from "@/db/db";

export async function GET(req) {
  const id = await req.nextUrl.searchParams.get("id");

  if (id) {
    const getNews = await db.news.findMany({
      where: { id: String(id) },
    });
    return Response.json({ data: getNews });
  }
  const getNews = await db.news.findMany();
  return Response.json({ data: getNews });
}

export async function POST(req) {
  const data = await req.json();
  const createNews = await db.news.create({
    data,
  });
  return Response.json({ data: createNews });
}

export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deleteNews = await db.news.delete({
      where: { id: String(id) },
    });

    return new Response(JSON.stringify({ success: true, data: deleteNews }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  const data = await req.json();
  const id = await req.nextUrl.searchParams.get("id");

  try {
    const updateNews = await db.news.update({
      where: { id: String(id) },
      data,
    });

    return new Response(JSON.stringify({ success: true, data: updateNews }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
