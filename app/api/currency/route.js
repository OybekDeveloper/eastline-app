import db from "@/db/db";

export async function GET() {
  const getCurrency = await db.currency.findMany();
  return Response.json({ data: getCurrency });
}

export async function PATCH(req) {
  const data = await req.json();

  const updateCurrency = await db.currency.update({
    where: {
      id: "67e673a11dfa5322e99a3bb1",
    },
    data: data,
  });

  return Response.json({ data: updateCurrency });
}

export async function POST(req) {
  const data = await req.json();
  const createCurrency = await db.currency.create({ data });
  return Response.json({ data: createCurrency });
}
