export type UserRole = "user" | "superadmin";
export type Plan = "free" | "pro" | "enterprise";
export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "past_due"
  | "canceled"
  | "trialing";
export type MembershipRole = "owner" | "admin" | "member";
export type MembershipStatus = "active" | "invited" | "suspended";
export type DocumentTone =
  | "professional"
  | "casual"
  | "persuasive"
  | "technical";
export type DocumentLength = "short" | "medium" | "long";

export interface Usage {
  documentsGenerated: number;
  apiCalls: number;
}

export interface Limits {
  documentsPerCycle: number;
  membersAllowed: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  role: UserRole;
}

export interface Organization {
  _id: string;
  name: string;
  slug: string;
  plan: Plan;
  subscriptionStatus: SubscriptionStatus;
  billingCycleEnd?: string;
  usage: Usage;
  limits: Limits;
}

export interface ActiveOrg extends Organization {
  membershipRole: MembershipRole;
}

export interface Membership {
  _id: string;
  user: { _id: string; name: string; email: string };
  organization: Organization;
  role: MembershipRole;
  status: MembershipStatus;
}

export interface TFDocument {
  _id: string;
  title: string;
  content: string;
  prompt?: string;
  tokensUsed: number;
  createdBy: { name: string; email: string };
  createdAt: string;
}

export interface ActivityLog {
  _id: string;
  userName?: string;
  action: string;
  resource?: string;
  meta?: Record<string, unknown>;
  organization?: { name: string; slug: string };
  createdAt: string;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  pdf?: string;
}

export interface PlanConfig {
  name: string;
  priceId: string | undefined;
  limits: Limits;
}
