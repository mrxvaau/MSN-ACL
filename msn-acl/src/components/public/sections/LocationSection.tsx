"use client";

import { motion } from "framer-motion";

export function LocationSection({ mapEmbedUrl }: { mapEmbedUrl?: string | null }) {
  // Fallback to a default Dhaka map if none provided
  const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d116834.00977786433!2d90.33728812678685!3d23.78077774450379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1718820000000!5m2!1sen!2sus";
  
  const srcUrl = mapEmbedUrl || defaultMapUrl;

  return (
    <section className="py-24 bg-gray-50 dark:bg-zinc-950/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground"
          >
            Our Location
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Visit our headquarters and experience our operations firsthand.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-zinc-800"
        >
          <iframe 
            src={srcUrl} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="MSN ACL Location"
          />
        </motion.div>
      </div>
    </section>
  );
}
