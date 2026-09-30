"use client";

import { useActionState } from "react";
import { Box, Input, Stack, Text } from "@chakra-ui/react";
import { verifyAdminPasswordAction } from "@/server/actions/adminAccess";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { inputStyle } from "@/lib/inputStyles";

export default function AdminVerifyForm() {
  const [state, formAction] = useActionState(verifyAdminPasswordAction, undefined);

  return (
    <form action={formAction}>
      <Stack gap="6">
        {state?.error && (
          <Box bg="rgba(244,63,94,0.08)" border="1px solid" borderColor="rose.500" borderRadius="lg" px="4" py="3">
            <Text fontSize="sm" color="rose.400">{state.error}</Text>
          </Box>
        )}
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="text.secondary" mb="1.5">Password</Text>
          <Input name="password" type="password" placeholder="••••••••" required autoFocus {...inputStyle} />
        </Box>
        <SubmitButton w="full" bg="violet.600" color="white" borderRadius="lg" fontWeight="semibold" _hover={{ bg: "violet.500" }}>
          Continue to admin
        </SubmitButton>
      </Stack>
    </form>
  );
}
