"use client";
import { useState } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import type { SidebarUser, SidebarOrg } from "./Sidebar";

export default function AppShell({
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box display="flex" minH="100vh" bg="bg.canvas">
      {/* Backdrop — mobile only, sits above content but below the sidebar,
          tapping it closes the drawer same as the ✕ in the sidebar header. */}
      <Box
        position="fixed"
        inset="0"
        bg="blackAlpha.600"
        zIndex="150"
        display={{ base: isOpen ? "block" : "none", md: "none" }}
        onClick={() => setIsOpen(false)}
      />

      <Sidebar
        isAdmin={isAdmin}
        user={user}
        activeOrg={activeOrg}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <Box
        ml={{ base: 0, md: "260px" }}
        flex="1"
        maxW={{ base: "100vw", md: "calc(100vw - 260px)" }}
      >
        <Flex
          display={{ base: "flex", md: "none" }}
          align="center"
          gap="3"
          px="4"
          py="3"
          borderBottom="1px solid"
          borderColor="border.subtle"
          bg="bg.muted"
          position="sticky"
          top="0"
          zIndex="120"
        >
          <Button
            onClick={() => setIsOpen(true)}
            minW="9"
            h="9"
            p="0"
            bg="transparent"
            border="1px solid"
            borderColor="border.subtle"
            borderRadius="lg"
            color="text.primary"
            cursor="pointer"
            fontSize="md"
            aria-label="Open menu"
          >
            ☰
          </Button>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color="text.primary"
            truncate
          >
            {activeOrg?.name ?? "Menu"}
          </Text>
        </Flex>

        <Box p="8">
          <Box maxW="1100px" mx="auto">
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
