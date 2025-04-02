import db from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, password } = await req.json();

    // Find the admin by name
    const admin = await db.admin.findMany({
      where: {
        name: name,
      },
    });

    if (admin.length === 0) {
      return NextResponse.json({ message: "Админ не найден" }, { status: 404 });
    }

    // Check if the provided password matches
    const isPasswordValid = admin[0].password === password; // Replace with proper hashing comparison if needed

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Неверный пароль" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Вход успешен!!!", admin: admin[0] },
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
  const data = await req.json();

  const updateAdmin = await db.admin.update({
    where: {
      id: String("67e66e9f1dfa5322e99a3bad"),
    },
    data: data,
  });

  return Response.json({ data: updateAdmin });
}
export async function PUT(req) {
  const data = await req.json();

  const updateAdmin = await db.admin.create({
    data: data,
  });

  return Response.json({ data: updateAdmin });
}
