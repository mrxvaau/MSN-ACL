import prisma from "@/lib/prisma";
import { HeroSection } from "@/components/public/sections/HeroSection";
import { ServicesSection } from "@/components/public/sections/ServicesSection";
import { StatsSection } from "@/components/public/sections/StatsSection";
import { ProjectsSection } from "@/components/public/sections/ProjectsSection";
import { GlobalPresenceSection } from "@/components/public/sections/GlobalPresenceSection";
import { MarqueeSection } from "@/components/public/sections/MarqueeSection";
import { NewsSection } from "@/components/public/sections/NewsSection";
import { LocationSection } from "@/components/public/sections/LocationSection";

// Use dynamic rendering — DB is only available at request time (production server), not build time.
export const dynamic = "force-dynamic";


export default async function HomePage() {
  // Fetch all active content sequentially or in parallel
  const [
    heroSlides,
    services,
    stats,
    flagshipProjects,
    globalPresence,
    clients,
    fundingAgencies,
    newsPosts,
    siteSetting,
    visibilities
  ] = await Promise.all([
    prisma.heroSlide.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" }
    }),
    prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" }
    }),
    prisma.stat.findMany({
      orderBy: { order: "asc" }
    }),
    prisma.project.findMany({
      where: { isPublished: true, isFlagship: true },
      orderBy: { order: "asc" }
    }),
    prisma.globalPresence.findMany({
      orderBy: { order: "asc" }
    }),
    prisma.client.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" }
    }),
    prisma.fundingAgency.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" }
    }),
    prisma.newsPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 4
    }),
    prisma.siteSetting.findFirst(),
    prisma.sectionVisibility.findMany({
      orderBy: { order: "asc" }
    })
  ]);

  const renderSection = (key: string, isVisible: boolean) => {
    if (!isVisible) return null;
    
    switch(key) {
      case "services": return <ServicesSection key="services" services={services} />;
      case "stats": return <StatsSection key="stats" stats={stats} />;
      case "projects": return <ProjectsSection key="projects" projects={flagshipProjects} />;
      case "global-presence": return <GlobalPresenceSection key="global-presence" locations={globalPresence} />;
      case "clients": return (
        <MarqueeSection 
          key="clients"
          title="Our Clients" 
          description="Trusted by leading organizations worldwide."
          items={clients} 
          direction="left"
          speed="normal"
          bgClass="bg-white dark:bg-zinc-900"
        />
      );
      case "funding-agencies": return (
        <MarqueeSection 
          key="funding-agencies"
          title="Funding Agencies" 
          items={fundingAgencies} 
          direction="right"
          speed="slow"
          bgClass="bg-gray-50 dark:bg-zinc-950/50"
        />
      );
      case "news": return <NewsSection key="news" news={newsPosts} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection slides={heroSlides} />
      
      {visibilities.map(v => renderSection(v.key, v.isVisible))}
      
      <LocationSection mapEmbedUrl={siteSetting?.mapEmbedUrl} />
    </div>
  );
}
