"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NewsPost } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ITEMS_PER_PAGE = 9;

export function NewsList({ initialNews }: { initialNews: NewsPost[] }) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  if (!initialNews || initialNews.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 text-center border border-dashed border-gray-200 dark:border-zinc-800">
        <p className="text-muted-foreground text-lg">No news published yet. Check back soon!</p>
      </div>
    );
  }

  const visibleNews = initialNews.slice(0, visibleCount);
  const hasMore = visibleCount < initialNews.length;

  return (
    <div>
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {visibleNews.map((post, index) => (
            <motion.div
              layout
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: (index % ITEMS_PER_PAGE) * 0.1 }}
            >
              <Card className="group h-full overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-900 flex flex-col">
                <div className="h-56 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                  <Image 
                    src={post.coverImage} 
                    alt={post.title} 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-medium">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    <Link href={`/news/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 mb-6 flex-grow">
                    {post.excerpt}
                  </p>
                  <Link href={`/news/${post.slug}`} className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors mt-auto group/link">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {hasMore && (
        <div className="mt-12 text-center">
          <button 
            onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-gray-200 dark:border-zinc-800 hover:bg-primary hover:text-primary-foreground h-10 px-6 py-2 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
