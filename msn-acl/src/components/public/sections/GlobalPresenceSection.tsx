"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function GlobalPresenceSection({ locations }: { locations: any[] }) {
  if (!locations || locations.length === 0) return null;

  // Simple approx mapping for lat/lng to percentage on a flat generic world map.
  // x = (lng + 180) * (100 / 360)
  // y = (90 - lat) * (100 / 180) 
  // Adjusted slightly for standard Robinson/Mercator svg bounding boxes
  const getCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <section className="py-24 bg-gray-50 dark:bg-zinc-950 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground"
          >
            Global Presence
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Our footprint extends across borders, delivering excellence worldwide.
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto mt-12 mb-8">
          {/* A generic dotted world map SVG placeholder */}
          <div className="w-full aspect-[2/1] bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-contain bg-center bg-no-repeat opacity-20 dark:opacity-40" />
          
          <TooltipProvider>
            {locations.map((loc, index) => {
              const pos = getCoordinates(loc.lat, loc.lng);
              return (
                <Tooltip key={loc.id}>
                  <TooltipTrigger>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (index * 0.1), type: "spring", stiffness: 200 }}
                      className="absolute w-6 h-6 -ml-3 -mt-6 cursor-pointer flex flex-col items-center group"
                      style={{ left: pos.left, top: pos.top }}
                    >
                      <MapPin className="w-6 h-6 text-primary drop-shadow-md group-hover:scale-125 transition-transform" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-ping absolute bottom-0" />
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-zinc-900 text-white border-zinc-800 shadow-xl font-medium px-4 py-2">
                    <p className="text-base">{loc.country}</p>
                    {loc.note && <p className="text-xs text-zinc-400 mt-1 max-w-[200px] break-words">{loc.note}</p>}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>

        {/* Mobile Fallback List */}
        <div className="md:hidden grid grid-cols-2 gap-4 mt-8">
          {locations.map((loc) => (
            <div key={loc.id} className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="font-medium text-sm text-foreground">{loc.country}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
