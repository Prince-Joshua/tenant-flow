import type { Metadata } from "next";
import { Provider } from "../components/ui/provider";
import { EmotionRegistry } from "../components/ui/emotion-registry";

export const metadata: Metadata = {
  title: "TenantFlow",
  description: "Multi-Tenant SaaS Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <EmotionRegistry>
          <Provider>{children}</Provider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
