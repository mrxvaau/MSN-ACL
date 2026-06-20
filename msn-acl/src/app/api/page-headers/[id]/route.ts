import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.pageHeader.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        backgroundImage: body.backgroundImage,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating page header:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
