"use client";

import { useActionState, useEffect, useRef } from "react";
import { Box, Button, Flex, Input, Text, Textarea } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { sendDocumentByEmailAction } from "@/server/actions/documents";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { inputStyle, nativeSelectCss } from "@/lib/inputStyles";
import { useDocumentActionMenu } from "./DocumentActionsMenuContext";
import { CloseButton } from "@/components/shared/CloseButton";

type ContactOption = { _id: string; name: string; email: string };

export default function SendDocumentEmailPanel({
  documentId,
  contacts = [],
}: {
  documentId: string;
  contacts?: ContactOption[];
}) {
  const { isOpen, toggle, close } = useDocumentActionMenu("email");
  const [state, formAction] = useActionState(
    sendDocumentByEmailAction,
    undefined,
  );
  const recipientRef = useRef<HTMLInputElement>(null);

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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              width: "320px",
              maxWidth: "90vw",
              zIndex: 10,
              transformOrigin: "top left",
            }}
          >
            <Box
              bg="bg.surface"
              border="1px solid"
              borderColor="border.default"
              borderRadius="lg"
              p="3"
              boxShadow="0 8px 24px rgba(0,0,0,0.35)"
            >
              <Flex justify="flex-end" mb="1">
                <CloseButton onClick={close} aria-label="Close email panel" />
              </Flex>
              <form action={formAction}>
                <input type="hidden" name="id" value={documentId} />

                {contacts.length > 0 && (
                  <Box mb="2">
                    <Text
                      fontSize="xs"
                      fontWeight="medium"
                      color="text.secondary"
                      mb="1.5"
                    >
                      Saved contact (optional)
                    </Text>
                    <select
                      defaultValue=""
                      style={{ ...nativeSelectCss, width: "100%" }}
                      onChange={(e) => {
                        if (recipientRef.current && e.target.value) {
                          recipientRef.current.value = e.target.value;
                        }
                      }}
                    >
                      <option value="" style={{ background: "#111827" }}>
                        Choose a saved contact…
                      </option>
                      {contacts.map((c) => (
                        <option
                          key={c._id}
                          value={c.email}
                          style={{ background: "#111827" }}
                        >
                          {c.name} ({c.email})
                        </option>
                      ))}
                    </select>
                  </Box>
                )}

                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  color="text.secondary"
                  mb="1.5"
                >
                  Recipient email
                </Text>
                <Input
                  ref={recipientRef}
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
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
