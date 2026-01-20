import db from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, password } = await req.json();
    if (!name || !password) {
      return NextResponse.json(
        { message: "Имя и пароль обязательны" },
        { status: 400 }
      );
    }

    // Find the admin by name
    const admin = await db.admin.findFirst({
      where: {
        name: name,
      },
      orderBy: {
        updateAt: "desc",
      },
    });

    if (!admin) {
      const existingAdmin = await db.admin.findFirst({
        orderBy: {
          updateAt: "desc",
        },
      });

      if (!existingAdmin) {
        // Bootstrap the first admin if none exist yet.
        const createdAdmin = await db.admin.create({
          data: { name, password },
        });
        return NextResponse.json(
          { message: "Админ создан", admin: createdAdmin },
          { status: 201 }
        );
      }

      return NextResponse.json({ message: "Админ не найден" }, { status: 404 });
    }

    // Check if the provided password matches
    const isPasswordValid = admin.password === password; // Replace with proper hashing comparison if needed

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Неверный пароль" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Вход успешен!!!", admin: admin },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const getAdmin = await db.admin.findMany();
  return Response.json({ data: getAdmin });
}

export async function PATCH(req) {
  try {
    const data = await req.json();
    const { name } = data || {};

    let admin = null;
    if (name) {
      admin = await db.admin.findFirst({
        where: { name },
        orderBy: {
          updateAt: "desc",
        },
      });
    }

    if (!admin) {
      admin = await db.admin.findFirst({
        orderBy: {
          updateAt: "desc",
        },
      });
    }

    if (!admin) {
      const createdAdmin = await db.admin.create({ data });
      return Response.json({ data: createdAdmin }, { status: 201 });
    }

    const updateAdmin = await db.admin.update({
      where: {
        id: admin.id,
      },
      data: data,
    });

    return Response.json({ data: updateAdmin });
  } catch (error) {
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  const data = await req.json();

  const updateAdmin = await db.admin.create({
    data: data,
  });

  return Response.json({ data: updateAdmin });
}
