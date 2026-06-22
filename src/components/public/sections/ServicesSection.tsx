"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export function ServicesSection({ services }: { services: any[] }) {
  if (!services || services.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50 dark:bg-zinc-950/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground"
          >
            Our Expertise & Services
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Comprehensive solutions tailored to empower your business across multidisciplinary sectors.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group h-full overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-zinc-900">
                {service.imageUrl && (
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                    <Image 
                      src={service.imageUrl} 
                      alt={service.title} 
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <CardContent className="p-8 relative">
                  {service.iconUrl && (
                    <div className="absolute -top-10 right-8 bg-white dark:bg-zinc-900 p-3 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-800">
                      <div className="relative w-10 h-10">
                        <Image src={service.iconUrl} alt="icon" fill className="object-contain" sizes="40px" />
                      </div>
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-3 mt-2 group-hover:text-primary transition-colors text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
