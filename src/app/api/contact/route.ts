import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const recentSubmissions = await prisma.contactSubmissionLog.count({
      where: {
        ipAddress,
        timestamp: { gte: tenMinutesAgo },
      },
    });

    if (recentSubmissions >= 3) {
      return NextResponse.json(
        { success: false, error: "Too many submissions, please try again later" },
        { status: 429 }
      );
    }

    await prisma.contactSubmissionLog.create({
      data: { ipAddress },
    });

    const message = await prisma.contactMessage.create({
      data: validatedData,
    });

    // Send email via nodemailer
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_RECEIVER_EMAIL } = process.env;
    
    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && CONTACT_RECEIVER_EMAIL) {
      try {
        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: parseInt(SMTP_PORT),
          secure: parseInt(SMTP_PORT) === 465, // true for 465, false for other ports
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"MSN ACL Website" <${SMTP_USER}>`,
          to: CONTACT_RECEIVER_EMAIL,
          subject: `New Contact Message: ${message.subject || 'No Subject'}`,
          html: `
            <h3>New Contact Message</h3>
            <p><strong>Name:</strong> ${message.name}</p>
            <p><strong>Email:</strong> ${message.email}</p>
            <p><strong>Phone:</strong> ${message.phone || 'N/A'}</p>
            <p><strong>Subject:</strong> ${message.subject || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <p>${message.message}</p>
          `,
        });
        console.log("Contact email sent successfully to", CONTACT_RECEIVER_EMAIL);
      } catch (emailError) {
        console.error("Failed to send contact email:", emailError);
        // Do not crash, continue to return success
      }
    } else {
      console.log("SMTP credentials not fully configured. Skipping email send. Message saved to DB.");
    }

    return NextResponse.json(
      { success: true, data: message },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating contact message:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
