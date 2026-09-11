"use client";

import { useActionState, useState } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import {
  addCollaboratorAction,
  removeCollaboratorAction,
  enablePublicLinkAction,
  disablePublicLinkAction,
  regeneratePublicLinkAction,
} from "@/server/actions/documents";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { nativeSelectCss } from "@/lib/inputStyles";
import { useDocumentActionMenu } from "./DocumentActionsMenuContext";
import { CloseButton } from "@/components/shared/CloseButton";

type OrgMember = {
  _id: string;
  user: { _id: string; name: string; email: string };
  role: string;
};

type Collaborator = {
  user: { _id: string; name: string; email: string };
  role: "view" | "edit";
};

function CollaboratorRow({
  documentId,
  collaborator,
}: {
  documentId: string;
  collaborator: Collaborator;
}) {
  const [state, formAction] = useActionState(addCollaboratorAction, undefined);

  return (
    <Box mb="2">
      <Flex align="center" gap="2">
        <Box flex="1" minW="0">
          <Text fontSize="sm" color="text.primary" lineClamp={1}>
            {collaborator.user.name}
          </Text>
          <Text fontSize="xs" color="text.muted" lineClamp={1}>
            {collaborator.user.email}
          </Text>
        </Box>
        <form action={formAction} style={{ display: "flex", gap: 6 }}>
          <input type="hidden" name="id" value={documentId} />
          <input
            type="hidden"
            name="memberUserId"
            value={collaborator.user._id}
          />
          <select
            name="role"
            defaultValue={collaborator.role}
            style={nativeSelectCss}
          >
            <option value="view" style={{ background: "#111827" }}>
              View
            </option>
            <option value="edit" style={{ background: "#111827" }}>
              Edit
            </option>
          </select>
          <SubmitButton
            size="xs"
            variant="outline"
            borderColor="border.default"
            color="text.secondary"
            borderRadius="lg"
          >
            Save
          </SubmitButton>
        </form>
        <form action={removeCollaboratorAction}>
          <input type="hidden" name="id" value={documentId} />
          <input
            type="hidden"
            name="memberUserId"
            value={collaborator.user._id}
          />
          <SubmitButton
            size="xs"
            variant="ghost"
            color="rose.400"
            borderRadius="lg"
          >
            Remove
          </SubmitButton>
        </form>
      </Flex>
      {state?.error && (
        <Text fontSize="xs" color="rose.400" mt="1">
          {state.error}
        </Text>
      )}
    </Box>
  );
}

function AddCollaboratorForm({
  documentId,
  available,
}: {
  documentId: string;
  available: OrgMember[];
}) {
  const [state, formAction] = useActionState(addCollaboratorAction, undefined);

  if (available.length === 0) {
    return (
      <Text fontSize="xs" color="text.muted">
        Everyone in this organization already has explicit access, or there's no
        one else to share with yet.
      </Text>
    );
  }

  return (
    <Box>
      <form action={formAction}>
        <input type="hidden" name="id" value={documentId} />
        <Flex gap="2" wrap="wrap">
          <select name="memberUserId" defaultValue="" style={nativeSelectCss}>
            <option value="" disabled style={{ background: "#111827" }}>
              Choose a teammate…
            </option>
            {available.map((m) => (
              <option
                key={m.user._id}
                value={m.user._id}
                style={{ background: "#111827" }}
              >
                {m.user.name} ({m.user.email})
              </option>
            ))}
          </select>
          <select name="role" defaultValue="view" style={nativeSelectCss}>
            <option value="view" style={{ background: "#111827" }}>
              View
            </option>
            <option value="edit" style={{ background: "#111827" }}>
              Edit
            </option>
          </select>
          <SubmitButton
            size="xs"
            bg="violet.600"
            color="white"
            borderRadius="lg"
            _hover={{ bg: "violet.500" }}
          >
            Share
          </SubmitButton>
        </Flex>
      </form>
      {state?.error && (
        <Text fontSize="xs" color="rose.400" mt="2">
          {state.error}
        </Text>
      )}
      {state?.success && (
        <Text fontSize="xs" color="emerald.400" mt="2">
          {state.success}
        </Text>
      )}
    </Box>
  );
}

function PublicLinkSection({
  documentId,
  isPublic,
  publicToken,
}: {
  documentId: string;
  isPublic: boolean;
  publicToken?: string;
}) {
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const publicUrl = publicToken ? `${origin}/public/${publicToken}` : "";

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy public link failed:", err);
    }
  }

  if (!isPublic) {
    return (
      <form action={enablePublicLinkAction}>
        <input type="hidden" name="id" value={documentId} />
        <SubmitButton
          size="xs"
          variant="outline"
          borderColor="border.default"
          color="text.secondary"
          borderRadius="lg"
        >
          🔗 Create public link
        </SubmitButton>
      </form>
    );
  }

  return (
    <Box>
      <Text
        fontSize="xs"
        color="text.secondary"
        bg="bg.elevated"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="md"
        px="2"
        py="1.5"
        mb="2"
        overflowWrap="anywhere"
      >
        {publicUrl}
      </Text>
      <Flex gap="2" wrap="wrap">
        <SubmitButton
          type="button"
          onClick={handleCopyLink}
          size="xs"
          variant="outline"
          borderColor="border.default"
          color="text.secondary"
          borderRadius="lg"
        >
          {copied ? "✓ Copied" : "⧉ Copy link"}
        </SubmitButton>
        <form action={regeneratePublicLinkAction}>
          <input type="hidden" name="id" value={documentId} />
          <SubmitButton
            size="xs"
            variant="outline"
            borderColor="border.default"
            color="text.secondary"
            borderRadius="lg"
          >
            ↻ New link
          </SubmitButton>
        </form>
        <form action={disablePublicLinkAction}>
          <input type="hidden" name="id" value={documentId} />
          <SubmitButton
            size="xs"
            variant="ghost"
            color="rose.400"
            borderRadius="lg"
          >
            Disable
          </SubmitButton>
        </form>
      </Flex>
    </Box>
  );
}

export default function ShareDocumentPanel({
  documentId,
  creatorId,
  collaborators,
  orgMembers,
  isPublic,
  publicToken,
}: {
  documentId: string;
  creatorId: string;
  collaborators: Collaborator[];
  orgMembers: OrgMember[];
  isPublic: boolean;
  publicToken?: string;
}) {
  const { isOpen, toggle, close } = useDocumentActionMenu("share");
  const collaboratorIds = new Set(collaborators.map((c) => c.user._id));
  const available = orgMembers.filter(
    (m) => m.user._id !== creatorId && !collaboratorIds.has(m.user._id),
  );

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
        👥 Share
      </Button>
      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 6px)"
          left="0"
          minW="320px"
          bg="bg.surface"
          border="1px solid"
          borderColor="border.default"
          borderRadius="lg"
          p="3"
          boxShadow="0 8px 24px rgba(0,0,0,0.35)"
          zIndex="10"
        >
          <Flex justify="flex-end" mb="1">
            <CloseButton onClick={close} aria-label="Close share panel" />
          </Flex>
          <Text fontSize="xs" fontWeight="semibold" color="text.muted" mb="2">
            People with access
          </Text>
          {collaborators.length === 0 ? (
            <Text fontSize="xs" color="text.muted" mb="3">
              Only the document owner and org admins can access this so far.
            </Text>
          ) : (
            <Box mb="3">
              {collaborators.map((c) => (
                <CollaboratorRow
                  key={c.user._id}
                  documentId={documentId}
                  collaborator={c}
                />
              ))}
            </Box>
          )}
          <Text fontSize="xs" fontWeight="semibold" color="text.muted" mb="2">
            Add someone
          </Text>
          <AddCollaboratorForm documentId={documentId} available={available} />

          <Box mt="4" pt="3" borderTop="1px solid" borderColor="border.subtle">
            <Text fontSize="xs" fontWeight="semibold" color="text.muted" mb="2">
              Public link
            </Text>
            <PublicLinkSection
              documentId={documentId}
              isPublic={isPublic}
              publicToken={publicToken}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
