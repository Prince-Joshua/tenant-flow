"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ChakraLink } from "@/components/shared/ChakraLink";
import { Reveal } from "./Reveal";
import { MotionBox } from "../shared/MotionBox";

export function HomeCTA() {
  return (
    <Box px={{ base: "5", md: "10" }} py={{ base: "10", md: "16" }}>
      <Box
        position="relative"
        overflow="hidden"
        maxW="1000px"
        mx="auto"
        borderRadius="2xl"
        border="1px solid"
        borderColor="border.subtle"
        bg="bg.surface"
        px={{ base: "8", md: "16" }}
        py={{ base: "14", md: "16" }}
        textAlign="center"
      >
        <Box position="absolute" inset="0" zIndex="0" pointerEvents="none">
          <motion.div
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -20, 15, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "-40%",
              left: "20%",
              width: "420px",
              height: "420px",
              borderRadius: "999px",
              background:
                "radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(139,92,246,0) 70%)",
              filter: "blur(10px)",
            }}
          />
        </Box>

        <Box position="relative" zIndex="1">
          <Reveal y={16}>
            <Text
              as="h2"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              color="text.primary"
              letterSpacing="tight"
              maxW="560px"
              mx="auto"
              mb="4"
            >
              Bring every organization you run into one workspace
            </Text>
          </Reveal>
          <Reveal y={14} delay={0.08}>
            <Text
              fontSize="md"
              color="text.secondary"
              maxW="440px"
              mx="auto"
              mb="8"
            >
              Spin up your first tenant in minutes — no credit card required to
              start.
            </Text>
          </Reveal>
          <Reveal y={12} delay={0.16}>
            <Flex justify="center">
              <MotionBox
                as={motion.div}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(139,92,246,0.0)",
                    "0 0 28px rgba(139,92,246,0.45)",
                    "0 0 0px rgba(139,92,246,0.0)",
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                borderRadius="lg"
              >
                <ChakraLink
                  href="/register"
                  display="inline-block"
                  fontSize="sm"
                  fontWeight="semibold"
                  color="white"
                  bg="violet.600"
                  borderRadius="lg"
                  px="7"
                  py="3.5"
                  _hover={{ bg: "violet.500" }}
                >
                  Create your workspace
                </ChakraLink>
              </MotionBox>
            </Flex>
          </Reveal>
        </Box>
      </Box>
    </Box>
  );
}
