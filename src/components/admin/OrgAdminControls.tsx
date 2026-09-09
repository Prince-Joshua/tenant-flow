'use client';

import { Box, Flex } from '@chakra-ui/react';
import { updateOrgPlanAction, suspendOrgAction, resetOrgUsageAction } from '@/server/actions/admin';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { nativeSelectCss } from '@/lib/inputStyles';

export default function OrgAdminControls({ orgId, plan }: { orgId: string; plan: string }) {
  return (
    <Flex gap="2" align="center" wrap="wrap">
      <form action={updateOrgPlanAction} style={{ display: 'flex', gap: 6 }}>
        <input type="hidden" name="id" value={orgId} />
        <select name="plan" defaultValue={plan} style={nativeSelectCss}>
          <option value="free" style={{ background: '#111827' }}>Free</option>
          <option value="pro" style={{ background: '#111827' }}>Pro</option>
          <option value="enterprise" style={{ background: '#111827' }}>Enterprise</option>
        </select>
        <SubmitButton size="xs" variant="outline" borderColor="border.default" color="text.secondary" borderRadius="lg">Set plan</SubmitButton>
      </form>
      <form action={resetOrgUsageAction}>
        <input type="hidden" name="id" value={orgId} />
        <SubmitButton size="xs" variant="ghost" color="text.muted">Reset usage</SubmitButton>
      </form>
      <form action={suspendOrgAction}>
        <input type="hidden" name="id" value={orgId} />
        <SubmitButton size="xs" variant="ghost" color="text.muted" _hover={{ color: 'rose.400', bg: 'transparent' }}>Suspend</SubmitButton>
      </form>
    </Flex>
  );
}
