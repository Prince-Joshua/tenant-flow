import { requireSuperAdmin } from "@/server/data/tenant";
import { getNotificationsForUser } from "@/server/data/notifications";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSuperAdmin();
  const notifications = await getNotificationsForUser({ userId: user._id });
  return (
    <DashboardLayout
      isAdmin
      user={{ name: user.name, email: user.email }}
      notifications={notifications}
    >
      {children}
    </DashboardLayout>
  );
}
