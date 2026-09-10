"use client";

import { useActionState, useEffect } from "react";
import { Box, Button, Flex, Input, Text, Textarea } from "@chakra-ui/react";
import { sendDocumentByEmailAction } from "@/server/actions/documents";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { inputStyle } from "@/lib/inputStyles";
import { useDocumentActionMenu } from "./DocumentActionsMenuContext";

export default function SendDocumentEmailPanel({
  documentId,
}: {
  documentId: string;
}) {
  const { isOpen, toggle, close } = useDocumentActionMenu("email");
  const [state, formAction] = useActionState(
    sendDocumentByEmailAction,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Box position="relative">
      <Button
        onClick={toggle}
        aria-expanded={isOpen}
        variant="ghost"
        display="inline-flex"
        alignItems="center"
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
        h="auto"
        _hover={{ borderColor: "violet.500", color: "text.primary" }}
      >
        ✉ Email
      </Button>
      {isOpen && (
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
          <Flex justify="flex-end" mb="1">
            <Button
              size="2xs"
              variant="ghost"
              onClick={close}
              fontSize="xs"
              color="text.muted"
              px="1"
              minW="auto"
              h="auto"
              _hover={{ color: "text.primary", bg: "bg.elevated" }}
              aria-label="Close email panel"
            >
              ✕
            </Button>
          </Flex>
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
            <Flex justify="flex-end" gap="2">
              <SubmitButton
                type="button"
                onClick={close}
                size="xs"
                variant="ghost"
                color="text.muted"
                borderRadius="lg"
              >
                Cancel
              </SubmitButton>
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
      )}
    </Box>
  );
}
