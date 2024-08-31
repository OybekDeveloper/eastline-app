import db from "@/db/db";

export async function GET() {
  const getCurrency = await db.currency.findMany();
  return Response.json({ data: getCurrency });
}

export async function PATCH(req) {
  const data = await req.json();

  const updateCurrency = await db.currency.update({
    where: {
      id: 1,
    },
    data: data,
  });

  return Response.json({ data: updateCurrency });
}
