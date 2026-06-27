import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { SectionVisibilityList } from "@/components/admin/SectionVisibilityList";

export const dynamic = "force-dynamic";

export default async function SectionVisibilityPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const sections = await prisma.sectionVisibility.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Section Visibility</h1>
        <p className="text-muted-foreground">
          Toggle and reorder the sections that appear on the public website. 
          <br/>
          <span className="font-medium text-amber-600 dark:text-amber-500">
            Note: The Hero banner and Location map on the homepage are always shown at the top and bottom respectively.
          </span>
        </p>
      </div>
      
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border shadow-sm">
        {sections.length > 0 ? (
          <SectionVisibilityList initialItems={sections} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No sections found. Please ensure the database is seeded.
          </div>
        )}
      </div>
    </div>
  );
}
