import { NextResponse } from "next/server";
import db from "@/db/db";


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let getTopCategories;

    if (id) {
      getTopCategories = await db.category.findMany({
        where: { id: Number(id) },
      });

      if (getTopCategories.length === 0) {
        return new NextResponse(JSON.stringify({ error: "Category not found" }), {
          status: 404,
          headers: { "Cache-Control": "no-store, max-age=0" }, // Prevent caching
        });
      }
    } else {
      getTopCategories = await db.category.findMany({
        include: {
          products: true,
        },
      });
    }

    return new NextResponse(JSON.stringify({ data: getTopCategories }), {
      status: 200,
      headers: { "Cache-Control": "no-store, max-age=0" }, // Prevent caching
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Cache-Control": "no-store, max-age=0" }, // Prevent caching
    });
  }
}


export async function DELETE(req) {
  try {
    const id = await req.nextUrl.searchParams.get("id");
    const deleteCategory = await db.category.delete({
      where: { id: Number(id) },
    });

    return new Response(
      JSON.stringify({ success: true, data: deleteCategory }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const data = await req.json();
  const createCategory = await db.category.create({
    data: {
      name: data.name,
      topCategory: {
        connect: {
          id: Number(data.topCategoryId),
        },
      },
      image: data.image,
    },
  });
  return Response.json({ data: createCategory });
}

export async function PATCH(req) {
  const data = await req.json();
  try {
    const id = await req.nextUrl.searchParams.get("id");

    const updateCategory = await db.category.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        topCategory: {
          connect: {
            id: Number(data.topCategoryId),
          },
        },
        image: data.image,
      },
    });

    return new Response(
      JSON.stringify({ success: true, data: updateCategory }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
