"use client";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useRouter, usePathname } from "next/navigation";
import { PlanBadge } from "@/components/shared";
import { logoutAction } from "@/server/actions/auth";
import { HomeLink } from "../shared/HomeLink";

export interface SidebarUser {
  name: string;
  email: string;
}
export interface SidebarOrg {
  name: string;
  plan: string;
}

const navItems = [
  { icon: "⬡", label: "Overview", path: "/dashboard" },
  { icon: "✦", label: "Documents", path: "/dashboard/documents" },
  { icon: "◈", label: "Members", path: "/dashboard/members" },
  { icon: "◇", label: "Billing", path: "/dashboard/billing" },
  { icon: "○", label: "Settings", path: "/dashboard/settings" },
];
const adminItems = [
  { icon: "⬡", label: "Platform", path: "/admin" },
  { icon: "◈", label: "Organizations", path: "/admin/orgs" },
  { icon: "✦", label: "Users", path: "/admin/users" },
  { icon: "○", label: "Activity", path: "/admin/activity" },
];

export default function Sidebar({
  isAdmin = false,
  user,
  activeOrg,
}: {
  isAdmin?: boolean;
  user: SidebarUser;
  activeOrg?: SidebarOrg | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const items = isAdmin ? adminItems : navItems;

  return (
    <Box
      w="260px"
      minH="100vh"
      bg="bg.muted"
      borderRight="1px solid"
      borderColor="border.subtle"
      display="flex"
      flexDirection="column"
      position="fixed"
      left="0"
      top="0"
      bottom="0"
      zIndex="100"
    >
      <Box px="5" py="5" borderBottom="1px solid" borderColor="border.subtle">
        <HomeLink />
      </Box>
      {!isAdmin && activeOrg && (
        <Box px="4" py="3" borderBottom="1px solid" borderColor="border.subtle">
          <Flex align="center" justify="space-between">
            <Box>
              <Text
                fontSize="xs"
                color="text.muted"
                mb="0.5"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Workspace
              </Text>
              <Text fontSize="sm" fontWeight="semibold" color="text.primary">
                {activeOrg.name}
              </Text>
            </Box>
            <PlanBadge plan={activeOrg.plan} />
          </Flex>
        </Box>
      )}
      <Box flex="1" px="3" py="4" overflowY="auto">
        <Flex direction="column" gap="0.5">
          {items.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Flex
                key={item.path}
                align="center"
                gap="3"
                px="3"
                py="2.5"
                borderRadius="lg"
                cursor="pointer"
                transition="all 0.15s"
                bg={isActive ? "brand.subtle" : "transparent"}
                color={isActive ? "violet.400" : "text.secondary"}
                borderLeft="2px solid"
                borderLeftColor={isActive ? "violet.500" : "transparent"}
                _hover={{
                  bg: isActive ? "brand.subtle" : "bg.elevated",
                  color: isActive ? "violet.400" : "text.primary",
                }}
                onClick={() => router.push(item.path)}
              >
                <Text fontSize="sm">{item.icon}</Text>
                <Text
                  fontSize="sm"
                  fontWeight={isActive ? "semibold" : "medium"}
                >
                  {item.label}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      </Box>
      <Box px="4" py="4" borderTop="1px solid" borderColor="border.subtle">
        <Flex align="center" gap="3" mb="3">
          <Box
            w="8"
            h="8"
            borderRadius="full"
            bg="violet.700"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xs"
            fontWeight="bold"
            color="white"
            flexShrink={0}
          >
            {user.name?.[0]?.toUpperCase()}
          </Box>
          <Box overflow="hidden">
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="text.primary"
              truncate
            >
              {user.name}
            </Text>
            <Text fontSize="xs" color="text.muted" truncate>
              {user.email}
            </Text>
          </Box>
        </Flex>
        {/* Native form bound directly to a Server Action — no client-side
            dispatch(clearCredentials()) needed, the action clears the
            httpOnly session cookie server-side and redirects. */}
        <form action={logoutAction}>
          <Button
            type="submit"
            w="full"
            justifyContent="flex-start"
            display="flex"
            alignItems="center"
            gap="2"
            px="3"
            py="2"
            borderRadius="lg"
            fontSize="sm"
            color="text.muted"
            bg="transparent"
            border="none"
            cursor="pointer"
            fontWeight="normal"
            transition="all 0.15s"
            _hover={{ bg: "bg.elevated", color: "rose.400" }}
          >
            ↪ Sign out
          </Button>
        </form>
      </Box>
    </Box>
  );
}
