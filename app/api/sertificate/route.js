import db from "@/db/db";

export async function POST(req) {
  const data = await req.json();
  const createSertificate = await db.sertificate.create({
    data,
  });
  return Response.json({ data: createSertificate });
}

export async function GET(req) {
  const id = await req.nextUrl.searchParams.get("id");

  if (id) {
    const getSertificates = await db.sertificate.findMany({
      where: { id: String(id) },
    });
    return Response.json({ data: getSertificates });
  } else {
    const getSertificates = await db.sertificate.findMany();
    return Response.json({ data: getSertificates });
  }
}

export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deleteSertificates = await db.sertificate.delete({
      where: { id: String(id) },
    });

    return new Response(
      JSON.stringify({ success: true, data: deleteSertificates }),
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
    const updateSertificates = await db.sertificate.update({
      where: { id: String(id) },
      data,
    });

    return new Response(
      JSON.stringify({ success: true, data: updateSertificates }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
