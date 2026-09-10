import { notFound } from "next/navigation";
import { Box, Text } from "@chakra-ui/react";
import { getPublicDocument } from "@/server/data/documents";

export default async function PublicDocumentPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const doc = await getPublicDocument(token);

  if (!doc) notFound();

  return (
    <Box minH="100vh" bg="bg.canvas">
      <Box maxW="720px" mx="auto" px="5" py={{ base: "12", md: "16" }}>
        <Text fontSize="xs" color="text.muted" mb="2">
          Shared via TenantFlow — read only
        </Text>
        <Text
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          color="text.primary"
          mb="8"
        >
          {doc.title}
        </Text>
        <Text
          fontSize="sm"
          color="text.secondary"
          lineHeight="tall"
          whiteSpace="pre-wrap"
        >
          {doc.content}
        </Text>
      </Box>
    </Box>
  );
}
