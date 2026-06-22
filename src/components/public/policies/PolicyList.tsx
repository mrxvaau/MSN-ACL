"use client";

import { motion } from "framer-motion";
import { Policy } from "@prisma/client";
import { FileText, Download } from "lucide-react";

export function PolicyList({ policies }: { policies: Policy[] }) {
  if (!policies || policies.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 text-center border border-dashed border-gray-200 dark:border-zinc-800">
        <p className="text-muted-foreground text-lg">No policies available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {policies.map((policy, index) => (
        <motion.div
          key={policy.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-zinc-800 transition-all duration-300 h-full flex flex-col">
            <div className="flex items-start gap-4 mb-6 flex-grow">
              <div className="bg-primary/10 text-primary p-3 rounded-lg shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground leading-tight">
                {policy.title}
              </h3>
            </div>
            
            <a 
              href={policy.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-gray-200 dark:border-zinc-800 hover:bg-primary hover:text-primary-foreground hover:border-primary h-10 px-4 py-2 w-full transition-colors group"
            >
              <Download className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
              Download / View PDF
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
