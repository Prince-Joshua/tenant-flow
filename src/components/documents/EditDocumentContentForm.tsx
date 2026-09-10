"use client";

import { useActionState, useState } from "react";
import { Box, Flex, Text, Textarea, Button } from "@chakra-ui/react";
import { updateDocumentAction } from "@/server/actions/documents";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { LuPen, LuPenLine } from "react-icons/lu";

export default function EditDocumentContentForm({
  id,
  content,
  disabledReason,
}: {
  id: string;
  content: string;
  // When set, editing is blocked (e.g. a regeneration is pending review)
  // and this text explains why.
  disabledReason?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState(updateDocumentAction, undefined);
  const disabled = Boolean(disabledReason);

  if (!editing) {
    return (
      <Box>
        <Flex justify="flex-end" align="center" gap="2" mb="1">
          {disabled && (
            <Text fontSize="xs" color="text.muted">
              {disabledReason}
            </Text>
          )}
          <Button
            onClick={() => !disabled && setEditing(true)}
            disabled={disabled}
            size="2xs"
            variant="outline"
            borderColor="border.default"
            color="text.secondary"
            borderRadius="lg"
          >
            <LuPenLine />
          </Button>
        </Flex>
        <Text
          fontSize="sm"
          color="text.secondary"
          lineHeight="tall"
          whiteSpace="pre-wrap"
        >
          {content}
        </Text>
      </Box>
    );
  }

  return (
    <form
      action={(formData) => {
        formAction(formData);
        setEditing(false);
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Textarea
        name="content"
        defaultValue={content}
        rows={14}
        fontSize="sm"
        color="text.primary"
        bg="bg.surface"
        borderColor="border.default"
        _focus={{ borderColor: "violet.500" }}
        autoFocus
      />
      <Flex gap="2" mt="2" align="center">
        <SubmitButton
          size="xs"
          bg="violet.600"
          color="white"
          borderRadius="lg"
          _hover={{ bg: "violet.500" }}
        >
          Save
        </SubmitButton>
        <Button
          type="button"
          onClick={() => setEditing(false)}
          size="xs"
          variant="ghost"
          color="text.muted"
          borderRadius="lg"
        >
          Cancel
        </Button>
        {state?.error && (
          <Text fontSize="xs" color="rose.400">
            {state.error}
          </Text>
        )}
      </Flex>
    </form>
  );
}
