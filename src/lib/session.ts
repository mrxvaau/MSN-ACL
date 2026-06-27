import crypto from "crypto";

export const SESSION_DURATION = 20 * 60 * 1000; // 20 minutes in ms
export const COOKIE_NAME = "admin_session";

export interface SessionPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  exp: number;
}

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET env var is not set");
  return secret;
}

export function signToken(payload: Omit<SessionPayload, "exp">): string {
  const fullPayload: SessionPayload = {
    ...payload,
    exp: Date.now() + SESSION_DURATION,
  };
  const data = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

export function verifyToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  try {
    const dotIndex = token.lastIndexOf(".");
    if (dotIndex === -1) return null;
    const data = token.slice(0, dotIndex);
    const sig = token.slice(dotIndex + 1);
    const expectedSig = crypto
      .createHmac("sha256", getSecret())
      .update(data)
      .digest("base64url");
    // Constant-time comparison
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;
    const payload: SessionPayload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf8")
    );
    if (payload.exp < Date.now()) return null; // expired
    return payload;
  } catch {
    return null;
  }
}
