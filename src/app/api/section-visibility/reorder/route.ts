import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const session = verifyToken((await cookies()).get("admin_session")?.value);
    if (!session) {
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
