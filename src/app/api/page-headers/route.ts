import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const headers = await prisma.pageHeader.findMany({
      orderBy: { pageKey: "asc" },
    });
    return NextResponse.json(headers);
  } catch (error) {
    console.error("Error fetching page headers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
