import prisma from "@/lib/prisma";
import { ContactForm } from "@/components/public/contact/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import PageBanner from "@/components/public/PageBanner";

export const revalidate = 60;

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our team. We'd love to hear from you and discuss how we can help.",
};

export default async function ContactUsPage() {
  const [siteSetting, pageHeader] = await Promise.all([
    prisma.siteSetting.findFirst(),
    prisma.pageHeader.findUnique({ where: { pageKey: "contact-us" } }),
  ]);

  const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d116834.00977786433!2d90.33728812678685!3d23.78077774450379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1718820000000!5m2!1sen!2sus";
  const srcUrl = siteSetting?.mapEmbedUrl || defaultMapUrl;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <PageBanner
        title={pageHeader?.title || "Contact Us"}
        subtitle={pageHeader?.subtitle || "Get in touch with our team. We'd love to hear from you and discuss how we can help."}
        backgroundImage={pageHeader?.backgroundImage}
      />

      {/* Main Content */}
      <section className="py-20 flex-grow">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
            
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Whether you have a question about our services, projects, or anything else, our team is ready to answer all your questions.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full shrink-0 mr-4">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Our Office</h3>
                    <p className="text-muted-foreground">{siteSetting?.address || "58, Sabujbag"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full shrink-0 mr-4">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone Number</h3>
                    <a href={`tel:${siteSetting?.phone || "01751323936"}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {siteSetting?.phone || "01751323936"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full shrink-0 mr-4">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email Address</h3>
                    <a href={`mailto:${siteSetting?.email || "customercare@msnacl.com"}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {siteSetting?.email || "customercare@msnacl.com"}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full shrink-0 mr-4">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                    <p className="text-muted-foreground">Sunday - Thursday: 9:00 AM - 6:00 PM</p>
                    <p className="text-muted-foreground">Friday - Saturday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 md:p-10 shadow-xl border border-gray-100 dark:border-zinc-800">
                <h2 className="text-2xl font-bold text-foreground mb-8">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] md:h-[500px] w-full">
        <iframe 
          src={srcUrl} 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="MSN ACL Location"
          className="grayscale hover:grayscale-0 transition-all duration-700"
        />
      </section>
    </div>
  );
}
