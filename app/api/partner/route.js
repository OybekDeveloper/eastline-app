import db from "@/db/db";
import { normalizeMediaPayload } from "@/lib/media";

export async function GET(req) {
  const id = await req.nextUrl.searchParams.get("id");
  if (id) {
    const getPartners = await db.partner.findMany({
      where: { id: String(id) },
    });
    return Response.json({ data: normalizeMediaPayload(getPartners) });
  }
  const getPartners = await db.partner.findMany();
  return Response.json({ data: normalizeMediaPayload(getPartners) });
}

export async function POST(req) {
  const data = await req.json();
  const createPartner = await db.partner.create({
    data,
  });
  return Response.json({ data: createPartner });
}

export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deleteNews = await db.partner.delete({
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
    const updateNews = await db.partner.update({
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
