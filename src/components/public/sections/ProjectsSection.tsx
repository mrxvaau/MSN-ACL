"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";

export function ProjectsSection({ projects }: { projects: any[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true })
  );

  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-24 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground"
            >
              Flagship Projects
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg"
            >
              Discover our most impactful and comprehensive consulting projects around the globe.
            </motion.p>
          </div>
          <Link href="/projects" className="hidden md:flex gap-2 group mt-4 md:mt-0 text-sm font-medium hover:text-primary transition-colors">
            View All Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ align: "start", loop: true }}
        >
          <CarouselContent className="-ml-4">
            {projects.map((project, index) => (
              <CarouselItem key={project.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="group h-full overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-gray-50 dark:bg-zinc-900 flex flex-col">
                    <div className="h-64 overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <Image 
                        src={project.imageUrl} 
                        alt={project.title} 
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 right-4 z-20 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold capitalize shadow-md">
                        {project.status}
                      </div>
                    </div>
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold mb-3 text-foreground line-clamp-2">{project.title}</h3>
                      {project.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 font-medium">
                          <MapPin className="w-4 h-4 text-primary" />
                          {project.location}
                        </div>
                      )}
                      <p className="text-muted-foreground line-clamp-3 mb-6 flex-grow">
                        {project.description}
                      </p>
                      <Link href={`/projects/${project.id}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-gray-200 dark:border-zinc-800 hover:bg-primary hover:text-primary-foreground h-10 px-4 py-2 w-full group/btn transition-colors mt-auto">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-2 mt-8 md:hidden">
            <CarouselPrevious className="static transform-none bg-white border-gray-200 dark:bg-zinc-900 dark:border-zinc-800" />
            <CarouselNext className="static transform-none bg-white border-gray-200 dark:bg-zinc-900 dark:border-zinc-800" />
          </div>
        </Carousel>

        <div className="mt-8 text-center md:hidden">
          <Link href="/projects" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 hover:text-primary gap-2 group transition-colors">
            View All Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
