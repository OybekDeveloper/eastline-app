import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET() {
  const visibility = await prisma.productVisibility.findFirst();
  return NextResponse.json({ data: visibility });
}

export async function PUT(req) {
  const body = await req.json();
  const { show } = body;

  const existing = await prisma.productVisibility.findFirst();

  if (existing) {
    const updated = await prisma.productVisibility.update({
      where: { id: existing.id },
      data: { show },
    });
    return NextResponse.json({ success: true, data: updated });
  } else {
    const created = await prisma.productVisibility.create({
      data: { show },
    });
    return NextResponse.json({ success: true, data: created });
  }
}
