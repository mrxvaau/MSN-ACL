import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.heroSlide.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    
    let order = 0;
    try {
      const lastItem = await prisma.heroSlide.findFirst({ orderBy: { order: "desc" } });
      order = lastItem ? lastItem.order + 1 : 0;
    } catch(e) {} // Some models might not have order, but plan says "keep order". We assume they have 'order' field. 
    // Wait, SocialLink has 'order'.

    const newItem = await prisma.heroSlide.create({
      data: { ...data, order },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create", details: error.message }, { status: 500 });
  }
}
