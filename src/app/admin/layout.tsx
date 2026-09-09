import { requireSuperAdmin } from '@/server/data/tenant';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSuperAdmin();
  return (
    <DashboardLayout isAdmin user={{ name: user.name, email: user.email }}>
      {children}
    </DashboardLayout>
  );
}
