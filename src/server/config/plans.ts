import type { PlanConfig } from "@tenantflow/types";
import { PLAN_LIMITS } from "./planLimits";

// ngPriceId is the fixed-naira Price created by `pnpm setup-ngn-pricing`.
type PlanWithNg = PlanConfig & { ngPriceId?: string };

const PLANS: Record<string, PlanWithNg> = {
  free: {
    name: "Free",
    priceId: process.env.STRIPE_FREE_PRICE_ID,
    limits: { ...PLAN_LIMITS.free },
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    ngPriceId: process.env.STRIPE_PRO_PRICE_ID_NG,
    limits: { ...PLAN_LIMITS.pro },
  },
  enterprise: {
    name: "Enterprise",
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    ngPriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID_NG,
    limits: { ...PLAN_LIMITS.enterprise },
  },
};

export default PLANS;
