import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { signToken, COOKIE_NAME, SESSION_DURATION } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password are required" }, { status: 400 });
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Rate limiting: max 5 failed attempts per IP+email in 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentLogs = await prisma.adminLoginLog.findMany({
      where: { email, ipAddress, timestamp: { gte: fifteenMinutesAgo } },
      orderBy: { timestamp: "desc" },
    });

    let consecutiveFailures = 0;
    for (const log of recentLogs) {
      if (log.success) break;
      consecutiveFailures++;
    }

    if (consecutiveFailures >= 5) {
      return NextResponse.json({ ok: false, error: "Too many failed attempts. Try again in 15 minutes." }, { status: 429 });
    }

    // Find admin
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      await prisma.adminLoginLog.create({ data: { email, ipAddress, success: false } });
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      await prisma.adminLoginLog.create({ data: { email, ipAddress, success: false } });
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    // Success — log it and set cookie
    await prisma.adminLoginLog.create({ data: { email, ipAddress, success: true } });

    const token = signToken({ id: admin.id, email: admin.email, name: admin.name, role: admin.role });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION / 1000, // convert ms to seconds
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
