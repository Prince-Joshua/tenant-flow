import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import {
  IUser,
  IOrganization,
  IMembership,
  IDocument,
  IActivityLog,
} from "../types";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: { type: String, enum: ["user", "superadmin"], default: "user" },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "past_due", "canceled", "trialing"],
      default: "active",
    },
    billingCycleEnd: Date,
    usage: {
      documentsGenerated: { type: Number, default: 0 },
      apiCalls: { type: Number, default: 0 },
    },
    limits: {
      documentsPerCycle: { type: Number, default: 5 },
      membersAllowed: { type: Number, default: 1 },
    },
  },
  { timestamps: true },
);

export const Organization =
  (mongoose.models.Organization as mongoose.Model<IOrganization>) ||
  mongoose.model<IOrganization>("Organization", organizationSchema);

const membershipSchema = new Schema<IMembership>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "member"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["active", "invited", "suspended"],
      default: "active",
    },
    inviteToken: String,
    inviteExpires: Date,
  },
  { timestamps: true },
);

membershipSchema.index({ user: 1, organization: 1 }, { unique: true });
export const Membership =
  (mongoose.models.Membership as mongoose.Model<IMembership>) ||
  mongoose.model<IMembership>("Membership", membershipSchema);

const documentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    prompt: String,
    tokensUsed: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const TFDocument =
  (mongoose.models.Document as mongoose.Model<IDocument>) ||
  mongoose.model<IDocument>("Document", documentSchema);

const activityLogSchema = new Schema<IActivityLog>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    userName: String,
    action: { type: String, required: true },
    resource: String,
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const ActivityLog =
  (mongoose.models.ActivityLog as mongoose.Model<IActivityLog>) ||
  mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);
