import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";

export async function GET() {
  const session = verifyToken((await cookies()).get("admin_session")?.value);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.siteSetting.findFirst();
  return NextResponse.json(settings || {});
}

export async function PATCH(req: NextRequest) {
  const session = verifyToken((await cookies()).get("admin_session")?.value);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const current = await prisma.siteSetting.findFirst();

    let settings;
    if (current) {
      settings = await prisma.siteSetting.update({
        where: { id: current.id },
        data,
      });
    } else {
      settings = await prisma.siteSetting.create({
        data,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
