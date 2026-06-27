import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, signToken, COOKIE_NAME, SESSION_DURATION } from "@/lib/session";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json({ ok: false });
  }

  // Refresh the cookie (sliding window)
  const newToken = signToken({ id: payload.id, email: payload.email, name: payload.name, role: payload.role });
  cookieStore.set(COOKIE_NAME, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION / 1000,
  });

  return NextResponse.json({ ok: true, admin: { name: payload.name, email: payload.email } });
}
