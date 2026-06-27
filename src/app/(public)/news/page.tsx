import prisma from "@/lib/prisma";
import { NewsList } from "@/components/public/news/NewsList";
import PageBanner from "@/components/public/PageBanner";

export const dynamic = "force-dynamic";


import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Insights",
  description: "Stay updated with our latest industry insights, company news, and expert perspectives.",
};

export default async function NewsPage() {
  const [news, pageHeader] = await Promise.all([
    prisma.newsPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.pageHeader.findUnique({ where: { pageKey: "news" } }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageBanner
        title={pageHeader?.title || "News & Insights"}
        subtitle={pageHeader?.subtitle || "Stay updated with our latest industry insights, company news, and expert perspectives."}
        backgroundImage={pageHeader?.backgroundImage}
      />

      <section className="py-24 bg-gray-50 dark:bg-zinc-950/50 flex-grow">
        <div className="container mx-auto px-4 md:px-6">
          <NewsList initialNews={news} />
        </div>
      </section>
    </div>
  );
}
