import { Box, Flex, Grid, Input, Text } from "@chakra-ui/react";
import { requireTenant } from "@/server/data/tenant";
import {
  getDocuments,
  getDocument,
  getTemplates,
} from "@/server/data/documents";
import PageHeader from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { ChakraLink } from "@/components/shared/ChakraLink";
import GenerateDocumentForm from "@/components/documents/GenerateDocumentForm";
import RenameDocumentForm from "@/components/documents/RenameDocumentForm";
import {
  deleteDocumentAction,
  regenerateDocumentAction,
  duplicateDocumentAction,
  archiveDocumentAction,
  restoreDocumentAction,
  saveAsTemplateAction,
  createFromTemplateAction,
} from "@/server/actions/documents";
import { inputStyle, nativeSelectCss } from "@/lib/inputStyles";

const STATUS_FILTERS = [
  { value: "", label: "All (excl. archived)" },
  { value: "draft", label: "Drafts" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title_asc", label: "Title A→Z" },
  { value: "title_desc", label: "Title Z→A" },
];

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    doc?: string;
    status?: string;
    sort?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { org } = await requireTenant();
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const status = (resolvedSearchParams.status || "") as
    | ""
    | "draft"
    | "active"
    | "archived";
  const sort = (resolvedSearchParams.sort || "newest") as
    | "newest"
    | "oldest"
    | "title_asc"
    | "title_desc";

  const [{ documents, pagination }, selected, templates] = await Promise.all([
    getDocuments(org, { page, search, status, sort }),
    resolvedSearchParams.doc
      ? getDocument(org, resolvedSearchParams.doc)
      : Promise.resolve(null),
    getTemplates(org),
  ]);

  const docs = JSON.parse(JSON.stringify(documents));
  const selectedDoc = selected ? JSON.parse(JSON.stringify(selected)) : null;
  const templateOptions = JSON.parse(JSON.stringify(templates));
  const qs = (extra: Record<string, string | number>) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (sort && sort !== "newest") params.set("sort", sort);
    Object.entries(extra).forEach(([k, v]) => params.set(k, String(v)));
    return `/dashboard/documents?${params.toString()}`;
  };

  return (
    <>
      <PageHeader
        title="Documents"
        subtitle="Generate and manage AI-written content"
      />

      <Box as="details" mb="6">
        <Box
          as="summary"
          listStyleType="none"
          cursor="pointer"
          fontSize="sm"
          fontWeight="semibold"
          color="text.primary"
          bg="bg.surface"
          border="1px solid"
          borderColor="brand.border"
          borderRadius="xl"
          px="6"
          py="3"
        >
          + Generate a new document
        </Box>
        <Box
          bg="bg.surface"
          border="1px solid"
          borderColor="brand.border"
          borderTop="none"
          borderRadius="0 0 12px 12px"
          p="6"
        >
          <GenerateDocumentForm templates={templateOptions} />
        </Box>
      </Box>

      {templateOptions.length > 0 && (
        <Box mb="6">
          <Text fontSize="sm" fontWeight="semibold" color="text.primary" mb="2">
            Templates
          </Text>
          <Flex gap="2" wrap="wrap">
            {templateOptions.map((t: any) => (
              <form key={t._id} action={createFromTemplateAction}>
                <input type="hidden" name="templateId" value={t._id} />
                <SubmitButton
                  size="sm"
                  variant="outline"
                  borderColor="border.default"
                  color="text.secondary"
                  borderRadius="lg"
                >
                  ＋ {t.title}
                </SubmitButton>
              </form>
            ))}
          </Flex>
        </Box>
      )}

      <form method="get" action="/dashboard/documents">
        <Flex gap="3" mb="5" wrap="wrap" align="center">
          <Input
            name="search"
            defaultValue={search}
            placeholder="Search documents..."
            maxW="320px"
            {...inputStyle}
          />
          <select name="status" defaultValue={status} style={nativeSelectCss}>
            {STATUS_FILTERS.map((s) => (
              <option
                key={s.value}
                value={s.value}
                style={{ background: "#111827" }}
              >
                {s.label}
              </option>
            ))}
          </select>
          <select name="sort" defaultValue={sort} style={nativeSelectCss}>
            {SORTS.map((s) => (
              <option
                key={s.value}
                value={s.value}
                style={{ background: "#111827" }}
              >
                {s.label}
              </option>
            ))}
          </select>
          <SubmitButton
            size="sm"
            variant="outline"
            borderColor="border.default"
            color="text.secondary"
            borderRadius="lg"
          >
            Apply
          </SubmitButton>
        </Flex>
      </form>

      <Grid
        templateColumns={selectedDoc ? "1fr 1.6fr" : "1fr"}
        gap="5"
        alignItems="flex-start"
      >
        <Box>
          {!docs.length ? (
            <EmptyState
              icon="✦"
              title="No documents yet"
              description="Use the panel above to create your first document."
            />
          ) : (
            <Flex direction="column" gap="2">
              {docs.map((doc: any) => (
                <ChakraLink
                  key={doc._id}
                  href={qs({ page, doc: doc._id })}
                  display="block"
                  bg={
                    selectedDoc?._id === doc._id ? "bg.elevated" : "bg.surface"
                  }
                  border="1px solid"
                  borderColor={
                    selectedDoc?._id === doc._id
                      ? "violet.500"
                      : "border.subtle"
                  }
                  borderRadius="xl"
                  p="4"
                  transition="all 0.15s"
                  _hover={{ borderColor: "border.default" }}
                >
                  <Flex justify="space-between" align="flex-start" mb="1">
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="text.primary"
                      lineClamp={1}
                    >
                      {doc.title}
                    </Text>
                    {doc.status !== "active" && (
                      <Text
                        fontSize="xs"
                        color={
                          doc.status === "archived" ? "text.muted" : "amber.400"
                        }
                        textTransform="capitalize"
                        flexShrink={0}
                        ml="2"
                      >
                        {doc.status}
                      </Text>
                    )}
                  </Flex>
                  <Text fontSize="xs" color="text.muted" lineClamp={2}>
                    {doc.content?.slice(0, 100)}...
                  </Text>
                  <Text fontSize="xs" color="text.muted" mt="2">
                    {new Date(doc.createdAt).toLocaleDateString()}
                    {doc.createdBy?.name && ` · ${doc.createdBy.name}`}
                  </Text>
                </ChakraLink>
              ))}
              {pagination.pages > 1 && (
                <Flex justify="space-between" align="center" mt="2">
                  <ChakraLink
                    href={qs({ page: Math.max(1, page - 1) })}
                    pointerEvents={page === 1 ? "none" : "auto"}
                    opacity={page === 1 ? 0.4 : 1}
                    fontSize="sm"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="border.default"
                    color="text.secondary"
                    px="3"
                    py="1.5"
                  >
                    ← Prev
                  </ChakraLink>
                  <Text fontSize="xs" color="text.muted">
                    {page} / {pagination.pages}
                  </Text>
                  <ChakraLink
                    href={qs({ page: Math.min(pagination.pages, page + 1) })}
                    pointerEvents={page === pagination.pages ? "none" : "auto"}
                    opacity={page === pagination.pages ? 0.4 : 1}
                    fontSize="sm"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="border.default"
                    color="text.secondary"
                    px="3"
                    py="1.5"
                  >
                    Next →
                  </ChakraLink>
                </Flex>
              )}
            </Flex>
          )}
        </Box>

        {selectedDoc && (
          <Box
            bg="bg.surface"
            border="1px solid"
            borderColor="border.subtle"
            borderRadius="xl"
            p="6"
            position="sticky"
            top="8"
          >
            <Flex justify="space-between" align="flex-start" mb="3">
              <Box flex="1" mr="4">
                <RenameDocumentForm
                  id={selectedDoc._id}
                  title={selectedDoc.title}
                />
              </Box>
              <ChakraLink
                href={qs({ page })}
                fontSize="sm"
                color="text.muted"
                px="1"
              >
                ✕
              </ChakraLink>
            </Flex>

            <Flex gap="2" wrap="wrap" mb="4">
              <form action={regenerateDocumentAction}>
                <input type="hidden" name="id" value={selectedDoc._id} />
                <SubmitButton
                  size="sm"
                  variant="outline"
                  borderColor="border.default"
                  color="text.secondary"
                  borderRadius="lg"
                >
                  ↻ Regenerate
                </SubmitButton>
              </form>
              <form action={duplicateDocumentAction}>
                <input type="hidden" name="id" value={selectedDoc._id} />
                <SubmitButton
                  size="sm"
                  variant="outline"
                  borderColor="border.default"
                  color="text.secondary"
                  borderRadius="lg"
                >
                  ⧉ Duplicate
                </SubmitButton>
              </form>
              {!selectedDoc.isTemplate && (
                <form action={saveAsTemplateAction}>
                  <input type="hidden" name="id" value={selectedDoc._id} />
                  <SubmitButton
                    size="sm"
                    variant="outline"
                    borderColor="border.default"
                    color="text.secondary"
                    borderRadius="lg"
                  >
                    ☆ Save as template
                  </SubmitButton>
                </form>
              )}
              {selectedDoc.status === "archived" ? (
                <form action={restoreDocumentAction}>
                  <input type="hidden" name="id" value={selectedDoc._id} />
                  <SubmitButton
                    size="sm"
                    variant="outline"
                    borderColor="border.default"
                    color="text.secondary"
                    borderRadius="lg"
                  >
                    ↩ Restore
                  </SubmitButton>
                </form>
              ) : (
                <form action={archiveDocumentAction}>
                  <input type="hidden" name="id" value={selectedDoc._id} />
                  <SubmitButton
                    size="sm"
                    variant="outline"
                    borderColor="border.default"
                    color="text.secondary"
                    borderRadius="lg"
                  >
                    🗄 Archive
                  </SubmitButton>
                </form>
              )}
            </Flex>

            <Text
              fontSize="sm"
              color="text.secondary"
              lineHeight="tall"
              whiteSpace="pre-wrap"
            >
              {selectedDoc.content}
            </Text>
            <Flex justify="space-between" align="center" mt="4">
              <Text fontSize="xs" color="text.muted">
                {selectedDoc.tokensUsed} words ·{" "}
                {new Date(selectedDoc.createdAt).toLocaleDateString()}
              </Text>
              <form action={deleteDocumentAction}>
                <input type="hidden" name="id" value={selectedDoc._id} />
                <SubmitButton
                  size="sm"
                  variant="ghost"
                  color="text.muted"
                  _hover={{ color: "rose.400", bg: "transparent" }}
                >
                  Delete permanently
                </SubmitButton>
              </form>
            </Flex>
          </Box>
        )}
      </Grid>
    </>
  );
}
