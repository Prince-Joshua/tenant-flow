"use client";

import { Button } from "@chakra-ui/react";

export function LoadMoreButton({
  onClick,
  loading,
  label = "Load more",
}: {
  onClick: () => void;
  loading: boolean;
  label?: string;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      variant="ghost"
      size="sm"
      w="full"
      color="violet.400"
      fontWeight="medium"
      borderRadius="lg"
      _hover={{ bg: "brand.subtle", color: "violet.300" }}
    >
      {loading ? "Loading…" : label}
    </Button>
  );
}
