export const PLAN_LIMITS = {
  free: { documentsPerCycle: 5, membersAllowed: 1, contactsAllowed: 25 },
  pro: { documentsPerCycle: 100, membersAllowed: 10, contactsAllowed: 500 },
  enterprise: {
    documentsPerCycle: 999999,
    membersAllowed: 999999,
    contactsAllowed: 999999,
  },
} as const;
