"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { removeContactAction } from "@/server/actions/contacts";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { EmptyState } from "@/components/shared";

type ContactItem = {
  _id: string;
  name: string;
  email: string;
  note?: string;
  createdAt: string;
};

export default function ContactsList({
  contacts,
  canManage,
}: {
  contacts: ContactItem[];
  canManage: boolean;
}) {
  if (contacts.length === 0) {
    return (
      <EmptyState
        icon="☰"
        title="No contacts yet"
        description="Add customers or other outside contacts you want to send documents and announcements to privately."
      />
    );
  }

  return (
    <Flex direction="column" gap="2">
      <AnimatePresence initial={false}>
        {contacts.map((c, i) => (
          <motion.div
            key={c._id}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -12, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2, delay: i * 0.02, ease: "easeOut" }}
          >
            <Flex
              justify="space-between"
              align="center"
              bg="bg.surface"
              border="1px solid"
              borderColor="border.subtle"
              borderRadius="xl"
              p="4"
            >
              <Flex align="center" gap="3" minW="0">
                <Box
                  w="9"
                  h="9"
                  borderRadius="full"
                  bg="violet.700"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="sm"
                  fontWeight="bold"
                  color="white"
                  flexShrink={0}
                >
                  {c.name?.[0]?.toUpperCase()}
                </Box>
                <Box minW="0">
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color="text.primary"
                    truncate
                  >
                    {c.name}
                  </Text>
                  <Text fontSize="xs" color="text.muted" truncate>
                    {c.email}
                    {c.note ? ` · ${c.note}` : ""}
                  </Text>
                </Box>
              </Flex>

              {canManage && (
                <form action={removeContactAction}>
                  <input type="hidden" name="contactId" value={c._id} />
                  <SubmitButton
                    size="xs"
                    variant="ghost"
                    color="text.muted"
                    _hover={{ color: "rose.400", bg: "transparent" }}
                  >
                    Remove
                  </SubmitButton>
                </form>
              )}
            </Flex>
          </motion.div>
        ))}
      </AnimatePresence>
    </Flex>
  );
}
