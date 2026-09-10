import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { ChakraLink } from "@/components/shared/ChakraLink";
import { getAllUsers } from "@/server/data/admin";
import PageHeader from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared";
import { inputStyle } from "@/lib/inputStyles";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const { users, pagination } = await getAllUsers({ page, search });
  const list = JSON.parse(JSON.stringify(users));

  return (
    <>
      <PageHeader title="Users" subtitle={`${pagination.total} total`} />

      <form method="get" action="/admin/users">
        <Input
          name="search"
          defaultValue={search}
          placeholder="Search users..."
          maxW="320px"
          mb="5"
          {...inputStyle}
        />
      </form>

      {!list.length ? (
        <EmptyState icon="✦" title="No users found" />
      ) : (
        <Flex direction="column" gap="2">
          {list.map((u: any) => (
            <Flex
              key={u._id}
              justify="space-between"
              align="center"
              bg="bg.surface"
              border="1px solid"
              borderColor="border.subtle"
              borderRadius="xl"
              p="4"
            >
              <Box>
                <Text fontSize="sm" fontWeight="semibold" color="text.primary">
                  {u.name}
                </Text>
                <Text fontSize="xs" color="text.muted">
                  {u.email}
                </Text>
              </Box>
              <Flex align="center" gap="3">
                <Text
                  fontSize="xs"
                  color={u.isEmailVerified ? "emerald.400" : "text.muted"}
                >
                  {u.isEmailVerified ? "Verified" : "Unverified"}
                </Text>
                <Text fontSize="xs" color="text.muted">
                  {new Date(u.createdAt).toLocaleDateString()}
                </Text>
              </Flex>
            </Flex>
          ))}
          {pagination.pages > 1 && (
            <Flex justify="space-between" align="center" mt="2">
              <ChakraLink
                href={`/admin/users?page=${Math.max(1, page - 1)}${search ? `&search=${search}` : ""}`}
                fontSize="sm"
                color="text.secondary"
              >
                ← Prev
              </ChakraLink>
              <Text fontSize="xs" color="text.muted">
                {page} / {pagination.pages}
              </Text>
              <ChakraLink
                href={`/admin/users?page=${Math.min(pagination.pages, page + 1)}${search ? `&search=${search}` : ""}`}
                fontSize="sm"
                color="text.secondary"
              >
                Next →
              </ChakraLink>
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
}
