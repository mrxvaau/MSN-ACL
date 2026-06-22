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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection({ slides }: { slides: any[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-zinc-950">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="h-screen w-full relative">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
                style={{ backgroundImage: `url(${slide.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-black/50" />
              </div>
              
              <div className="relative h-full container mx-auto px-4 md:px-6 flex flex-col justify-center items-start text-white pt-20">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="max-w-3xl"
                >
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="text-lg md:text-xl lg:text-2xl text-zinc-300 mb-8 max-w-2xl">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.ctaLink && slide.ctaText && (
                    <Link href={slide.ctaLink} className="inline-flex items-center justify-center text-base font-semibold px-8 py-4 rounded-full hover:scale-105 transition-transform bg-primary text-primary-foreground hover:bg-primary/90">
                      {slide.ctaText}
                    </Link>
                  )}
                </motion.div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-8 bg-black/20 text-white border-none hover:bg-black/40 hover:text-white" />
          <CarouselNext className="right-8 bg-black/20 text-white border-none hover:bg-black/40 hover:text-white" />
        </div>
      </Carousel>
    </section>
  );
}
