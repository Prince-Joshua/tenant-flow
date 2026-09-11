"use client";

import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Reveal, RevealStagger, StaggerItem } from "./Reveal";
import { MotionBox } from "../shared/MotionBox";

const testimonials = [
  {
    quote:
      "We used to lose an afternoon a week drafting renewal notices by hand. TenantFlow drafts them in seconds and routes them for approval automatically.",
    name: "Dana Ilford",
    title: "Operations Lead, Fieldstone Property Group",
  },
  {
    quote:
      "Standing up a new client org used to mean a support ticket. Now it's self-serve, isolated, and ready in under a minute.",
    name: "Marcus Whitfield",
    title: "Platform Manager, Northwind Legal",
  },
  {
    quote:
      "The role-based access is exactly as granular as we needed — owners, admins, and members without any custom engineering on our side.",
    name: "Priya Anand",
    title: "Head of IT, Anchor & Vale",
  },
  {
    quote:
      "Billing just works. Usage metering per tenant meant we could finally see which accounts were actually profitable.",
    name: "Tomás Rivera",
    title: "Finance Director, Loop Systems",
  },
  {
    quote:
      "Our team writes better first drafts now than we used to write final ones. The AI assistant understands our org's tone after a few edits.",
    name: "Elena Kovač",
    title: "Client Success Lead, Vertex Collective",
  },
  {
    quote:
      "Migrating three regional teams onto separate tenants took an afternoon, not a quarter. Isolation was the whole reason we switched.",
    name: "Ben Okafor",
    title: "CTO, Harborline Consulting",
  },
];

export function HomeTestimonials() {
  return (
    <Box py={{ base: "16", md: "24" }} px={{ base: "5", md: "10" }}>
      <Reveal y={16}>
        <Text
          as="h2"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          color="text.primary"
          textAlign="center"
          letterSpacing="tight"
          mb="14"
        >
          What teams are saying
        </Text>
      </Reveal>

      <RevealStagger stagger={0.08}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap="4"
          maxW="1100px"
          mx="auto"
        >
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <MotionBox
                whileHover={{ y: -4, borderColor: "rgba(139,92,246,0.35)" }}
                h="100%"
                bg="bg.surface"
                border="1px solid"
                borderColor="border.subtle"
                borderRadius="xl"
                p="6"
                display="flex"
                flexDirection="column"
              >
                <Text
                  fontSize="sm"
                  color="text.secondary"
                  lineHeight="1.7"
                  mb="5"
                  flex="1"
                >
                  “{t.quote}”
                </Text>
                <Flex align="center" gap="3">
                  <Box
                    w="8"
                    h="8"
                    borderRadius="full"
                    bg="brand.subtle"
                    border="1px solid"
                    borderColor="brand.border"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xs"
                    fontWeight="semibold"
                    color="violet.400"
                    flexShrink="0"
                  >
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Box>
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      color="text.primary"
                    >
                      {t.name}
                    </Text>
                    <Text fontSize="xs" color="text.muted">
                      {t.title}
                    </Text>
                  </Box>
                </Flex>
              </MotionBox>
            </StaggerItem>
          ))}
        </Grid>
      </RevealStagger>
    </Box>
  );
}
