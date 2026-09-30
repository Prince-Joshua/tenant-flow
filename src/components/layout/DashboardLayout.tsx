import AppShell from "./AppShell";
import type { SidebarUser, SidebarOrg } from "./Sidebar";
import type { NotificationItem } from "@/server/data/notifications";

export default function DashboardLayout({
  children,
  isAdmin = false,
  user,
  activeOrg,
  notifications = [],
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
  user: SidebarUser;
  activeOrg?: SidebarOrg | null;
  notifications?: NotificationItem[];
}) {
  return (
    <AppShell
      isAdmin={isAdmin}
      user={user}
      activeOrg={activeOrg}
      notifications={notifications}
    >
      {children}
    </AppShell>
  );
}
