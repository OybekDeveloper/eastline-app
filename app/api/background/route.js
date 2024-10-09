import db from "@/db/db";

export async function POST(req) {
  const data = await req.json();
  const createBackground = await db.background.create({
    data,
  });
  return Response.json({ data: createBackground });
}

export async function GET(req) {
  const id = await req.nextUrl.searchParams.get("id");

  if (id) {
    const getBackground = await db.background.findMany({
      where: { id: Number(id) },
    });
    return Response.json({ data: getBackground });
  } else {
    const getBackground = await db.background.findMany();
    return Response.json({ data: getBackground });
  }
}

export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deleteBackground = await db.background.delete({
      where: { id: Number(id) },
    });

    return new Response(
      JSON.stringify({ success: true, data: deleteBackground }),
      { status: 200 }
    );
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
    const updateBackground = await db.background.update({
      where: { id: Number(id) },
      data,
    });

    return new Response(
      JSON.stringify({ success: true, data: updateBackground }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
