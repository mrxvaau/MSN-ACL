import prisma from "@/lib/prisma";
import { PolicyList } from "@/components/public/policies/PolicyList";
import PageBanner from "@/components/public/PageBanner";

export const revalidate = 60;

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Policies",
  description: "Review our company policies, compliance standards, and operational guidelines.",
};

export default async function PoliciesPage() {
  const [policies, pageHeader] = await Promise.all([
    prisma.policy.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.pageHeader.findUnique({ where: { pageKey: "our-policies" } }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageBanner
        title={pageHeader?.title || "Our Policies"}
        subtitle={pageHeader?.subtitle || "Review our company policies, compliance standards, and operational guidelines."}
        backgroundImage={pageHeader?.backgroundImage}
      />

      <section className="py-24 bg-gray-50 dark:bg-zinc-950/50 flex-grow">
        <div className="container mx-auto px-4 md:px-6">
          <PolicyList policies={policies} />
        </div>
      </section>
    </div>
  );
}
