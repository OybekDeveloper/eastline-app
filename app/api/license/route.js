import db from "@/db/db";

export async function GET(req) {
  const id = await req.nextUrl.searchParams.get("id");
  if (id) {
    const getLicenses = await db.license.findMany({
      where: { id: Number(id) },
    });
    return Response.json({ data: getLicenses });
  }
  const getLicenses = await db.license.findMany();
  return Response.json({ data: getLicenses });
}

export async function POST(req) {
  const data = await req.json();
  const createLicense = await db.license.create({
    data,
  });
  return Response.json({ data: createLicense });
}

export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deleteLicense = await db.license.delete({
      where: { id: Number(id) },
    });

    return new Response(
      JSON.stringify({ success: true, data: deleteLicense }),
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
    const updateLicense = await db.license.update({
      where: { id: Number(id) },
      data,
    });

    return new Response(
      JSON.stringify({ success: true, data: updateLicense }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
