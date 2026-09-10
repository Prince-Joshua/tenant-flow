import type { Document, Types } from "mongoose";

export type ActionState = { error?: string; success?: string } | undefined;

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role: "user" | "superadmin";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

export interface IOrganization extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  owner: Types.ObjectId;
  plan: "free" | "pro" | "enterprise";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus:
    | "active"
    | "inactive"
    | "past_due"
    | "canceled"
    | "trialing";
  billingCycleEnd?: Date;
  usage: {
    documentsGenerated: number;
    apiCalls: number;
  };
  limits: {
    documentsPerCycle: number;
    membersAllowed: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IMembership extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  organization: Types.ObjectId;
  role: "owner" | "admin" | "member";
  status: "active" | "invited" | "suspended";
  inviteToken?: string;
  inviteExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  organization: Types.ObjectId;
  createdBy: Types.ObjectId;
  prompt?: string;
  tokensUsed: number;
  status: "draft" | "active" | "archived";
  isTemplate: boolean;
  pendingContent?: string;
  pendingTokensUsed?: number;
  pendingAt?: Date;
  collaborators: { user: Types.ObjectId; role: "view" | "edit" }[];
  isPublic: boolean;
  publicToken?: string;
  approvalStatus: "draft" | "review" | "approved" | "rejected";
  approvalHistory: {
    action: "submitted" | "approved" | "rejected";
    by: Types.ObjectId;
    byName: string;
    comment?: string;
    at: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivityLog extends Document {
  _id: Types.ObjectId;
  organization: Types.ObjectId;
  user?: Types.ObjectId;
  userName?: string;
  action: string;
  resource?: string;
  meta?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  _id: Types.ObjectId;
  document: Types.ObjectId;
  organization: Types.ObjectId;
  author: Types.ObjectId;
  authorName: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}
