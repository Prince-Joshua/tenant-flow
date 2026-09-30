"use client";

import { useEffect } from "react";
import { toaster } from "@/components/ui/toaster";

export default function EmailFailedToast({ show }: { show: boolean }) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      toaster.create({
        type: "warning",
        title: "Couldn't send verification email",
        description:
          "Your account was created, but the verification email failed to send. You can request a new one after logging in.",
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [show]);

  return null;
}
