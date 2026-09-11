"use client";
import { Suspense, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import type { SidebarUser, SidebarOrg } from "./Sidebar";

function AnimatedPage({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const routeKey = pathname;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

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
            <Suspense fallback={children}>
              <AnimatedPage>{children}</AnimatedPage>
            </Suspense>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
