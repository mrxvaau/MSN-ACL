import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function SecurityLogPage() {
  const logs = await prisma.adminLoginLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 100, // Limit to 100 recent logs to prevent overwhelming the UI
  });

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Security Logs</h1>
      </div>
      
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-zinc-900 border-b">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Email Attempted</th>
              <th className="px-4 py-3">IP Address</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-muted-foreground">
                  No login attempts recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {dateFormatter.format(new Date(log.timestamp))}
                  </td>
                  <td className="px-4 py-3 font-medium">{log.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{log.ipAddress}</td>
                  <td className="px-4 py-3">
                    {log.success ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Failed
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
