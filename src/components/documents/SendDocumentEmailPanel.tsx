"use client";

import { useActionState } from "react";
import { Box, Flex, Input, Text, Textarea } from "@chakra-ui/react";
import { sendDocumentByEmailAction } from "@/server/actions/documents";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { inputStyle } from "@/lib/inputStyles";

export default function SendDocumentEmailPanel({
  documentId,
}: {
  documentId: string;
}) {
  const [state, formAction] = useActionState(
    sendDocumentByEmailAction,
    undefined,
  );

  return (
    <Box as="details" position="relative">
      <Box
        as="summary"
        listStyleType="none"
        cursor="pointer"
        fontSize="sm"
        fontWeight="semibold"
        color="text.secondary"
        bg="bg.surface"
        border="1px solid"
        borderColor="border.default"
        borderRadius="lg"
        px="4"
        py="1.5"
        _hover={{ borderColor: "violet.500", color: "text.primary" }}
      >
        ✉ Email
      </Box>
      <Box
        position="absolute"
        top="calc(100% + 6px)"
        left="0"
        w="320px"
        maxW="90vw"
        bg="bg.surface"
        border="1px solid"
        borderColor="border.default"
        borderRadius="lg"
        p="3"
        boxShadow="0 8px 24px rgba(0,0,0,0.35)"
        zIndex="10"
      >
        <form action={formAction}>
          <input type="hidden" name="id" value={documentId} />
          <Text
            fontSize="xs"
            fontWeight="medium"
            color="text.secondary"
            mb="1.5"
          >
            Recipient email
          </Text>
          <Input
            name="recipientEmail"
            type="email"
            placeholder="teammate@company.com"
            required
            size="sm"
            mb="2"
            {...inputStyle}
          />
          <Text
            fontSize="xs"
            fontWeight="medium"
            color="text.secondary"
            mb="1.5"
          >
            Message (optional)
          </Text>
          <Textarea
            name="message"
            placeholder="Take a look at this…"
            rows={2}
            fontSize="sm"
            color="text.primary"
            bg="bg.elevated"
            borderColor="border.default"
            _focus={{ borderColor: "violet.500" }}
            mb="2"
          />
          <Flex justify="flex-end">
            <SubmitButton
              size="xs"
              bg="violet.600"
              color="white"
              borderRadius="lg"
              _hover={{ bg: "violet.500" }}
            >
              Send
            </SubmitButton>
          </Flex>
        </form>
        {state?.error && (
          <Text fontSize="xs" color="rose.400" mt="2">
            {state.error}
          </Text>
        )}
        {state?.success && (
          <Text fontSize="xs" color="emerald.400" mt="2">
            {state.success}
          </Text>
        )}
      </Box>
    </Box>
  );
}
