import "dotenv/config";
import stripe from "../config/stripe";

/**
 * One-time setup script. Run with: npx tsx src/server/scripts/setNigeriaPriceOverride.ts
 *
 * How this works:
 * - Your Pro/Enterprise Stripe Prices are denominated in NGN (your
 *   settlement currency) — that's required for Adaptive Pricing to work
 *   at all. The Price's base `unit_amount` acts as the anchor that
 *   Adaptive Pricing FX-converts into every other customer's local
 *   currency (USD, GBP, EUR, etc.) at Checkout, live.
 * - Because Nigeria's currency (NGN) IS the Price's own currency, Stripe
 *   won't run it through FX conversion at all by default — it would just
 *   show the base `unit_amount` as-is. That's exactly the fixed,
 *   deliberately-set number Nigerian customers should see, so nothing
 *   extra is needed for Nigeria beyond setting the base amount correctly.
 * - Set each plan's `ngnBaseAmount` below to the anchor you want foreign
 *   currencies to be computed FROM (e.g. ~12600 for the NGN equivalent
 *   of $9 at today's rate), and `ngnFixedAmount` to what Nigerian
 *   customers should actually pay (e.g. 10000) — these are allowed to
 *   differ, and each plan has its own pair.
 *
 * NOTE: Stripe Prices are immutable on amount — you cannot edit
 * `unit_amount` on an existing Price. This script creates NEW Price
 * objects on your existing Products and prints the new price IDs; you
 * then update STRIPE_PRO_PRICE_ID / STRIPE_ENTERPRISE_PRICE_ID in your
 * env and redeploy. It does not touch existing subscriptions — those
 * stay on their original Price until customers upgrade/renew onto the
 * new one.
 */

const PLAN_PRICING: {
  envVar: string;
  label: string;
  ngnBaseAmount: number;
  ngnFixedAmount: number;
}[] = [
  {
    envVar: "STRIPE_PRO_PRICE_ID",
    label: "Pro",
    ngnBaseAmount: 12_600_00,
    ngnFixedAmount: 10_000_00,
  },

  {
    envVar: "STRIPE_ENTERPRISE_PRICE_ID",
    label: "Enterprise",
    ngnBaseAmount: 40_600_00,
    ngnFixedAmount: 29_000_00,
  },
];

async function run() {
  for (const { envVar, label, ngnBaseAmount, ngnFixedAmount } of PLAN_PRICING) {
    const existingPriceId = process.env[envVar];
    if (!existingPriceId) {
      console.log(`Skipping ${label} — ${envVar} not set`);
      continue;
    }

    const existingPrice = await stripe.prices.retrieve(existingPriceId);
    if (!existingPrice.recurring) {
      console.log(
        `Skipping ${label} — Price ${existingPriceId} isn't recurring`,
      );
      continue;
    }

    const newPrice = await stripe.prices.create({
      product: existingPrice.product as string,
      currency: "ngn",
      unit_amount: ngnBaseAmount,
      recurring: { interval: existingPrice.recurring.interval },
      currency_options: {
        ngn: { unit_amount: ngnFixedAmount },
      },
    });

    console.log(
      `${label}: created new Price ${newPrice.id} ` +
        `(base ₦${ngnBaseAmount / 100} for FX conversion, ` +
        `₦${ngnFixedAmount / 100} fixed for Nigeria). ` +
        `Update ${envVar}=${newPrice.id} and redeploy.`,
    );
  }

  console.log(
    "\nDon't forget: enable Adaptive Pricing in the Stripe Dashboard " +
      "(Settings → Payments → Adaptive Pricing) for both sandbox and live mode.",
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
