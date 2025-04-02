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

export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deleteReview = await db.reviews.delete({
      where: { id: String(id) },
    });

    return new Response(
      JSON.stringify({ success: true, data: deleteReview }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
