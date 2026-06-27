import prisma from "@/lib/prisma";
import { ProjectsList } from "@/components/public/projects/ProjectsList";
import PageBanner from "@/components/public/PageBanner";

export const dynamic = "force-dynamic";


import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore our portfolio of completed and ongoing projects.",
};

export default async function ProjectsPage() {
  const [projects, pageHeader] = await Promise.all([
    prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    }),
    prisma.pageHeader.findUnique({ where: { pageKey: "projects" } }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageBanner
        title={pageHeader?.title || "Our Projects"}
        subtitle={pageHeader?.subtitle || "Explore our diverse portfolio of engineering and consulting excellence across the globe."}
        backgroundImage={pageHeader?.backgroundImage}
      />

      <section className="py-24 bg-gray-50 dark:bg-zinc-950/50 flex-grow">
        <div className="container mx-auto px-4 md:px-6">
          <ProjectsList initialProjects={projects} />
        </div>
      </section>
    </div>
  );
}
