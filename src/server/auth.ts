"use server";

import { redirect } from "next/navigation";
import connectDB from "@/server/db";
import { User, Organization, Membership } from "@/server/models";
import {
  createSession,
  destroySession,
  setActiveOrgCookie,
} from "@/server/session";
import { generateRandomToken } from "@/server/utils/tokens";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "@/server/utils/email";
import { getCurrentUser } from "@/server/data/auth";
import PLANS from "@/server/config/plans";
import type { ActionState } from "./types";

const generateSlug = (name: string): string =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "") +
  "-" +
  Math.random().toString(36).slice(2, 6);

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Email and password required" };

  let userId: string;
  try {
    await connectDB();
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return { error: "Invalid email or password" };
    userId = user._id.toString();
  } catch {
    return { error: "Something went wrong. Please try again." };
  }

  await createSession(userId);

  const memberships = await Membership.find({ user: userId, status: "active" });
  if (memberships.length === 1) {
    const org = await Organization.findById(memberships[0].organization);
    if (org) await setActiveOrgCookie(org.slug);
    redirect("/dashboard");
  }
  redirect("/org-select");
}

export async function registerAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const orgName = String(formData.get("orgName") || "").trim();
  if (!name || !email || !password || !orgName)
    return { error: "All fields are required" };

  try {
    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) return { error: "Email already in use" };

    const verificationToken = generateRandomToken();
    const user = await User.create({
      name,
      email,
      password,
      emailVerificationToken: verificationToken,
    });
    const slug = generateSlug(orgName);
    const org = await Organization.create({
      name: orgName,
      slug,
      owner: user._id,
      plan: "free",
      limits: PLANS.free.limits,
    });
    await Membership.create({
      user: user._id,
      organization: org._id,
      role: "owner",
      status: "active",
    });
    await sendVerificationEmail(email, verificationToken);
  } catch {
    return { error: "Registration failed. Please try again." };
  }

  redirect("/login?registered=1");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}

export async function forgotPasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") || "").trim();
  if (!email) return { error: "Email is required" };

  try {
    await connectDB();
    const user = await User.findOne({ email });
    if (user) {
      const resetToken = generateRandomToken();
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = new Date(Date.now() + 3600000);
      await user.save();
      await sendPasswordResetEmail(email, resetToken);
    }
  } catch {}

  return { success: "If that email exists, a reset link has been sent." };
}

export async function resetPasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");
  if (!token) return { error: "Reset link is missing its token" };
  if (password.length < 6)
    return { error: "Password must be at least 6 characters" };
  if (password !== confirm) return { error: "Passwords do not match" };

  try {
    await connectDB();
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) return { error: "Invalid or expired reset token" };
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  } catch {
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/login?reset=1");
}

export async function selectOrgAction(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") || "");
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  await connectDB();
  const org = await Organization.findOne({ slug });
  if (!org) redirect("/org-select");
  const membership = await Membership.findOne({
    user: currentUser._id,
    organization: org._id,
    status: "active",
  });
  if (!membership) redirect("/org-select");

  await setActiveOrgCookie(slug);
  redirect("/dashboard");
}

/** Called directly (not as a form action) from the /verify-email page's
 * Server Component — a GET link click that performs a direct write. */
export async function verifyEmailToken(
  token: string,
): Promise<{ ok: boolean }> {
  if (!token) return { ok: false };
  try {
    await connectDB();
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) return { ok: false };
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function acceptInviteToken(
  token: string,
): Promise<{ ok: boolean }> {
  if (!token) return { ok: false };
  try {
    await connectDB();
    const membership = await Membership.findOne({
      inviteToken: token,
      inviteExpires: { $gt: Date.now() },
      status: "invited",
    });
    if (!membership) return { ok: false };
    membership.status = "active";
    membership.inviteToken = undefined;
    membership.inviteExpires = undefined;
    await membership.save();
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
