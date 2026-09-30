"use client";

import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { LuCheck } from "react-icons/lu";
import { ChakraLink } from "@/components/shared/ChakraLink";
import { Reveal, RevealStagger, StaggerItem } from "./Reveal";
import { MotionBox } from "../shared/MotionBox";
import {
  PLAN_PRICING,
  type DisplayCurrency,
  type PlanKey,
} from "@/server/config/pricing";
import { PLAN_LIMITS } from "@/server/config/planLimits";

const UNLIMITED = 999999;

const fmtLimit = (n: number) =>
  n >= UNLIMITED ? "Unlimited" : n.toLocaleString();

const fmtPrice = (amount: number, currency: DisplayCurrency) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount);

function buildFeatures(plan: keyof typeof PLAN_LIMITS) {
  const l = PLAN_LIMITS[plan];
  return [
    `${fmtLimit(l.documentsPerCycle)} AI-generated documents / cycle`,
    `${fmtLimit(l.membersAllowed)} ${l.membersAllowed === 1 ? "seat" : "seats"}`,
    `${fmtLimit(l.contactsAllowed)} contacts`,
    "Role-based access",
    "Approval workflows & audit log",
  ];
}

function buildPlans(currency: DisplayCurrency) {
  const price = (plan: PlanKey) =>
    fmtPrice(PLAN_PRICING[plan].display[currency], currency);

  return [
    {
      name: "Free",
      price: fmtPrice(0, currency),
      period: "/mo",
      blurb: "For a single organization getting off the ground.",
      features: buildFeatures("free"),
      cta: "Start for free",
      href: "/register",
      highlighted: false,
    },
    {
      name: "Pro",
      price: price("pro"),
      period: "/mo",
      blurb: "For teams running day-to-day operations.",
      features: [...buildFeatures("pro"), "Self-serve billing portal"],
      cta: "Get Pro",
      href: "/register",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: price("enterprise"),
      period: "/mo",
      blurb: "For organizations operating at scale.",
      features: [...buildFeatures("enterprise"), "Self-serve billing portal"],
      cta: "Get Enterprise",
      href: "/register",
      highlighted: false,
    },
  ];
}

export function HomePricing({
  currency = "usd",
}: {
  currency?: DisplayCurrency;
}) {
  const plans = buildPlans(currency);
  const isEstimate = currency === "gbp" || currency === "eur";

  return (
    <Box py={{ base: "16", md: "24" }} px={{ base: "5", md: "10" }}>
      <Reveal y={16}>
        <Flex direction="column" align="center" textAlign="center" mb="14">
          <Text
            as="h2"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            color="text.primary"
            letterSpacing="tight"
            mb="3"
          >
            Choose a plan to get started
          </Text>
          <Text fontSize="sm" color="text.secondary" maxW="480px">
            Every plan includes a fully isolated workspace, role-based access, and
            the same AI writing assistant.
          </Text>
        </Flex>
      </Reveal>

      <RevealStagger>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap="5"
          maxW="1080px"
          mx="auto"
          alignItems="stretch"
        >
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <MotionBox
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                position="relative"
                h="100%"
                bg={plan.highlighted ? "bg.elevated" : "bg.surface"}
                border="1px solid"
                borderColor={
                  plan.highlighted ? "brand.border" : "border.subtle"
                }
                borderRadius="2xl"
                p="7"
                display="flex"
                flexDirection="column"
                style={
                  plan.highlighted
                    ? {
                        boxShadow:
                          "0 0 0 1px rgba(139,92,246,0.15), 0 30px 60px -30px rgba(139,92,246,0.35)",
                      }
                    : undefined
                }
              >
                {plan.highlighted && (
                  <MotionBox
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 2.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    position="absolute"
                    top="-3"
                    right="7"
                    fontSize="2xs"
                    fontWeight="semibold"
                    color="white"
                    bg="violet.600"
                    borderRadius="full"
                    px="3"
                    py="1"
                    letterSpacing="wide"
                    textTransform="uppercase"
                  >
                    Most popular
                  </MotionBox>
                )}

                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="text.primary"
                  mb="1"
                >
                  {plan.name}
                </Text>
                <Flex align="baseline" gap="1" mb="2">
                  <Text fontSize="3xl" fontWeight="bold" color="text.primary">
                    {plan.price}
                  </Text>
                  {plan.period && (
                    <Text fontSize="sm" color="text.muted">
                      {plan.period}
                    </Text>
                  )}
                </Flex>
                {isEstimate && plan.name !== "Free" && (
                  <Text fontSize="xs" color="text.muted" mb="2">
                    Estimated — exact amount shown at checkout
                  </Text>
                )}
                <Text fontSize="sm" color="text.secondary" mb="6" minH="40px">
                  {plan.blurb}
                </Text>

                <Flex direction="column" gap="2.5" mb="7" flex="1">
                  {plan.features.map((f) => (
                    <Flex key={f} align="center" gap="2.5">
                      <Box color="violet.400" flexShrink="0">
                        <LuCheck size={14} />
                      </Box>
                      <Text fontSize="sm" color="text.secondary">
                        {f}
                      </Text>
                    </Flex>
                  ))}
                </Flex>

                <MotionBox
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChakraLink
                    href={plan.href}
                    display="block"
                    textAlign="center"
                    fontSize="sm"
                    fontWeight="semibold"
                    borderRadius="lg"
                    px="5"
                    py="2.5"
                    color={plan.highlighted ? "white" : "text.primary"}
                    bg={plan.highlighted ? "violet.600" : "bg.overlay"}
                    _hover={{
                      bg: plan.highlighted ? "violet.500" : "border.default",
                    }}
                  >
                    {plan.cta}
                  </ChakraLink>
                </MotionBox>
              </MotionBox>
            </StaggerItem>
          ))}
        </Grid>
      </RevealStagger>
    </Box>
  );
}
