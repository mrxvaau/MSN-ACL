import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

// Check magic bytes
function checkMagicBytes(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 4) return false;
  const header = buffer.toString("hex", 0, 4).toUpperCase();
  
  switch (mime) {
    case "image/jpeg":
      return header.startsWith("FFD8FF");
    case "image/png":
      return header === "89504E47";
    case "image/gif":
      return header.startsWith("47494638"); // GIF8
    case "image/webp":
      return buffer.toString("hex", 8, 12).toUpperCase() === "57454250"; // WEBP
    case "application/pdf":
      return header === "25504446"; // %PDF
    default:
      return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = verifyToken((await cookies()).get("admin_session")?.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 5MB size limit" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES[file.type]) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, WEBP, GIF, and PDF are allowed." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!checkMagicBytes(buffer, file.type)) {
      return NextResponse.json({ error: "File content does not match MIME type." }, { status: 400 });
    }

    // Safe Filename Generation
    const ext = ALLOWED_MIME_TYPES[file.type];
    const uuid = crypto.randomUUID();
    const filename = `${uuid}.${ext}`;
    
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
