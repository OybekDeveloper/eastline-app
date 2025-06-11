import db from "@/db/db";


export async function GET(req) {
  const id = await req.nextUrl.searchParams.get("id");
  const categoryId = await req.nextUrl.searchParams.get("categoryId");
  if (id) {
    const getProducts = await db.product.findMany({
      where: { id: String(id) },
    });
    return Response.json({ data: getProducts });
  }
  if (categoryId) {
    const getCategoryProduct = await db.product.findMany({
      where: {
        categoryId: String(categoryId),
      },
    });
    return Response.json({ data: getCategoryProduct });
  } else {
    const getProducts = await db.product.findMany();
    return Response.json({ data: getProducts });
  }
}

export async function POST(req) {
  const data = await req.json();

  const createProduct = await db.product.create({
    data: {
      name: data.name,
      description: data.description,
      feature: data.feature,
      price: data.price,
      brand: data.brand,
      image: data.images,
      category: {
        connect: {
          id: String(data.categoryId),
        },
      },
    },
  });

  return Response.json({ data: createProduct });
}

export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deleteTopCategory = await db.product.delete({
      where: { id: String(id) },
    });

    return new Response(
      JSON.stringify({ success: true, data: "deleteProduct" }),
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

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const updateProduct = await db.product.update({
      where: { id: String(id) },
      data: {
        name: data.name,
        description: data.description,
        feature: data.feature,
        price: data.price,
        brand: data.brand,
        image: data.images,
        category: {
          connect: {
            id: String(data.categoryId),
          },
        },
      },
    });

    return new Response(
      JSON.stringify({ success: true, data: updateProduct }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
