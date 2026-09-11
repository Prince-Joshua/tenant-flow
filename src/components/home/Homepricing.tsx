"use client";

import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { LuCheck } from "react-icons/lu";
import { ChakraLink } from "@/components/shared/ChakraLink";
import { Reveal, RevealStagger, StaggerItem } from "./Reveal";
import { MotionBox } from "../shared/MotionBox";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    blurb: "For a single organization getting off the ground.",
    features: [
      "1 tenant workspace",
      "Up to 5 members",
      "25 AI-generated documents / mo",
      "Core role-based access",
    ],
    cta: "Start for free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$79",
    period: "/month",
    blurb: "For teams running day-to-day operations on TenantFlow.",
    features: [
      "1 tenant workspace",
      "Unlimited members",
      "500 AI-generated documents / mo",
      "Approval workflows & audit log",
      "Self-serve billing portal",
    ],
    cta: "Start your trial",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    blurb: "For platforms managing many tenants at scale.",
    features: [
      "Unlimited tenant workspaces",
      "SSO & advanced admin controls",
      "Custom usage limits",
      "Priority support & SLA",
    ],
    cta: "Talk to sales",
    href: "/register",
    highlighted: false,
  },
];

export function HomePricing() {
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
            Every plan includes a fully isolated tenant, role-based access, and
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
