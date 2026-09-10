import { Box } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
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
    <Box display="flex" minH="100vh" bg="bg.canvas">
      <Sidebar isAdmin={isAdmin} user={user} activeOrg={activeOrg} />
      <Box ml="260px" flex="1" p="8" maxW="calc(100vw - 260px)">
        <Box maxW="1100px" mx="auto">
          {children}
        </Box>
      </Box>
    </Box>
  );
}
