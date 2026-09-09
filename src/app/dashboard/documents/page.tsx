import { Box, Flex, Grid, Input, Text } from '@chakra-ui/react';
import { requireTenant } from '@/server/data/tenant';
import { getDocuments, getDocument } from '@/server/data/documents';
import PageHeader from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/shared';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { ChakraLink } from '@/components/shared/ChakraLink';
import GenerateDocumentForm from '@/components/documents/GenerateDocumentForm';
import { deleteDocumentAction, regenerateDocumentAction } from '@/server/actions/documents';
import { inputStyle } from '@/lib/inputStyles';

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; doc?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { org } = await requireTenant();
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || '';

  const [{ documents, pagination }, selected] = await Promise.all([
    getDocuments(org, { page, search }),
    resolvedSearchParams.doc ? getDocument(org, resolvedSearchParams.doc) : Promise.resolve(null),
  ]);

  const docs = JSON.parse(JSON.stringify(documents));
  const selectedDoc = selected ? JSON.parse(JSON.stringify(selected)) : null;
  const qs = (extra: Record<string, string | number>) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    Object.entries(extra).forEach(([k, v]) => params.set(k, String(v)));
    return `/dashboard/documents?${params.toString()}`;
  };

  return (
    <>
      <PageHeader title="Documents" subtitle="Generate and manage AI-written content" />

      {/* Native <details> disclosure: the generate form is collapsed by
          default and expands with zero client JS. */}
      <Box as="details" mb="6">
        <Box as="summary" listStyleType="none" cursor="pointer" fontSize="sm" fontWeight="semibold" color="text.primary" bg="bg.surface" border="1px solid" borderColor="brand.border" borderRadius="xl" px="6" py="3">
          + Generate a new document
        </Box>
        <Box bg="bg.surface" border="1px solid" borderColor="brand.border" borderTop="none" borderRadius="0 0 12px 12px" p="6">
          <GenerateDocumentForm />
        </Box>
      </Box>

      <form method="get" action="/dashboard/documents">
        <Input name="search" defaultValue={search} placeholder="Search documents..." maxW="320px" mb="5" {...inputStyle} />
      </form>

      <Grid templateColumns={selectedDoc ? '1fr 1.6fr' : '1fr'} gap="5" alignItems="flex-start">
        <Box>
          {!docs.length ? (
            <EmptyState icon="✦" title="No documents yet" description="Use the panel above to create your first document." />
          ) : (
            <Flex direction="column" gap="2">
              {docs.map((doc: any) => (
                <ChakraLink
                  key={doc._id}
                  href={qs({ page, doc: doc._id })}
                  display="block"
                  bg={selectedDoc?._id === doc._id ? 'bg.elevated' : 'bg.surface'}
                  border="1px solid"
                  borderColor={selectedDoc?._id === doc._id ? 'violet.500' : 'border.subtle'}
                  borderRadius="xl"
                  p="4"
                  transition="all 0.15s"
                  _hover={{ borderColor: 'border.default' }}
                >
                  <Text fontSize="sm" fontWeight="semibold" color="text.primary" mb="1" lineClamp={1}>{doc.title}</Text>
                  <Text fontSize="xs" color="text.muted" lineClamp={2}>{doc.content?.slice(0, 100)}...</Text>
                  <Text fontSize="xs" color="text.muted" mt="2">
                    {new Date(doc.createdAt).toLocaleDateString()}{doc.createdBy?.name && ` · ${doc.createdBy.name}`}
                  </Text>
                </ChakraLink>
              ))}
              {pagination.pages > 1 && (
                <Flex justify="space-between" align="center" mt="2">
                  <ChakraLink href={qs({ page: Math.max(1, page - 1) })} pointerEvents={page === 1 ? 'none' : 'auto'} opacity={page === 1 ? 0.4 : 1} fontSize="sm" borderRadius="lg" border="1px solid" borderColor="border.default" color="text.secondary" px="3" py="1.5">← Prev</ChakraLink>
                  <Text fontSize="xs" color="text.muted">{page} / {pagination.pages}</Text>
                  <ChakraLink href={qs({ page: Math.min(pagination.pages, page + 1) })} pointerEvents={page === pagination.pages ? 'none' : 'auto'} opacity={page === pagination.pages ? 0.4 : 1} fontSize="sm" borderRadius="lg" border="1px solid" borderColor="border.default" color="text.secondary" px="3" py="1.5">Next →</ChakraLink>
                </Flex>
              )}
            </Flex>
          )}
        </Box>

        {selectedDoc && (
          <Box bg="bg.surface" border="1px solid" borderColor="border.subtle" borderRadius="xl" p="6" position="sticky" top="8">
            <Flex justify="space-between" align="flex-start" mb="4">
              <Text fontSize="md" fontWeight="bold" color="text.primary" flex="1" mr="4">{selectedDoc.title}</Text>
              <Flex gap="2">
                <form action={regenerateDocumentAction}>
                  <input type="hidden" name="id" value={selectedDoc._id} />
                  <SubmitButton size="sm" variant="outline" borderColor="border.default" color="text.secondary" borderRadius="lg">↻ Regenerate</SubmitButton>
                </form>
                <ChakraLink href={qs({ page })} fontSize="sm" color="text.muted" px="1">✕</ChakraLink>
              </Flex>
            </Flex>
            <Text fontSize="sm" color="text.secondary" lineHeight="tall" whiteSpace="pre-wrap">{selectedDoc.content}</Text>
            <Flex justify="space-between" align="center" mt="4">
              <Text fontSize="xs" color="text.muted">{selectedDoc.tokensUsed} words · {new Date(selectedDoc.createdAt).toLocaleDateString()}</Text>
              <form action={deleteDocumentAction}>
                <input type="hidden" name="id" value={selectedDoc._id} />
                <SubmitButton size="sm" variant="ghost" color="text.muted" _hover={{ color: 'rose.400', bg: 'transparent' }}>Delete</SubmitButton>
              </form>
            </Flex>
          </Box>
        )}
      </Grid>
    </>
  );
}
