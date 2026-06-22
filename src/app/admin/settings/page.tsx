import { SettingsForm } from "@/components/admin/SettingsForm";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await prisma.siteSetting.findFirst();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
      </div>
      
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border shadow-sm">
        <SettingsForm initialData={settings || undefined} />
      </div>
    </div>
  );
}
