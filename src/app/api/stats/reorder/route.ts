import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";

export async function PATCH(req: NextRequest) {
  try {
    const session = verifyToken((await cookies()).get("admin_session")?.value);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { items } = await req.json();

    await prisma.$transaction(
      items.map((item: { id: string; order: number }) =>
        prisma.stat.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reorder" }, { status: 500 });
  }
}
