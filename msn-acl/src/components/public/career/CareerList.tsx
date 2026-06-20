"use client";

import { motion } from "framer-motion";
import { JobPosting } from "@prisma/client";
import Link from "next/link";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";

export function CareerList({ jobs }: { jobs: JobPosting[] }) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 text-center border border-dashed border-gray-200 dark:border-zinc-800">
        <p className="text-muted-foreground text-lg">No open positions at the moment. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {jobs.map((job, index) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/career/${job.id}`} className="block group">
            <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-zinc-800 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {job.department && (
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1.5 shrink-0" />
                        {job.department}
                      </div>
                    )}
                    {job.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 shrink-0" />
                        {job.location}
                      </div>
                    )}
                    {job.deadline && (
                      <div className="flex items-center text-amber-600 dark:text-amber-500 font-medium">
                        <Clock className="w-4 h-4 mr-1.5 shrink-0" />
                        Deadline: {new Date(job.deadline).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center text-primary font-medium group-hover:underline decoration-2 underline-offset-4 shrink-0">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
                
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
