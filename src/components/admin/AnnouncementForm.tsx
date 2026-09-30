"use client";

import { useActionState, useRef, useEffect } from "react";
import { Box, Input, Stack, Text, Textarea } from "@chakra-ui/react";
import { createAnnouncementAction } from "@/server/actions/notifications";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { inputStyle } from "@/lib/inputStyles";

export default function AnnouncementForm() {
  const [state, formAction] = useActionState(createAnnouncementAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state?.success]);

  return (
    <form action={formAction} ref={formRef}>
      <Stack gap="4" maxW="480px">
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="text.secondary" mb="1.5">
            Title
          </Text>
          <Input
            name="title"
            placeholder="e.g. Scheduled maintenance this weekend"
            required
            {...inputStyle}
          />
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="text.secondary" mb="1.5">
            Details (optional)
          </Text>
          <Textarea
            name="body"
            placeholder="What's changing, and what should users do about it?"
            rows={4}
            {...inputStyle}
          />
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="text.secondary" mb="1.5">
            Link (optional)
          </Text>
          <Input
            name="link"
            placeholder="/terms or https://..."
            {...inputStyle}
          />
        </Box>
        {state?.error && (
          <Text fontSize="sm" color="rose.400">
            {state.error}
          </Text>
        )}
        {state?.success && (
          <Text fontSize="sm" color="emerald.400">
            {state.success}
          </Text>
        )}
        <SubmitButton
          alignSelf="flex-start"
          bg="violet.600"
          color="white"
          borderRadius="lg"
          _hover={{ bg: "violet.500" }}
        >
          Publish to all users
        </SubmitButton>
      </Stack>
    </form>
  );
}
