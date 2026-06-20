"use client";

import { useState } from "react";
import { Project } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "all", label: "All Projects" },
  { id: "completed", label: "Completed" },
  { id: "ongoing", label: "Ongoing" },
  { id: "abroad", label: "Abroad" },
];

export function ProjectsList({ initialProjects }: { initialProjects: Project[] }) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProjects = activeTab === "all" 
    ? initialProjects 
    : initialProjects.filter(p => p.status.toLowerCase() === activeTab);

  if (!initialProjects || initialProjects.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 text-center border border-dashed border-gray-200 dark:border-zinc-800">
        <p className="text-muted-foreground text-lg">No projects published yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-white dark:bg-zinc-900 text-muted-foreground hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Empty State for Filter */}
      {filteredProjects.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-20"
        >
          <p className="text-muted-foreground text-lg">No projects found in this category.</p>
        </motion.div>
      )}

      {/* Projects Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group h-full overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-900 flex flex-col">
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                      {project.status}
                    </span>
                  </div>
                  <Image 
                    src={project.imageUrl} 
                    alt={project.title} 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-3 text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  {project.location && (
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 mr-1 shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>
                  )}
                  
                  <p className="text-muted-foreground line-clamp-3 mb-6 flex-grow">
                    {project.description}
                  </p>
                  
                  <Link href={`/projects/${project.id}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-gray-200 dark:border-zinc-800 hover:bg-primary hover:text-primary-foreground h-10 px-4 py-2 w-full group/btn transition-colors mt-auto">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
