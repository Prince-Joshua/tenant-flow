'use client';

import { useFormState } from 'react-dom';
import { Box, Flex, Text } from '@chakra-ui/react';
import { updateMemberRoleAction } from '@/server/actions/org';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { nativeSelectCss } from '@/lib/inputStyles';

export default function RoleUpdateForm({ memberId, role }: { memberId: string; role: string }) {
  const [state, formAction] = useFormState(updateMemberRoleAction, undefined);

  return (
    <Box>
      <form action={formAction} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="hidden" name="memberId" value={memberId} />
        <select name="role" defaultValue={role} style={nativeSelectCss}>
          <option value="admin" style={{ background: '#111827' }}>Admin</option>
          <option value="member" style={{ background: '#111827' }}>Member</option>
        </select>
        <SubmitButton size="xs" variant="outline" borderColor="border.default" color="text.secondary" borderRadius="lg">Save</SubmitButton>
      </form>
      {state?.error && <Text fontSize="xs" color="rose.400" mt="1">{state.error}</Text>}
    </Box>
  );
}
