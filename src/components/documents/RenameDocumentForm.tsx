"use client";

import { useActionState, useState } from "react";
import { Flex, Input, Button } from "@chakra-ui/react";
import { renameDocumentAction } from "@/server/actions/documents";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { inputStyle } from "@/lib/inputStyles";
import { Text } from "@chakra-ui/react";

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
          flex="1"
          minW="0"
        >
          {title}
        </Text>
        <Button
          type="button"
          onClick={() => setEditing(true)}
          size="xs"
          variant="outline"
          borderColor="border.default"
          color="text.secondary"
          borderRadius="lg"
          flexShrink={0}
        >
          Rename
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
          flexShrink={0}
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
          flexShrink={0}
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
