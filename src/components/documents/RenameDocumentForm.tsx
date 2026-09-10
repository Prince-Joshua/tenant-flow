"use client";

import { useActionState, useState } from "react";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { renameDocumentAction } from "@/server/actions/documents";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { inputStyle } from "@/lib/inputStyles";

export default function RenameDocumentForm({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState(renameDocumentAction, undefined);

  if (!editing) {
    return (
      <Flex align="center" gap="2">
        <Text
          fontSize="md"
          fontWeight="bold"
          color="text.primary"
          lineClamp={1}
        >
          {title}
        </Text>
        <Button
          size="xs"
          onClick={() => setEditing(true)}
          fontSize="xs"
          color="text.muted"
          _hover={{ color: "violet.400" }}
        >
          ✎ Rename
        </Button>
      </Flex>
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
      <Flex align="center" gap="2">
        <Input
          name="title"
          defaultValue={title}
          size="sm"
          autoFocus
          {...inputStyle}
        />
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
      </Flex>
      {state?.error && (
        <Text fontSize="xs" color="rose.400" mt="1">
          {state.error}
        </Text>
      )}
    </form>
  );
}
