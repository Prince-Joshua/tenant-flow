"use client";

import { useActionState, useEffect, useRef } from "react";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { addContactAction } from "@/server/actions/contacts";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { inputStyle } from "@/lib/inputStyles";

export default function ContactForm() {
  const [state, formAction] = useActionState(addContactAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction}>
      <Flex gap="3" align="flex-end" wrap="wrap">
        <Box flex="1" minW="180px">
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="text.secondary"
            mb="1.5"
          >
            Name
          </Text>
          <Input
            name="name"
            placeholder="Jane Customer"
            required
            {...inputStyle}
          />
        </Box>
        <Box flex="1" minW="220px">
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="text.secondary"
            mb="1.5"
          >
            Email
          </Text>
          <Input
            name="email"
            type="email"
            placeholder="jane@customer.com"
            required
            {...inputStyle}
          />
        </Box>
        <Box flex="1" minW="180px">
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="text.secondary"
            mb="1.5"
          >
            Note (optional)
          </Text>
          <Input name="note" placeholder="How you know them" {...inputStyle} />
        </Box>
        <SubmitButton
          bg="violet.600"
          color="white"
          borderRadius="lg"
          _hover={{ bg: "violet.500" }}
        >
          + Add contact
        </SubmitButton>
      </Flex>
      <AnimatePresence mode="wait">
        {state?.error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <Text fontSize="sm" color="rose.400" mt="3">
              {state.error}
            </Text>
          </motion.div>
        )}
        {state?.success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <Text fontSize="sm" color="emerald.400" mt="3">
              {state.success}
            </Text>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
