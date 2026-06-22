"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MarqueeItem {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string | null;
}

interface MarqueeSectionProps {
  title: string;
  description?: string;
  items: MarqueeItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  bgClass?: string;
}

export function MarqueeSection({ 
  title, 
  description, 
  items, 
  direction = "left",
  speed = "normal",
  bgClass = "bg-white dark:bg-zinc-900"
}: MarqueeSectionProps) {
  if (!items || items.length === 0) return null;

  const speedClass = 
    speed === "fast" ? "duration-[20s]" : 
    speed === "slow" ? "duration-[60s]" : 
    "duration-[40s]";

  return (
    <section className={cn("py-20 overflow-hidden", bgClass)}>
      <div className="container mx-auto px-4 md:px-6 mb-12 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold tracking-tight text-foreground"
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-3 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Marquee Container */}
      <div className="relative flex overflow-x-hidden group">
        <div 
          className={cn(
            "animate-marquee flex items-center gap-12 whitespace-nowrap py-4",
            direction === "right" && "animate-marquee-reverse",
            speedClass,
            // Pause on hover
            "group-hover:[animation-play-state:paused]"
          )}
        >
          {/* Render array twice for seamless loop */}
          {[...items, ...items, ...items].map((item, index) => (
            <div 
              key={`${item.id}-${index}`}
              className="flex-shrink-0 w-32 md:w-48 grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300 opacity-70 hover:opacity-100"
            >
              {item.websiteUrl ? (
                <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-20 relative">
                  <Image src={item.logoUrl} alt={item.name} fill className="object-contain" sizes="120px" />
                </a>
              ) : (
                <div className="w-full h-20 relative">
                  <Image src={item.logoUrl} alt={item.name} fill className="object-contain" sizes="120px" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Duplicate absolutely positioned for seamless looping */}
        <div 
          className={cn(
            "absolute top-0 animate-marquee2 flex items-center gap-12 whitespace-nowrap py-4",
            direction === "right" && "animate-marquee2-reverse",
            speedClass,
            "group-hover:[animation-play-state:paused]"
          )}
        >
          {[...items, ...items, ...items].map((item, index) => (
            <div 
              key={`${item.id}-duplicate-${index}`}
              className="flex-shrink-0 w-32 md:w-48 grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300 opacity-70 hover:opacity-100"
            >
              {item.websiteUrl ? (
                <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-20 relative">
                  <Image src={item.logoUrl} alt={item.name} fill className="object-contain" sizes="120px" />
                </a>
              ) : (
                <div className="w-full h-20 relative">
                  <Image src={item.logoUrl} alt={item.name} fill className="object-contain" sizes="120px" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
