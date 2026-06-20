"use client";

import { motion } from "framer-motion";
import { TeamMember } from "@prisma/client";
import Image from "next/image";

export function TeamGrid({ members }: { members: TeamMember[] }) {
  if (!members || members.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-950 rounded-xl p-12 text-center border border-dashed border-gray-200 dark:border-zinc-800">
        <p className="text-muted-foreground text-lg">No team members to display yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {members.map((member, index) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-950"
        >
          <div className="aspect-[3/4] overflow-hidden relative">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors z-10" />
            <Image 
              src={member.photoUrl} 
              alt={member.name} 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            
            {member.bio && (
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                <p className="text-white text-sm leading-relaxed">{member.bio}</p>
              </div>
            )}
          </div>
          <div className="p-5 text-center relative z-20 bg-white dark:bg-zinc-950">
            <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
            <p className="text-primary font-medium text-sm uppercase tracking-wider">{member.designation}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
