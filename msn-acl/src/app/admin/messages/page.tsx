import prisma from "@/lib/prisma";
import { MessagesList } from "@/components/admin/MessagesList";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
      </div>
      
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border shadow-sm">
        <MessagesList initialMessages={messages} />
      </div>
    </div>
  );
}
