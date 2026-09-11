import AppShell from "./AppShell";
import type { SidebarUser, SidebarOrg } from "./Sidebar";

export default function DashboardLayout({
  children,
  isAdmin = false,
  user,
  activeOrg,
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
  user: SidebarUser;
  activeOrg?: SidebarOrg | null;
}) {
  return (
    <AppShell isAdmin={isAdmin} user={user} activeOrg={activeOrg}>
      {children}
    </AppShell>
  );
}
