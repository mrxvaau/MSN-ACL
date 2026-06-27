import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, FolderGit2, Newspaper, Briefcase, Image as ImageIcon, Users, MailWarning } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  // Fetch real counts from DB
  const [
    unreadMessagesCount,
    messagesCount,
    projectsCount,
    newsCount,
    servicesCount,
    slidesCount,
    clientsCount
  ] = await Promise.all([
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.contactMessage.count(),
    prisma.project.count(),
    prisma.newsPost.count(),
    prisma.service.count(),
    prisma.heroSlide.count(),
    prisma.client.count(),
  ]);

  const stats = [
    { title: "Unread Messages", value: unreadMessagesCount, icon: MailWarning, href: "/admin/messages", color: "text-red-500", highlight: unreadMessagesCount > 0 },
    { title: "Total Messages", value: messagesCount, icon: Mail, href: "/admin/messages", color: "text-blue-500", highlight: false },
    { title: "Total Projects", value: projectsCount, icon: FolderGit2, href: "/admin/projects", color: "text-emerald-500", highlight: false },
    { title: "News Posts", value: newsCount, icon: Newspaper, href: "/admin/news", color: "text-amber-500", highlight: false },
    { title: "Services", value: servicesCount, icon: Briefcase, href: "/admin/services", color: "text-purple-500", highlight: false },
    { title: "Clients", value: clientsCount, icon: Users, href: "/admin/clients", color: "text-indigo-500", highlight: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, <span className="font-semibold text-primary">{session?.user?.name || "Admin"}</span>! Here is an overview of your site.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Link href={stat.href} key={index} className="block group">
            <Card className={`h-full hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-zinc-800 ${stat.highlight ? 'border-red-500 dark:border-red-500 shadow-sm shadow-red-500/20 bg-red-50/50 dark:bg-red-950/10' : 'group-hover:border-primary/50'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${stat.highlight ? 'text-red-700 dark:text-red-400' : 'group-hover:text-primary transition-colors'}`}>
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.highlight ? 'text-red-600 dark:text-red-500' : ''}`}>{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
