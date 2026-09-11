"use client";

import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  LuLayoutDashboard,
  LuWebhook,
  LuMail,
  LuCrown,
  LuGlobe,
} from "react-icons/lu";
import { Reveal, RevealStagger, StaggerItem } from "./Reveal";
import { MotionBox } from "../shared/MotionBox";
import { MotionFlex } from "../shared/MotionFlex";

const roleBadgeColor: Record<string, string> = {
  Owner: "amber.400",
  Admin: "sky.400",
  Member: "text.muted",
};

function DocGenMockup() {
  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="xl"
      p="5"
      style={{ boxShadow: "0 24px 60px -24px rgba(0,0,0,0.55)" }}
    >
      <Flex justify="space-between" align="center" mb="4">
        <Text fontSize="xs" fontWeight="semibold" color="text.primary">
          Renewal-Notice-Q3.docx
        </Text>
        <Text
          fontSize="2xs"
          color="emerald.400"
          bg="rgba(16,185,129,0.12)"
          px="2"
          py="0.5"
          borderRadius="full"
        >
          Generated
        </Text>
      </Flex>
      <Flex direction="column" gap="2" mb="4">
        {[100, 92, 76, 88, 60].map((w, i) => (
          <MotionBox
            key={i}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            h="2"
            w={`${w}%`}
            bg="bg.elevated"
            borderRadius="full"
            style={{ transformOrigin: "left" }}
          />
        ))}
      </Flex>
      <Flex gap="2">
        <Box
          fontSize="2xs"
          fontWeight="medium"
          color="violet.400"
          bg="brand.subtle"
          border="1px solid"
          borderColor="brand.border"
          borderRadius="md"
          px="2.5"
          py="1.5"
        >
          Regenerate
        </Box>
        <Box
          fontSize="2xs"
          fontWeight="medium"
          color="text.secondary"
          border="1px solid"
          borderColor="border.default"
          borderRadius="md"
          px="2.5"
          py="1.5"
        >
          Send for approval
        </Box>
      </Flex>
    </Box>
  );
}

function IsolationMockup() {
  const orgs = ["Acme Co", "Fieldstone", "Northwind"];
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap="3">
      {orgs.map((org, i) => (
        <MotionBox
          key={org}
          as={motion.div}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: i * 0.12 }}
          bg="bg.surface"
          border="1px solid"
          borderColor="border.subtle"
          borderRadius="lg"
          p="3.5"
        >
          <Flex align="center" gap="2" mb="3">
            <Box w="5" h="5" borderRadius="sm" bg="violet.600" />
            <Text
              fontSize="2xs"
              fontWeight="semibold"
              color="text.primary"
              truncate
            >
              {org}
            </Text>
          </Flex>
          <Flex direction="column" gap="1.5">
            {[0, 1, 2].map((r) => (
              <Box key={r} h="1.5" bg="bg.elevated" borderRadius="full" />
            ))}
          </Flex>
          <Text fontSize="2xs" color="text.muted" mt="3">
            Isolated data
          </Text>
        </MotionBox>
      ))}
    </Grid>
  );
}

function RolesMockup() {
  const members = [
    { name: "J. Alvarez", role: "Owner" },
    { name: "S. Chen", role: "Admin" },
    { name: "M. Osei", role: "Member" },
    { name: "R. Patel", role: "Member" },
  ];
  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="xl"
      p="5"
      style={{ boxShadow: "0 24px 60px -24px rgba(0,0,0,0.55)" }}
    >
      <Text fontSize="xs" fontWeight="semibold" color="text.primary" mb="4">
        Members · Acme Co
      </Text>
      <Flex direction="column" gap="2.5">
        {members.map((m, i) => (
          <MotionFlex
            key={m.name}
            as={motion.div}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            align="center"
            justify="space-between"
            py="1.5"
          >
            <Flex align="center" gap="2.5">
              <Box
                w="6"
                h="6"
                borderRadius="full"
                bg="bg.elevated"
                border="1px solid"
                borderColor="border.subtle"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {m.role === "Owner" ? (
                  <LuCrown size={11} color="#fbbf24" />
                ) : (
                  <Text fontSize="2xs" color="text.muted">
                    {m.name[0]}
                  </Text>
                )}
              </Box>
              <Text fontSize="xs" color="text.secondary">
                {m.name}
              </Text>
            </Flex>
            <Text
              fontSize="2xs"
              fontWeight="medium"
              color={roleBadgeColor[m.role]}
            >
              {m.role}
            </Text>
          </MotionFlex>
        ))}
      </Flex>
    </Box>
  );
}

function BillingMockup() {
  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="xl"
      p="5"
      style={{ boxShadow: "0 24px 60px -24px rgba(0,0,0,0.55)" }}
    >
      <Flex justify="space-between" align="center" mb="4">
        <Text fontSize="xs" fontWeight="semibold" color="text.primary">
          Growth plan
        </Text>
        <Text fontSize="2xs" color="text.muted">
          Renews Oct 12
        </Text>
      </Flex>
      <Text fontSize="2xs" color="text.muted" mb="1.5">
        AI documents used this cycle
      </Text>
      <Box h="2" bg="bg.elevated" borderRadius="full" overflow="hidden" mb="4">
        <MotionBox
          as={motion.div}
          initial={{ width: "0%" }}
          whileInView={{ width: "64%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          h="100%"
          bg="violet.500"
          borderRadius="full"
        />
      </Box>
      <Flex justify="space-between" fontSize="2xs" color="text.muted" mb="4">
        <Text>320 / 500 documents</Text>
        <Text>64%</Text>
      </Flex>
      <Flex
        justify="space-between"
        align="center"
        pt="3"
        borderTop="1px solid"
        borderColor="border.subtle"
      >
        <Text fontSize="2xs" color="text.secondary">
          Next invoice
        </Text>
        <Text fontSize="xs" fontWeight="semibold" color="text.primary">
          $79.00
        </Text>
      </Flex>
    </Box>
  );
}

const featureRows = [
  {
    eyebrow: "AI document generation",
    title: "Built to draft the real documents your team needs",
    body: "TenantFlow's writing assistant drafts contracts, renewal notices, proposals, and reports from a single prompt — then lets your team regenerate, edit, and route anything for approval before it ships.",
    Mockup: DocGenMockup,
    reverse: false,
  },
  {
    eyebrow: "Per-tenant isolation",
    title: "Designed for strict multi-tenant isolation",
    body: "Every organization gets its own scoped data, members, documents, and usage limits. Nothing crosses tenant boundaries — by architecture, not by convention.",
    Mockup: IsolationMockup,
    reverse: true,
  },
  {
    eyebrow: "Role-based access",
    title: "Adapts to how your organization is structured",
    body: "Owners, admins, and members each get exactly the access they need. Invite teammates, adjust roles as your org grows, and keep an audit trail of who did what.",
    Mockup: RolesMockup,
    reverse: false,
  },
  {
    eyebrow: "Built-in billing",
    title: "Made for always-on subscription billing",
    body: "Stripe-backed subscriptions, per-tenant usage metering, and a self-serve billing portal mean upgrades, downgrades, and invoices handle themselves.",
    Mockup: BillingMockup,
    reverse: true,
  },
];

const platformCards = [
  {
    icon: LuLayoutDashboard,
    title: "Web dashboard",
    body: "A fast, focused workspace for documents, members, and billing.",
  },
  {
    icon: LuWebhook,
    title: "REST API & webhooks",
    body: "Automate document generation and sync org events into your own tools.",
  },
  {
    icon: LuMail,
    title: "Email & exports",
    body: "Send documents for e-signature or export straight to PDF and DOCX.",
  },
];

export function HomeFeatures() {
  return (
    <Box position="relative" py={{ base: "16", md: "24" }}>
      <Reveal y={18}>
        <Text
          as="h2"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          color="text.primary"
          textAlign="center"
          letterSpacing="tight"
          maxW="640px"
          mx="auto"
          px="5"
          mb={{ base: "14", md: "20" }}
        >
          The best way to run a multi-tenant business
        </Text>
      </Reveal>

      <Flex
        direction="column"
        gap={{ base: "16", md: "24" }}
        px={{ base: "5", md: "10" }}
      >
        {featureRows.map((row) => (
          <Flex
            key={row.title}
            maxW="1100px"
            mx="auto"
            w="100%"
            direction={{
              base: "column",
              md: row.reverse ? "row-reverse" : "row",
            }}
            align="center"
            gap={{ base: "8", md: "16" }}
          >
            <Reveal x={row.reverse ? 40 : -40} y={0} width="100%">
              <Box flex="1">
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="violet.400"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  mb="3"
                >
                  {row.eyebrow}
                </Text>
                <Text
                  as="h3"
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="bold"
                  color="text.primary"
                  letterSpacing="tight"
                  mb="3"
                  lineHeight="1.25"
                >
                  {row.title}
                </Text>
                <Text
                  fontSize="sm"
                  color="text.secondary"
                  lineHeight="1.7"
                  maxW="440px"
                >
                  {row.body}
                </Text>
              </Box>
            </Reveal>

            <Reveal x={row.reverse ? -40 : 40} y={0} delay={0.1} width="100%">
              <Box
                flex="1"
                w="100%"
                maxW="440px"
                mx={{ base: "auto", md: "0" }}
              >
                <row.Mockup />
              </Box>
            </Reveal>
          </Flex>
        ))}
      </Flex>

      {/* Platform strip */}
      <Box mt={{ base: "20", md: "28" }} px={{ base: "5", md: "10" }}>
        <Reveal y={16}>
          <Flex direction="column" align="center" textAlign="center" mb="12">
            <Flex
              align="center"
              gap="2"
              fontSize="xs"
              fontWeight="semibold"
              color="violet.400"
              textTransform="uppercase"
              letterSpacing="wide"
              mb="3"
            >
              <LuGlobe size={14} />
              Everywhere your team works
            </Flex>
            <Text
              as="h2"
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              color="text.primary"
              letterSpacing="tight"
              maxW="560px"
            >
              The same workspace, wherever you need it
            </Text>
          </Flex>
        </Reveal>

        <RevealStagger>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap="4"
            maxW="1000px"
            mx="auto"
          >
            {platformCards.map((card) => (
              <StaggerItem key={card.title}>
                <MotionBox
                  as={motion.div}
                  whileHover={{ y: -4, borderColor: "rgba(139,92,246,0.4)" }}
                  bg="bg.surface"
                  border="1px solid"
                  borderColor="border.subtle"
                  borderRadius="xl"
                  p="6"
                  h="100%"
                >
                  <Box
                    bg="brand.subtle"
                    color="violet.400"
                    borderRadius="lg"
                    p="2.5"
                    display="inline-flex"
                    mb="4"
                  >
                    <card.icon size={18} />
                  </Box>
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    color="text.primary"
                    mb="1.5"
                  >
                    {card.title}
                  </Text>
                  <Text fontSize="sm" color="text.muted" lineHeight="1.6">
                    {card.body}
                  </Text>
                </MotionBox>
              </StaggerItem>
            ))}
          </Grid>
        </RevealStagger>
      </Box>
    </Box>
  );
}
