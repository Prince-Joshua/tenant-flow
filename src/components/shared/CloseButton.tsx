"use client";

import { Button, ButtonProps } from "@chakra-ui/react";

export function CloseButton({
  "aria-label": ariaLabel = "Close",
  ...props
}: ButtonProps & { "aria-label"?: string }) {
  return (
    <Button
      size="2xs"
      variant="ghost"
      fontSize="xs"
      color="text.muted"
      px="1"
      minW="auto"
      h="auto"
      _hover={{ color: "text.primary", bg: "bg.elevated" }}
      aria-label={ariaLabel}
      {...props}
    >
      ✕
    </Button>
  );
}

export function DetailsCloseButton({
  "aria-label": ariaLabel = "Close",
  ...props
}: ButtonProps & { "aria-label"?: string }) {
  return (
    <CloseButton
      aria-label={ariaLabel}
      onClick={(e) => {
        const details = (e.currentTarget as HTMLElement).closest("details");
        if (details) details.open = false;
      }}
      {...props}
    />
  );
}
