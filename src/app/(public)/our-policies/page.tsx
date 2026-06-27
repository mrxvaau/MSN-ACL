import prisma from "@/lib/prisma";
import { PolicyList } from "@/components/public/policies/PolicyList";
import PageBanner from "@/components/public/PageBanner";

export const dynamic = "force-dynamic";


import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Policies",
  description: "Review our company policies, compliance standards, and operational guidelines.",
};

export default async function PoliciesPage() {
  const [policies, pageHeader, policiesVisibility] = await Promise.all([
    prisma.policy.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.pageHeader.findUnique({ where: { pageKey: "our-policies" } }),
    prisma.sectionVisibility.findUnique({ where: { key: "policies" } }),
  ]);

  const showPolicies = policiesVisibility?.isVisible ?? true;

  return (
    <div className="flex flex-col min-h-screen">
      <PageBanner
        title={pageHeader?.title || "Our Policies"}
        subtitle={pageHeader?.subtitle || "Review our company policies, compliance standards, and operational guidelines."}
        backgroundImage={pageHeader?.backgroundImage}
      />

      <section className="py-24 bg-gray-50 dark:bg-zinc-950/50 flex-grow">
        <div className="container mx-auto px-4 md:px-6">
          {showPolicies ? (
            <PolicyList policies={policies} />
          ) : (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-2">Policies Currently Unavailable</h3>
              <p className="text-muted-foreground">
                Our policy documents are currently undergoing review and updates. Please check back later.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
