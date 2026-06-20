import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin } from "lucide-react";
import { GalleryLightbox } from "@/components/public/projects/GalleryLightbox";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    select: { id: true },
  });

  return projects.map((project) => ({
    slug: project.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.slug },
  });

  if (!project || !project.isPublished) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | MSN ACL`,
    description: project.description,
    openGraph: {
      images: [project.imageUrl],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.slug },
  });

  if (!project || !project.isPublished) {
    notFound();
  }

  // Parse gallery safely
  let gallery: string[] = [];
  try {
    if (project.gallery) {
      gallery = JSON.parse(project.gallery);
    }
  } catch (e) {
    console.error("Failed to parse gallery JSON", e);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full bg-zinc-900">
        <div className="absolute inset-0">
          <Image 
            src={project.imageUrl} 
            alt={project.title} 
            fill
            priority
            className="object-cover opacity-60"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
        </div>
        
        <div className="absolute inset-0 flex items-end pb-16">
          <div className="container mx-auto px-4 md:px-6">
            <Link href="/projects" className="inline-flex items-center text-zinc-300 hover:text-white mb-6 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                {project.status}
              </span>
              {project.isFlagship && (
                <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                  Flagship
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl leading-tight">
              {project.title}
            </h1>
            
            {project.location && (
              <div className="flex items-center text-zinc-300 text-lg">
                <MapPin className="w-5 h-5 mr-2 shrink-0" />
                <span>{project.location}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {project.description && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Overview</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
              )}
              
              {project.content && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Project Details</h2>
                  <div 
                    className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-xl prose-img:shadow-md"
                    dangerouslySetInnerHTML={{ __html: project.content }}
                  />
                </div>
              )}
            </div>

            {/* Sidebar / Gallery */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {gallery.length > 0 && (
                  <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800">
                    <h3 className="text-xl font-bold mb-6 text-foreground">Project Gallery</h3>
                    <GalleryLightbox images={gallery} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
