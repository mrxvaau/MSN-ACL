import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";

export async function GET() {
  try {
    const items = await prisma.newsPost.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = verifyToken((await cookies()).get("admin_session")?.value);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    
    let order = 0;
    try {
      const lastItem = await prisma.newsPost.findFirst({ orderBy: { order: "desc" } });
      order = lastItem ? lastItem.order + 1 : 0;
    } catch(e) {} // Some models might not have order, but plan says "keep order". We assume they have 'order' field. 
    // Wait, SocialLink has 'order'.

    const newItem = await prisma.newsPost.create({
      data: { ...data, order },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
