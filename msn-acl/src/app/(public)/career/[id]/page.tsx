import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin, Clock, Mail } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const jobs = await prisma.jobPosting.findMany({
    where: { isPublished: true },
    select: { id: true },
  });

  return jobs.map((job) => ({
    id: job.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const job = await prisma.jobPosting.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!job || !job.isPublished) {
    return { title: "Job Not Found" };
  }

  return {
    title: `${job.title} | Careers at MSN ACL`,
    description: `Join us as a ${job.title}.`,
  };
}

export default async function JobDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const job = await prisma.jobPosting.findUnique({
    where: { id: resolvedParams.id },
  });

  const siteSetting = await prisma.siteSetting.findFirst();

  if (!job || !job.isPublished) {
    notFound();
  }

  const defaultApplyEmail = siteSetting?.email || "hr@msnacl.com";
  const applyEmail = job.applyEmail || defaultApplyEmail;
  const mailtoLink = `mailto:${applyEmail}?subject=Application for ${encodeURIComponent(job.title)}`;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Header Section */}
      <section className="pt-32 pb-16 bg-zinc-900 text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Link href="/career" className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Careers
          </Link>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            {job.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-zinc-300">
            {job.department && (
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2 shrink-0" />
                {job.department}
              </div>
            )}
            {job.location && (
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 shrink-0" />
                {job.location}
              </div>
            )}
            {job.deadline && (
              <div className="flex items-center text-amber-400 font-medium">
                <Clock className="w-5 h-5 mr-2 shrink-0" />
                Deadline: {new Date(job.deadline).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Job Description</h2>
            <div 
              className="prose prose-lg dark:prose-invert max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
            
            <div className="pt-8 border-t border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-muted-foreground font-medium mb-1">Ready to join our team?</p>
                <p className="text-sm text-muted-foreground">Send your resume to <a href={`mailto:${applyEmail}`} className="text-primary hover:underline">{applyEmail}</a></p>
              </div>
              <a 
                href={mailtoLink}
                className="inline-flex items-center justify-center text-base font-semibold px-8 py-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full sm:w-auto shadow-md"
              >
                <Mail className="w-5 h-5 mr-2" />
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
