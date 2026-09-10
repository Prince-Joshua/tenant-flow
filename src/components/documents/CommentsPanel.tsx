"use client";

import { useActionState } from "react";
import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import {
  addCommentAction,
  deleteCommentAction,
} from "@/server/actions/comments";
import { SubmitButton } from "@/components/shared/SubmitButton";

type CommentItem = {
  _id: string;
  author: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export default function CommentsPanel({
  documentId,
  comments,
  currentUserId,
  canModerate,
}: {
  documentId: string;
  comments: CommentItem[];
  currentUserId: string;
  canModerate: boolean;
}) {
  const [state, formAction] = useActionState(addCommentAction, undefined);

  return (
    <Box as="details" position="relative">
      <Box
        as="summary"
        listStyleType="none"
        cursor="pointer"
        fontSize="sm"
        fontWeight="semibold"
        color="text.secondary"
        bg="bg.surface"
        border="1px solid"
        borderColor="border.default"
        borderRadius="lg"
        px="4"
        py="1.5"
        _hover={{ borderColor: "violet.500", color: "text.primary" }}
      >
        💬 Comments{comments.length > 0 ? ` (${comments.length})` : ""}
      </Box>
      <Box
        position="absolute"
        top="calc(100% + 6px)"
        left="0"
        w="380px"
        maxW="90vw"
        bg="bg.surface"
        border="1px solid"
        borderColor="border.default"
        borderRadius="lg"
        p="3"
        boxShadow="0 8px 24px rgba(0,0,0,0.35)"
        zIndex="10"
      >
        {comments.length === 0 ? (
          <Text fontSize="xs" color="text.muted" mb="3">
            No comments yet.
          </Text>
        ) : (
          <Box maxH="280px" overflowY="auto" mb="3" pr="1">
            {comments.map((c) => {
              const canDelete = canModerate || c.author === currentUserId;
              return (
                <Box
                  key={c._id}
                  mb="2"
                  pb="2"
                  borderBottom="1px solid"
                  borderColor="border.subtle"
                >
                  <Flex justify="space-between" align="baseline" gap="2">
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      color="text.primary"
                    >
                      {c.authorName}
                    </Text>
                    <Text fontSize="2xs" color="text.muted" whiteSpace="nowrap">
                      {new Date(c.createdAt)
                        .toISOString()
                        .slice(0, 16)
                        .replace("T", " ")}
                    </Text>
                  </Flex>
                  <Text
                    fontSize="sm"
                    color="text.secondary"
                    whiteSpace="pre-wrap"
                    mt="0.5"
                  >
                    {c.body}
                  </Text>
                  {canDelete && (
                    <form action={deleteCommentAction}>
                      <input type="hidden" name="commentId" value={c._id} />
                      <input
                        type="hidden"
                        name="documentId"
                        value={documentId}
                      />
                      <SubmitButton
                        size="2xs"
                        variant="ghost"
                        color="rose.400"
                        px="0"
                        h="auto"
                        mt="1"
                      >
                        Delete
                      </SubmitButton>
                    </form>
                  )}
                </Box>
              );
            })}
          </Box>
        )}

        <form action={formAction}>
          <input type="hidden" name="documentId" value={documentId} />
          <Textarea
            name="body"
            placeholder="Add a comment…"
            rows={2}
            fontSize="sm"
            color="text.primary"
            bg="bg.elevated"
            borderColor="border.default"
            _focus={{ borderColor: "violet.500" }}
          />
          <Flex justify="flex-end" mt="2">
            <SubmitButton
              size="xs"
              bg="violet.600"
              color="white"
              borderRadius="lg"
              _hover={{ bg: "violet.500" }}
            >
              Post
            </SubmitButton>
          </Flex>
        </form>
        {state?.error && (
          <Text fontSize="xs" color="rose.400" mt="1">
            {state.error}
          </Text>
        )}
      </Box>
    </Box>
  );
}
