// Shared card look — matches the homepage feature/preview cards.
export const cardProps = {
  bg: "bg.surface",
  border: "1px solid",
  borderColor: "border.subtle",
  borderRadius: "xl",
  boxShadow: "0 24px 60px -24px rgba(0,0,0,0.55)",
  backgroundImage:
    "linear-gradient(180deg, rgba(139,92,246,0.05) 0%, rgba(139,92,246,0) 45%)",
} as const;

// Page backdrop: canvas colour plus the soft violet/blue glow used on the homepage.
export const backdropProps = {
  bg: "bg.canvas",
  backgroundImage:
    "radial-gradient(700px circle at 85% -5%, rgba(139,92,246,0.10), transparent 60%), radial-gradient(500px circle at 20% 110%, rgba(56,189,248,0.05), transparent 60%)",
  backgroundAttachment: "fixed",
} as const;
