import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const news = await prisma.newsPost.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });

  return news.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await prisma.newsPost.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!post || !post.isPublished) {
    return { title: "News Not Found" };
  }

  return {
    title: `${post.title} | News & Insights | MSN ACL`,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const post = await prisma.newsPost.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Cover */}
      <section className="relative h-[50vh] min-h-[400px] w-full bg-zinc-900">
        <div className="absolute inset-0">
          <Image 
            src={post.coverImage} 
            alt={post.title} 
            fill
            priority
            className="object-cover opacity-50"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
        </div>
        
        <div className="absolute inset-0 flex items-end pb-16">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <Link href="/news" className="inline-flex items-center text-zinc-300 hover:text-white mb-6 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center text-zinc-300 text-sm font-medium">
              <Calendar className="w-4 h-4 mr-2 shrink-0" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 flex-grow">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {post.excerpt && (
            <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed mb-12 pb-12 border-b border-gray-200 dark:border-zinc-800">
              {post.excerpt}
            </p>
          )}
          
          <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />
        </div>
      </section>
    </div>
  );
}
