"use client";

import { useActionState, useState } from "react";
import { Box, Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { updateDocumentAction } from "@/server/actions/documents";
import { SubmitButton } from "@/components/shared/SubmitButton";

export default function EditDocumentContentForm({
  id,
  content,
  disabledReason,
}: {
  id: string;
  content: string;

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
            size="xs"
            onClick={() => !disabled && setEditing(true)}
            disabled={disabled}
            fontSize="xs"
            color="text.muted"
            opacity={disabled ? 0.5 : 1}
            cursor={disabled ? "not-allowed" : "pointer"}
            _hover={disabled ? {} : { color: "violet.400" }}
          >
            Edit
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
          size="xs"
          onClick={() => setEditing(false)}
          fontSize="xs"
          color="text.muted"
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
