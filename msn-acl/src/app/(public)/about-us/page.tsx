import prisma from "@/lib/prisma";
import { TeamMember } from "@prisma/client";
import { motion } from "framer-motion";
import { TeamGrid } from "@/components/public/about/TeamGrid";
import PageBanner from "@/components/public/PageBanner";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Discover our story, our mission, and the brilliant minds driving innovation.",
};

export const revalidate = 60;

export default async function AboutUsPage() {
  const [siteSetting, teamMembers, pageHeader] = await Promise.all([
    prisma.siteSetting.findFirst(),
    prisma.teamMember.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    }),
    prisma.pageHeader.findUnique({ where: { pageKey: "about-us" } }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageBanner
        title={pageHeader?.title || `About ${siteSetting?.companyName || "Us"}`}
        subtitle={pageHeader?.subtitle || "Discover our story, our mission, and the brilliant minds driving innovation."}
        backgroundImage={pageHeader?.backgroundImage}
      />

      {/* Story & Mission Section */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Story & Mission</h2>
            <div className="text-lg text-muted-foreground leading-relaxed space-y-6 text-left">
              <p>
                Founded with a vision to revolutionize the consulting and engineering industry, {siteSetting?.companyName || "MSN ACL"} has grown into a premier partner for organizations worldwide. We believe in delivering exceptional quality, fostering sustainable practices, and creating value that stands the test of time.
              </p>
              <p>
                Our mission is to empower our clients through innovative solutions, strategic insights, and unparalleled expertise. We are committed to integrity, excellence, and a collaborative approach that ensures every project not only meets but exceeds expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gray-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground text-lg">
              The experts and visionaries behind our success.
            </p>
          </div>
          
          <TeamGrid members={teamMembers} />
        </div>
      </section>
    </div>
  );
}
