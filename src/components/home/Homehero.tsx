"use client";

import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  LuFileText,
  LuSend,
  LuUsers,
  LuCreditCard,
  LuSettings,
} from "react-icons/lu";
import { ChakraLink } from "@/components/shared/ChakraLink";
import { Float, Reveal } from "./Reveal";
import { MotionBox } from "../shared/MotionBox";

const trustedBy = [
  "Northwind Legal",
  "Fieldstone Property Group",
  "Anchor & Vale",
  "Loop Systems",
  "Vertex Collective",
  "Harborline Consulting",
];

const sidebarItems = [
  { icon: LuFileText, label: "Documents", active: true },
  { icon: LuUsers, label: "Members", active: false },
  { icon: LuCreditCard, label: "Billing", active: false },
  { icon: LuSettings, label: "Settings", active: false },
];

export function HomeHero() {
  return (
    <Box position="relative" overflow="hidden">
      {/* Animated gradient backdrop */}
      <Box position="absolute" inset="0" zIndex="0" pointerEvents="none">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-10%",
            left: "10%",
            width: "480px",
            height: "480px",
            borderRadius: "999px",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.28) 0%, rgba(139,92,246,0) 70%)",
            filter: "blur(10px)",
          }}
        />
        <motion.div
          animate={{
            x: [0, -30, 25, 0],
            y: [0, 25, -15, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "5%",
            right: "5%",
            width: "420px",
            height: "420px",
            borderRadius: "999px",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.18) 0%, rgba(56,189,248,0) 70%)",
            filter: "blur(10px)",
          }}
        />
      </Box>

      <Flex
        w={"full"}
        direction="column"
        align="center"
        justify="center"
      
        textAlign="center"
        px="5"
        pt={{ base: "16", md: "24" }}
        pb={{ base: "10", md: "14" }}
        position="relative"
        zIndex="1"
      >
        <Reveal y={14} duration={0.5}>
          <Text
            maxW={"fit-content"}
            fontSize="xs"
            fontWeight="semibold"
            color="violet.400"
            bg="brand.subtle"
            border="1px solid"
            borderColor="brand.border"
            borderRadius="full"
            px="3"
            py="1"
            mb="6"
            letterSpacing="wide"
            textTransform="uppercase"
          >
            Multi-Agent SaaS platform
          </Text>
        </Reveal>

        <Reveal y={18} duration={0.6} delay={0.08}>
          <Text
            as="h1"
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="bold"
            color="text.primary"
            letterSpacing="tight"
            maxW="760px"
            lineHeight="1.15"
            mb="5"
          >
            One workspace for every organization you run
          </Text>
        </Reveal>

        <Reveal y={18} duration={0.6} delay={0.16}>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="text.secondary"
            maxW="600px"
            mb="8"
          >
            TenantFlow gives every team its own isolated tenant — role-based
            access, an AI writing assistant for contracts and reports, and
            subscription billing that's ready from day one.
          </Text>
        </Reveal>

        <Reveal y={16} duration={0.6} delay={0.24}>
          <Flex gap="3" mb="14" wrap="wrap" justify="center">
            <MotionBox
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChakraLink
                href="/register"
                fontSize="sm"
                fontWeight="semibold"
                color="white"
                bg="violet.600"
                borderRadius="lg"
                px="6"
                py="3"
                display="inline-block"
                style={{ boxShadow: "0 0 0 rgba(139,92,246,0)" }}
                _hover={{ bg: "violet.500" }}
              >
                Create your workspace
              </ChakraLink>
            </MotionBox>
            <MotionBox
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChakraLink
                href="/login"
                fontSize="sm"
                fontWeight="semibold"
                color="text.secondary"
                border="1px solid"
                borderColor="border.default"
                borderRadius="lg"
                px="6"
                py="3"
                display="inline-block"
                _hover={{ bg: "bg.elevated" }}
              >
                Sign in
              </ChakraLink>
            </MotionBox>
          </Flex>
        </Reveal>

        <Reveal y={10} duration={0.6} delay={0.3}>
          <Text
            fontSize="xs"
            fontWeight="medium"
            color="text.muted"
            textTransform="uppercase"
            letterSpacing="wide"
            mb="5"
          >
            Trusted by teams running lean, multi-org operations
          </Text>
        </Reveal>

        {/* Infinite logo marquee */}
        <Box
          w="100%"
          maxW="880px"
          overflow="hidden"
          mb={{ base: "14", md: "20" }}
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <motion.div
            style={{ display: "flex", gap: "48px", width: "max-content" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          >
            {[...trustedBy, ...trustedBy].map((name, i) => (
              <Text
                key={`${name}-${i}`}
                fontSize="sm"
                fontWeight="semibold"
                color="text.muted"
                whiteSpace="nowrap"
              >
                {name}
              </Text>
            ))}
          </motion.div>
        </Box>

        {/* Product preview mockup */}
        <Reveal y={30} duration={0.8} delay={0.1} width="100%">
          <Box display="flex" justifyContent="center">
            <Float range={8} duration={6}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                w={{ base: "100%", md: "880px" }}
                bg="bg.surface"
                border="1px solid"
                borderColor="border.subtle"
                borderRadius="2xl"
                overflow="hidden"
                style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)" }}
              >
                {/* Window chrome */}
                <Flex
                  align="center"
                  gap="1.5"
                  px="4"
                  py="3"
                  borderBottom="1px solid"
                  borderColor="border.subtle"
                >
                  <Box w="2.5" h="2.5" borderRadius="full" bg="rose.500" />
                  <Box w="2.5" h="2.5" borderRadius="full" bg="amber.500" />
                  <Box w="2.5" h="2.5" borderRadius="full" bg="emerald.500" />
                  <Text fontSize="xs" color="text.muted" ml="3">
                    app.tenantflow.io/acme-co/documents
                  </Text>
                </Flex>

                <Grid
                  templateColumns={{ base: "1fr", md: "200px 1fr" }}
                  minH="320px"
                >
                  {/* Mini sidebar */}
                  <MotionBox
                    borderRight={{ base: "none", md: "1px solid" }}
                    borderBottom={{ base: "1px solid", md: "none" }}
                    borderColor="border.subtle"
                    p="4"
                    display={{ base: "none", md: "block" }}
                  >
                    <Flex align="center" gap="2" mb="6">
                      <Box
                        w="6"
                        h="6"
                        bg="violet.600"
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="xs"
                        fontWeight="bold"
                        color="white"
                      >
                        T
                      </Box>
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color="text.primary"
                      >
                        Acme Co
                      </Text>
                    </Flex>
                    <Flex direction="column" gap="1">
                      {sidebarItems.map((item) => (
                        <Flex
                          key={item.label}
                          align="center"
                          gap="2.5"
                          px="2.5"
                          py="2"
                          borderRadius="md"
                          bg={item.active ? "brand.subtle" : "transparent"}
                          color={item.active ? "violet.400" : "text.muted"}
                        >
                          <item.icon size={14} />
                          <Text fontSize="xs" fontWeight="medium">
                            {item.label}
                          </Text>
                        </Flex>
                      ))}
                    </Flex>
                  </MotionBox>

                  {/* Main panel: AI document generation */}
                  <Flex
                    direction="column"
                    justify="space-between"
                    p={{ base: "5", md: "7" }}
                  >
                    <Box>
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="text.primary"
                        mb="4"
                      >
                        What should we draft today?
                      </Text>
                      <Flex direction="column" gap="3">
                        <Box
                          alignSelf="flex-end"
                          bg="violet.600"
                          color="white"
                          borderRadius="lg"
                          borderBottomRightRadius="sm"
                          px="4"
                          py="2.5"
                          fontSize="xs"
                          maxW="80%"
                        >
                          Draft a renewal notice for our Q3 facilities clients
                        </Box>
                        <MotionBox
                          as={motion.div}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                          alignSelf="flex-start"
                          bg="bg.elevated"
                          border="1px solid"
                          borderColor="border.subtle"
                          borderRadius="lg"
                          borderBottomLeftRadius="sm"
                          px="4"
                          py="2.5"
                          fontSize="xs"
                          color="text.secondary"
                          maxW="85%"
                        >
                          Generating renewal notice — pulling client terms,
                          formatting for e-signature, matching your org's tone.
                        </MotionBox>
                      </Flex>
                    </Box>

                    <Flex
                      align="center"
                      gap="2"
                      mt="6"
                      border="1px solid"
                      borderColor="border.default"
                      borderRadius="lg"
                      px="3"
                      py="2.5"
                      bg="bg.canvas"
                    >
                      <Text fontSize="xs" color="text.muted" flex="1">
                        Ask TenantFlow to draft, revise, or summarize…
                      </Text>
                      <MotionBox
                        as={motion.div}
                        whileHover={{ scale: 1.08 }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        w="7"
                        h="7"
                        borderRadius="md"
                        bg="violet.600"
                        color="white"
                        flexShrink="0"
                      >
                        <LuSend size={13} />
                      </MotionBox>
                    </Flex>
                  </Flex>
                </Grid>
              </MotionBox>
            </Float>
          </Box>
        </Reveal>
      </Flex>
    </Box>
  );
}
