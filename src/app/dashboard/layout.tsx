import { requireTenant } from "@/server/data/tenant";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, org } = await requireTenant();
  return (
    <DashboardLayout
      user={{ name: user.name, email: user.email }}
      activeOrg={{ name: org.name, plan: org.plan }}
    >
      {children}
    </DashboardLayout>
  );
}
