import type { PlanConfig } from "@tenantflow/types";

const PLANS: Record<string, PlanConfig> = {
  free: {
    name: "Free",
    priceId: process.env.STRIPE_FREE_PRICE_ID,
    limits: { documentsPerCycle: 5, membersAllowed: 1, contactsAllowed: 25 },
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    limits: {
      documentsPerCycle: 100,
      membersAllowed: 10,
      contactsAllowed: 500,
    },
  },
  enterprise: {
    name: "Enterprise",
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    limits: {
      documentsPerCycle: 999999,
      membersAllowed: 999999,
      contactsAllowed: 999999,
    },
  },
};

export default PLANS;
