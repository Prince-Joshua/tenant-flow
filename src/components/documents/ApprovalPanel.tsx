"use client";

import { useActionState, useEffect } from "react";
import { Box, Button, Flex, Text, Textarea } from "@chakra-ui/react";
import {
  submitForApprovalAction,
  approveDocumentAction,
  rejectDocumentAction,
} from "@/server/actions/documents";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { useDocumentActionMenu } from "./DocumentActionsMenuContext";
import { CloseButton } from "@/components/shared/CloseButton";

type ApprovalStatus = "draft" | "review" | "approved" | "rejected";

type ApprovalHistoryEntry = {
  action: "submitted" | "approved" | "rejected";
  byName: string;
  comment?: string;
  at: string;
};

const STATUS_LABEL: Record<ApprovalStatus, string> = {
  draft: "Draft",
  review: "In review",
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_COLOR: Record<ApprovalStatus, string> = {
  draft: "text.muted",
  review: "amber.400",
  approved: "emerald.400",
  rejected: "rose.400",
};

const HISTORY_LABEL: Record<ApprovalHistoryEntry["action"], string> = {
  submitted: "Submitted for review",
  approved: "Approved",
  rejected: "Rejected",
};

export default function ApprovalPanel({
  documentId,
  approvalStatus,
  approvalHistory,
  canSubmit,
  canApprove,
}: {
  documentId: string;
  approvalStatus: ApprovalStatus;
  approvalHistory: ApprovalHistoryEntry[];
  canSubmit: boolean;
  canApprove: boolean;
}) {
  const { isOpen, toggle, close } = useDocumentActionMenu("approval");
  const [rejectState, rejectAction] = useActionState(
    rejectDocumentAction,
    undefined,
  );

  useEffect(() => {
    if (rejectState?.success) {
      close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rejectState]);

  const canResubmit =
    approvalStatus === "draft" || approvalStatus === "rejected";
  const showReview = approvalStatus === "review";

  return (
    <Box position="relative">
      <Button
        onClick={toggle}
        aria-expanded={isOpen}
        variant="ghost"
        display="inline-flex"
        alignItems="center"
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
        h="auto"
        _hover={{ borderColor: "violet.500", color: "text.primary" }}
      >
        ✅ Approval ·{" "}
        <Text as="span" color={STATUS_COLOR[approvalStatus]} ml="1">
          {STATUS_LABEL[approvalStatus]}
        </Text>
      </Button>
      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 6px)"
          left="50%"
          transform="translateX(-50%)"
          w="340px"
          maxW="90vw"
          bg="bg.surface"
          border="1px solid"
          borderColor="border.default"
          borderRadius="lg"
          p="3"
          boxShadow="0 8px 24px rgba(0,0,0,0.35)"
          zIndex="10"
        >
          <Flex justify="flex-end" mb="1">
            <CloseButton onClick={close} aria-label="Close approval panel" />
          </Flex>

          {canSubmit && canResubmit && (
            <form action={submitForApprovalAction}>
              <input type="hidden" name="id" value={documentId} />
              <SubmitButton
                size="xs"
                bg="violet.600"
                color="white"
                borderRadius="lg"
                _hover={{ bg: "violet.500" }}
                mb="3"
                w="full"
              >
                {approvalStatus === "rejected"
                  ? "Resubmit for approval"
                  : "Submit for approval"}
              </SubmitButton>
            </form>
          )}

          {canApprove && showReview && (
            <Box mb="3">
              <form action={approveDocumentAction}>
                <input type="hidden" name="id" value={documentId} />
                <SubmitButton
                  size="xs"
                  bg="emerald.600"
                  color="white"
                  borderRadius="lg"
                  _hover={{ bg: "emerald.500" }}
                  w="full"
                  mb="2"
                >
                  ✓ Approve
                </SubmitButton>
              </form>
              <form action={rejectAction}>
                <input type="hidden" name="id" value={documentId} />
                <Textarea
                  name="reason"
                  placeholder="Reason for rejection (optional)"
                  rows={2}
                  fontSize="sm"
                  color="text.primary"
                  bg="bg.elevated"
                  borderColor="border.default"
                  _focus={{ borderColor: "violet.500" }}
                  mb="2"
                />
                <SubmitButton
                  size="xs"
                  variant="outline"
                  borderColor="rose.400"
                  color="rose.400"
                  borderRadius="lg"
                  w="full"
                >
                  ✕ Reject
                </SubmitButton>
              </form>
              {rejectState?.error && (
                <Text fontSize="xs" color="rose.400" mt="2">
                  {rejectState.error}
                </Text>
              )}
            </Box>
          )}

          {!canSubmit && !canApprove && (
            <Text fontSize="xs" color="text.muted" mb="3">
              Only the document owner and org admins can act on approval.
            </Text>
          )}

          <Text fontSize="xs" fontWeight="semibold" color="text.muted" mb="2">
            Approval history
          </Text>
          {approvalHistory.length === 0 ? (
            <Text fontSize="xs" color="text.muted">
              No approval activity yet.
            </Text>
          ) : (
            <Box maxH="200px" overflowY="auto" pr="1">
              {[...approvalHistory].reverse().map((entry, i) => (
                <Box
                  key={i}
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
                      {HISTORY_LABEL[entry.action]}
                    </Text>
                    <Text fontSize="2xs" color="text.muted" whiteSpace="nowrap">
                      {new Date(entry.at)
                        .toISOString()
                        .slice(0, 16)
                        .replace("T", " ")}
                    </Text>
                  </Flex>
                  <Text fontSize="xs" color="text.muted">
                    {entry.byName}
                  </Text>
                  {entry.comment && (
                    <Text fontSize="sm" color="text.secondary" mt="0.5">
                      {entry.comment}
                    </Text>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
