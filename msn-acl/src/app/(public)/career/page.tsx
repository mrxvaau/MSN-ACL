import prisma from "@/lib/prisma";
import { CareerList } from "@/components/public/career/CareerList";
import PageBanner from "@/components/public/PageBanner";

export const revalidate = 60;

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career",
  description: "Join our team. Explore exciting opportunities and help shape the future.",
};

export default async function CareerPage() {
  const [jobs, pageHeader] = await Promise.all([
    prisma.jobPosting.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.pageHeader.findUnique({ where: { pageKey: "career" } }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageBanner
        title={pageHeader?.title || "Join Our Team"}
        subtitle={pageHeader?.subtitle || "Build your career with us. Explore exciting opportunities and help shape the future."}
        backgroundImage={pageHeader?.backgroundImage}
      />

      <section className="py-24 bg-gray-50 dark:bg-zinc-950/50 flex-grow">
        <div className="container mx-auto px-4 md:px-6">
          <CareerList jobs={jobs} />
        </div>
      </section>
    </div>
  );
}
