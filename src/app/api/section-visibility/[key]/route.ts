import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params in Next.js 15
    const { key } = await params;
    
    const body = await request.json();
    const { isVisible } = body;

    if (typeof isVisible !== "boolean") {
      return NextResponse.json({ error: "isVisible must be a boolean" }, { status: 400 });
    }

    const updated = await prisma.sectionVisibility.update({
      where: { key },
      data: { isVisible },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[SECTION_VISIBILITY_PATCH]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
