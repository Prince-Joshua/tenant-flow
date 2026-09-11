/**
 * Single source of truth for plan pricing — imported by both the Stripe
 * setup script (setPlanPricing.ts) and the billing page, so the numbers
 * shown to users can't drift from what's actually configured on Stripe.
 *
 * Two Prices per plan:
 * - usdAnchorAmount (cents) — denominated in USD, our actual settlement
 *   currency. Required to match a settlement currency for Adaptive
 *   Pricing to activate. Stripe converts this live into whatever
 *   currency a non-Nigerian customer's location calls for.
 * - ngnFixedAmount (kobo) — a separate, fixed-price NGN Price used only
 *   for Nigerian customers. Not part of Adaptive Pricing at all; Stripe
 *   settles it back to USD automatically like any other-currency charge.
 *
 * `display` (major units) is for rendering only. The USD figure is the
 * real, exact anchor amount — not an estimate. Everything else (GBP,
 * EUR, ...) is still a live conversion at checkout, so keep those
 * roughly in sync by hand as rates move; NGN is exact since it's fixed.
 */

export type DisplayCurrency = "usd" | "gbp" | "eur" | "ngn";
export type PlanKey = "pro" | "enterprise";

export const PLAN_PRICING: Record<
  PlanKey,
  {
    usdAnchorAmount: number; // cents — the real USD Price amount
    ngnFixedAmount: number; // kobo — exact, fixed Nigeria price
    display: Record<DisplayCurrency, number>; // major units, for UI display only
  }
> = {
  pro: {
    usdAnchorAmount: 9_00,
    ngnFixedAmount: 10_000_00,
    display: { ngn: 10_000, usd: 9, gbp: 7, eur: 8 },
  },
  enterprise: {
    usdAnchorAmount: 29_00,
    ngnFixedAmount: 29_000_00,
    display: { ngn: 29_000, usd: 29, gbp: 23, eur: 27 },
  },
};
