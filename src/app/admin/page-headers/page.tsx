import { Metadata } from "next";
import PageHeadersClient from "./PageHeadersClient";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Page Headers | Admin | MSN ACL",
};

export default async function PageHeadersAdmin() {
  const data = await prisma.pageHeader.findMany({
    orderBy: { pageKey: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Page Headers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage the banner title, subtitle, and background image for public pages.
        </p>
      </div>

      <PageHeadersClient initialData={data} />
    </div>
  );
}
