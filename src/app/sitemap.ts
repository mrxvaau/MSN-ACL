import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

// Force dynamic so this runs at request time, not at build time.
// Without this, Next.js tries to pre-render it during 'next build',
// which fails if the database isn't accessible in the build environment.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://msnacl.com";

  // Static routes
  const staticRoutes = [
    "",
    "/about-us",
    "/projects",
    "/career",
    "/news",
    "/our-policies",
    "/contact-us",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    // Dynamic Projects
    const projects = await prisma.project.findMany({
      where: { isPublished: true },
      select: { id: true, createdAt: true },
    });

    const projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.id}`,
      lastModified: project.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Dynamic News
    const news = await prisma.newsPost.findMany({
      where: { isPublished: true },
      select: { slug: true, publishedAt: true },
    });

    const newsRoutes = news.map((post) => ({
      url: `${baseUrl}/news/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Dynamic Careers
    const careers = await prisma.jobPosting.findMany({
      where: { isPublished: true },
      select: { id: true, createdAt: true },
    });

    const careerRoutes = careers.map((job) => ({
      url: `${baseUrl}/career/${job.id}`,
      lastModified: job.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...projectRoutes, ...newsRoutes, ...careerRoutes];
  } catch {
    // If DB is unreachable, return only static routes
    return staticRoutes;
  }
}
