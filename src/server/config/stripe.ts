import Stripe from "stripe";

/**
 * Pricing model: each paid plan has TWO Prices:
 *
 * 1. STRIPE_*_PRICE_ID — a USD Price (USD is our actual Stripe
 *    settlement currency). With Adaptive Pricing enabled (Dashboard →
 *    Settings → Payments → Adaptive Pricing), Stripe converts this into
 *    whatever currency a non-Nigerian customer's location calls for,
 *    live, at Checkout.
 * 2. STRIPE_*_PRICE_ID_NG — a separate, fixed NGN Price used only for
 *    Nigerian customers. Not part of Adaptive Pricing; Stripe settles
 *    it back to USD automatically like any other-currency charge.
 *
 * createCheckoutAction picks between them based on the customer's
 * server-detected country (src/server/geo/getUserCountry.ts) — never
 * from client input. See src/server/scripts/setPlanPricing.ts for how
 * both Prices get created, and src/server/config/pricing.ts for the
 * shared source of truth on amounts.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default stripe;
