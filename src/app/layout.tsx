import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

import prisma from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  let siteSetting = null;
  try {
    siteSetting = await prisma.siteSetting.findFirst();
  } catch (e) {
    // ignore
  }

  return {
    title: {
      template: "%s | " + (siteSetting?.companyName || "MSN ACL"),
      default: siteSetting?.companyName || "MSN ACL - Corporate Website",
    },
    description: siteSetting?.footerText || "Multidisciplinary corporate and consulting services.",
    icons: siteSetting?.faviconUrl ? { icon: siteSetting.faviconUrl } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
