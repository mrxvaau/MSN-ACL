import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

// NOTE: The /admin/login route has its own layout.tsx that overrides this one,
// so this session check will never run on the login page — no redirect loop.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Backup server-side guard. Middleware is the primary layer.
  // If middleware ever fails (misconfigured env, cold start, etc.), this catches it.
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
