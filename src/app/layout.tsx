import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "../components/ui/provider";
import { EmotionRegistry } from "../components/ui/emotion-registry";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Straffy",
  description: "Multi-Workspace SaaS Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={inter.variable}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body>
        <EmotionRegistry>
          <Provider>
            <Toaster />
            {children}
          </Provider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
