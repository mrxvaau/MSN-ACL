import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Items must be an array" }, { status: 400 });
    }

    // items should be [{ id: "...", order: 0 }, { id: "...", order: 1 }]
    // We update them in a transaction
    await prisma.$transaction(
      items.map((item: { id: string; order: number }) =>
        prisma.sectionVisibility.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SECTION_VISIBILITY_REORDER]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
