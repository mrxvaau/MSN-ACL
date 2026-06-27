import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/session";
import AdminLayoutClient from "./AdminLayoutClient";
import ActivityPing from "@/components/admin/ActivityPing";

// NOTE: The /admin/login route has its own layout.tsx that overrides this one,
// so this session check will never run on the login page — no redirect loop.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const session = verifyToken(token);

  // Full verification: signature + expiry. Backup to middleware cookie-presence check.
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminLayoutClient>
      <ActivityPing />
      {children}
    </AdminLayoutClient>
  );
}
