import type { CSSProperties } from "react";

export const inputStyle = {
  bg: "bg.elevated",
  border: "1px solid",
  borderColor: "border.default",
  color: "text.primary",
  borderRadius: "lg",
  _placeholder: { color: "text.muted" },
  _focus: {
    borderColor: "violet.500",
    boxShadow: "0 0 0 3px rgba(139,92,246,0.2)",
  },
} as const;

export const selectStyle = {
  ...inputStyle,
  style: { appearance: "none" as const },
};


export const nativeSelectCss: CSSProperties = {
  appearance: "none",
  background: "#161b26",
  border: "1px solid #2a2f3a",
  color: "#e5e7eb",
  borderRadius: "8px",
  padding: "6px 10px",
  fontSize: "13px",
};
