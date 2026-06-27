"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, Image as ImageIcon, Briefcase, BarChart, 
  FolderGit2, Users, Landmark, Newspaper, Globe, 
  UserSquare2, GraduationCap, FileText, Mail, Settings, 
  LogOut, Menu, X, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Hero Slides", href: "/admin/hero-slides", icon: ImageIcon },
  { name: "Page Headers", href: "/admin/page-headers", icon: ImageIcon },
  { name: "Services", href: "/admin/services", icon: Briefcase },
  { name: "Stats", href: "/admin/stats", icon: BarChart },
  { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Funding Agencies", href: "/admin/funding-agencies", icon: Landmark },
  { name: "News & Insights", href: "/admin/news", icon: Newspaper },
  { name: "Global Presence", href: "/admin/global-presence", icon: Globe },
  { name: "Team", href: "/admin/team", icon: UserSquare2 },
  { name: "Career", href: "/admin/career", icon: GraduationCap },
  { name: "Policies", href: "/admin/policies", icon: FileText },
  { name: "Social Links", href: "/admin/social-links", icon: Globe },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Section Visibility", href: "/admin/section-visibility", icon: LayoutDashboard },
  { name: "Security Logs", href: "/admin/security-log", icon: Shield },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <span className="text-xl font-bold text-primary">MSN ACL</span>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-zinc-800">
          <span className="text-2xl font-bold tracking-tight text-primary">MSN ACL</span>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
