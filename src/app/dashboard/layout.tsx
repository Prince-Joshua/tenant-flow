import { requireTenant } from "@/server/data/tenant";
import { getNotificationsForUser } from "@/server/data/notifications";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, org } = await requireTenant();
  const notifications = await getNotificationsForUser({
    userId: user._id,
    orgId: org._id,
  });
  return (
    <DashboardLayout
      user={{ name: user.name, email: user.email, role: user.role }}
      activeOrg={{ name: org.name, plan: org.plan }}
      notifications={notifications}
    >
      {children}
    </DashboardLayout>
  );
}
