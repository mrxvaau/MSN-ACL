import { cookies, headers } from "next/headers";
import { verifyToken } from "@/lib/session";
import AdminLayoutClient from "./AdminLayoutClient";
import ActivityPing from "@/components/admin/ActivityPing";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Read the request pathname to detect the login page.
  // Middleware already sets x-pathname header on every request.
  const heads = await headers();
  const pathname = heads.get("x-invoke-path") || heads.get("x-pathname") || "";

  const isLoginPage = pathname === "/admin/login" || pathname.startsWith("/admin/login");

  // On login page: just render the page, no sidebar, no auth check.
  if (isLoginPage) {
    return <>{children}</>;
  }

  // On all other admin pages: render with sidebar shell.
  // Middleware already blocks unauthenticated access.
  // API routes verify the token for all mutations.
  return (
    <AdminLayoutClient>
      <ActivityPing />
      {children}
    </AdminLayoutClient>
  );
}
