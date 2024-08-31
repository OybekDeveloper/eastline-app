import db from "@/db/db";

export async function GET() {
  const getAdmin = await db.admin.findMany();
  return Response.json({ data: getAdmin });
}

export async function PATCH(req) {
  const data = await req.json();

  const updateAdmin = await db.admin.update({
    where: {
      id: 1,
    },
    data: data,
  });

  return Response.json({ data: updateAdmin });
}
