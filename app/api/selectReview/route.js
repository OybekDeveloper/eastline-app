import db from "@/db/db";

export async function GET() {
  const getSelectReviews = await db.selectReview.findMany();
  return Response.json({ data: getSelectReviews });
}

export async function POST(req) {
  const data = await req.json();
  console.log(data);

  const createdReviews = [];
  for (const review of data.updatedReviews) {
    const createdReview = await db.selectReview.create({
      data: review,
    });
    createdReviews.push(createdReview);
  }

  return Response.json({ data: createdReviews });
}

export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const deleteReview = await db.selectReview.delete({
      where: { id: String(id) },
    });

    return new Response(JSON.stringify({ success: true, data: deleteReview }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}