import "dotenv/config";
import stripe from "../config/stripe";
import { PLAN_PRICING } from "../config/pricing";

const PLAN_ENV_VARS: {
  label: string;
  plan: keyof typeof PLAN_PRICING;
  usdEnvVar: string;
  ngEnvVar: string;
}[] = [
  {
    label: "Pro",
    plan: "pro",
    usdEnvVar: "STRIPE_PRO_PRICE_ID",
    ngEnvVar: "STRIPE_PRO_PRICE_ID_NG",
  },
  {
    label: "Enterprise",
    plan: "enterprise",
    usdEnvVar: "STRIPE_ENTERPRISE_PRICE_ID",
    ngEnvVar: "STRIPE_ENTERPRISE_PRICE_ID_NG",
  },
];

async function run() {
  const account = await stripe.accounts.retrieve(null);
  if (account.default_currency !== "usd") {
    console.log(
      `Warning: your Stripe account's default_currency is "${account.default_currency}", not "usd". ` +
        `This script assumes USD is a settlement currency on your account — double check in the ` +
        `Dashboard (Settings → Balance → Payout details) before proceeding, or Adaptive Pricing won't activate.`,
    );
  }

  for (const { label, plan, usdEnvVar, ngEnvVar } of PLAN_ENV_VARS) {
    const { usdAnchorAmount, ngnFixedAmount } = PLAN_PRICING[plan];
    // Either existing env var works as the source of the Product ID —
    // both Prices for a plan must live on the same Stripe Product.
    const existingPriceId = process.env[usdEnvVar] || process.env[ngEnvVar];
    if (!existingPriceId) {
      console.log(
        `Skipping ${label} — set ${usdEnvVar} (or ${ngEnvVar}) to an existing Price ID first, so we know the Product`,
      );
      continue;
    }

    const existingPrice = await stripe.prices.retrieve(existingPriceId);
    const product = existingPrice.product as string;
    const interval = existingPrice.recurring?.interval;
    if (!interval) {
      console.log(
        `Skipping ${label} — Price ${existingPriceId} isn't recurring`,
      );
      continue;
    }

    const usdPrice = await stripe.prices.create({
      product,
      currency: "usd",
      unit_amount: usdAnchorAmount,
      recurring: { interval },
    });

    const ngPrice = await stripe.prices.create({
      product,
      currency: "ngn",
      unit_amount: ngnFixedAmount,
      recurring: { interval },
    });

    console.log(
      `${label}:\n` +
        `  ${usdEnvVar}=${usdPrice.id}  ($${usdAnchorAmount / 100} — FX-converted for non-Nigerian customers)\n` +
        `  ${ngEnvVar}=${ngPrice.id}  (₦${ngnFixedAmount / 100} fixed — Nigerian customers only)\n`,
    );
  }

  console.log(
    "Set the env vars printed above and redeploy.\n" +
      "Don't forget: enable Adaptive Pricing in the Stripe Dashboard " +
      "(Settings → Payments → Adaptive Pricing) for both sandbox and live mode.",
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
