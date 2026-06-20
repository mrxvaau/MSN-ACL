import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="pt-32 pb-20 bg-zinc-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-zinc-950/80 z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Projects</h1>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            Explore our portfolio of completed and ongoing projects.
          </p>
        </div>
      </section>

      <section className="py-24 bg-gray-50 dark:bg-zinc-950/50 flex-grow">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm border border-gray-100 dark:border-zinc-800">
                <Skeleton className="h-64 w-full rounded-none" />
                <div className="p-6 flex flex-col gap-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-10 w-full mt-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
