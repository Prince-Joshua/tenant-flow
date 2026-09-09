import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import { getCurrentUserWithMemberships } from '@/server/data/auth';
import { selectOrgAction } from '@/server/actions/auth';
import { PlanBadge } from '@/components/shared';

export default async function OrgSelectPage() {
  const result = await getCurrentUserWithMemberships();
  if (!result) redirect('/login');
  const { memberships } = result;

  return (
    <Flex minH="100vh" align="center" justify="center" bg="bg.canvas" px="4">
      <Box w="full" maxW="480px">
        <Text fontSize="2xl" fontWeight="bold" color="text.primary" mb="2">Choose a workspace</Text>
        <Text fontSize="sm" color="text.muted" mb="8">Select the organization you want to work in.</Text>
        <Flex direction="column" gap="3">
          {memberships.map((m: any) => (
            <form key={m._id} action={selectOrgAction}>
              <input type="hidden" name="slug" value={m.organization.slug} />
              <Button
                type="submit"
                w="full"
                h="auto"
                justifyContent="flex-start"
                fontWeight="normal"
                textAlign="left"
                bg="bg.surface"
                border="1px solid"
                borderColor="border.subtle"
                borderRadius="xl"
                p="5"
                cursor="pointer"
                transition="all 0.15s"
                _hover={{ borderColor: 'violet.500', bg: 'bg.elevated' }}
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="semibold" color="text.primary" mb="1">{m.organization.name}</Text>
                    <Text fontSize="xs" color="text.muted" textTransform="capitalize">{m.role}</Text>
                  </Box>
                  <Flex align="center" gap="3">
                    <PlanBadge plan={m.organization.plan} />
                    <Text color="text.muted" fontSize="lg">→</Text>
                  </Flex>
                </Flex>
              </Button>
            </form>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
}
