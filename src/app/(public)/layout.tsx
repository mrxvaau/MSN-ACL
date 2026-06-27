import prisma from "@/lib/prisma";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";

export const dynamic = "force-dynamic";


export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const siteSetting = await prisma.siteSetting.findFirst();

  return (
    <div className="flex flex-col min-h-screen">
      <Header settings={siteSetting} />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer settings={siteSetting} />
    </div>
  );
}
