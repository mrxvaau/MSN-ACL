// This layout overrides the parent admin/layout.tsx for the login page only.
// It renders children directly without any session check or sidebar,
// preventing redirect loops caused by the parent admin layout's session guard.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
