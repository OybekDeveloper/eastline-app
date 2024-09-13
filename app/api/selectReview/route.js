import db from "@/db/db";

export async function GET() {
  const getSelectReviews = await db.selectReview.findMany();
  return Response.json({ data: getSelectReviews });
}
export async function POST(req) {
  const data = await req.json();
  console.log(data.updatedReviews);
  
  const createSelectReview = await db.selectReview.createMany({
    data: data.updatedReviews,
    skipDuplicates: true,
  });

  return Response.json({ data: createSelectReview });
}

export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deleteReview = await db.selectReview.delete({
      where: { id: Number(id) },
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
