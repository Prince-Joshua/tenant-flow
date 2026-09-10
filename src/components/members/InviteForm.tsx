"use client";

import { useActionState } from "react";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { inviteMemberAction } from "@/server/actions/org";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { inputStyle, nativeSelectCss } from "@/lib/inputStyles";

export default function InviteForm() {
  const [state, formAction] = useActionState(inviteMemberAction, undefined);

  return (
    <form action={formAction}>
      <Flex gap="3" align="flex-end" wrap="wrap">
        <Box flex="1" minW="220px">
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="text.secondary"
            mb="1.5"
          >
            Email
          </Text>
          <Input
            name="email"
            type="email"
            placeholder="teammate@company.com"
            required
            {...inputStyle}
          />
        </Box>
        <Box>
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="text.secondary"
            mb="1.5"
          >
            Role
          </Text>
          <select name="role" defaultValue="member" style={nativeSelectCss}>
            <option value="member" style={{ background: "#111827" }}>
              Member
            </option>
            <option value="admin" style={{ background: "#111827" }}>
              Admin
            </option>
          </select>
        </Box>
        <SubmitButton
          bg="violet.600"
          color="white"
          borderRadius="lg"
          _hover={{ bg: "violet.500" }}
        >
          Send invite
        </SubmitButton>
      </Flex>
      {state?.error && (
        <Text fontSize="sm" color="rose.400" mt="3">
          {state.error}
        </Text>
      )}
      {state?.success && (
        <Text fontSize="sm" color="emerald.400" mt="3">
          {state.success}
        </Text>
      )}
    </form>
  );
}
