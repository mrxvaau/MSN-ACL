import prisma from "@/lib/prisma";
import { CareerList } from "@/components/public/career/CareerList";
import PageBanner from "@/components/public/PageBanner";

// Use dynamic rendering — DB is only available at request time (production server), not build time.
export const dynamic = "force-dynamic";


import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career",
  description: "Join our team. Explore exciting opportunities and help shape the future.",
};

export default async function CareerPage() {
  const [jobs, pageHeader, careerVisibility] = await Promise.all([
    prisma.jobPosting.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.pageHeader.findUnique({ where: { pageKey: "career" } }),
    prisma.sectionVisibility.findUnique({ where: { key: "career" } }),
  ]);

  const showCareer = careerVisibility?.isVisible ?? true;

  return (
    <div className="flex flex-col min-h-screen">
      <PageBanner
        title={pageHeader?.title || "Join Our Team"}
        subtitle={pageHeader?.subtitle || "Build your career with us. Explore exciting opportunities and help shape the future."}
        backgroundImage={pageHeader?.backgroundImage}
      />

      <section className="py-24 bg-gray-50 dark:bg-zinc-950/50 flex-grow">
        <div className="container mx-auto px-4 md:px-6">
          {showCareer ? (
            <CareerList jobs={jobs} />
          ) : (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-2">Currently No Open Positions</h3>
              <p className="text-muted-foreground">
                We are not actively hiring at the moment. Please check back later or follow our social media channels for future opportunities.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
