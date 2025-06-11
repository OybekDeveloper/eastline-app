import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const productId = searchParams.get("productId");

    // Filtrlarni tayyorlash
    const where = {};
    if (categoryId) {
      where.categoryId = String(categoryId);
    }
    if (productId) {
      where.productId = String(productId);
    }

    // SortProduct ma'lumotlarini olish
    const sortProducts = await prisma.sortProduct.findMany({
      where,
      orderBy: {
        uniqueId: "asc", // uniqueId bo‘yicha saralash
      },
    });

    return Response.json({ data: sortProducts });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req) {
  try {
    const reqD = await req.json();
    console.log(reqD);
    const products = reqD.products;

    if (!products || !Array.isArray(products)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid input" }),
        { status: 400 }
      );
    }

    for (const product of products) {
      const { productId, categoryId, uniqueId, name } = product;

      const existingSort = await prisma.sortProduct.findUnique({
        where: {
          productId_categoryId: { productId, categoryId },
        },
      });

      if (existingSort) {
        await prisma.sortProduct.update({
          where: {
            productId_categoryId: { productId, categoryId },
          },
          data: { uniqueId },
        });
      } else {
        await prisma.sortProduct.create({
          data: {
            name,
            productId,
            categoryId,
            uniqueId,
          },
        });
      }
    }

    return Response.json({
      data: { message: "Product sort order saved successfully" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
