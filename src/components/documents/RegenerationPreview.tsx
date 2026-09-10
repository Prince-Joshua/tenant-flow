import { Box, Flex, Text } from "@chakra-ui/react";
import { diffWords, diffWordCounts } from "@/lib/diff";
import {
  approveRegenerationAction,
  discardRegenerationAction,
} from "@/server/actions/documents";
import { SubmitButton } from "@/components/shared/SubmitButton";

export default function RegenerationPreview({
  id,
  currentContent,
  pendingContent,
}: {
  id: string;
  currentContent: string;
  pendingContent: string;
}) {
  const tokens = diffWords(currentContent, pendingContent);
  const { added, removed } = diffWordCounts(tokens);

  return (
    <Box
      mb="4"
      p="4"
      borderRadius="lg"
      border="1px solid"
      borderColor="violet.500"
      bg="bg.elevated"
    >
      <Flex justify="space-between" align="center" mb="2" wrap="wrap" gap="2">
        <Text fontSize="sm" fontWeight="semibold" color="text.primary">
          ↻ Regenerated version — review before saving
        </Text>
        <Text fontSize="xs" color="text.muted">
          +{added} / -{removed} words
        </Text>
      </Flex>

      <Box
        fontSize="sm"
        lineHeight="tall"
        whiteSpace="pre-wrap"
        maxH="360px"
        overflowY="auto"
        p="3"
        borderRadius="md"
        bg="bg.surface"
        border="1px solid"
        borderColor="border.subtle"
      >
        {tokens.map((t, idx) => {
          if (t.type === "same") {
            return (
              <Text as="span" key={idx} color="text.secondary">
                {t.text}
              </Text>
            );
          }
          if (t.type === "removed") {
            return (
              <Text
                as="span"
                key={idx}
                color="rose.400"
                textDecoration="line-through"
                bg="rgba(244, 63, 94, 0.12)"
              >
                {t.text}
              </Text>
            );
          }
          return (
            <Text
              as="span"
              key={idx}
              color="emerald.400"
              bg="rgba(16, 185, 129, 0.12)"
            >
              {t.text}
            </Text>
          );
        })}
      </Box>

      <Flex gap="2" mt="3">
        <form action={approveRegenerationAction}>
          <input type="hidden" name="id" value={id} />
          <SubmitButton
            size="sm"
            bg="violet.600"
            color="white"
            borderRadius="lg"
            _hover={{ bg: "violet.500" }}
          >
            ✓ Approve & save
          </SubmitButton>
        </form>
        <form action={discardRegenerationAction}>
          <input type="hidden" name="id" value={id} />
          <SubmitButton
            size="sm"
            variant="outline"
            borderColor="border.default"
            color="text.secondary"
            borderRadius="lg"
          >
            ✕ Discard
          </SubmitButton>
        </form>
      </Flex>
    </Box>
  );
}
