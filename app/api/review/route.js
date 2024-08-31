import db from "@/db/db";

export async function GET() {
  const getReviews = await db.reviews.findMany();
  return Response.json({ data: getReviews });
}
export async function POST(req) {
  const data = await req.json();
  const createReview = await db.reviews.create({
    data,
  });
  return Response.json({ data: createReview });
}
