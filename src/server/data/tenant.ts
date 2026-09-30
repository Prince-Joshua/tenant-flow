import "server-only";
import { redirect } from "next/navigation";
import connectDB from "@/server/db";
import { Organization, Membership } from "@/server/models";
import { getCurrentUser } from "./auth";
import { getActiveOrgSlug, hasAdminElevation } from "@/server/session";
import { requireSuperAdminRole } from "@/server/utils/roles";
import type { IUser, IOrganization, IMembership } from "@/server/types";

export interface TenantContext {
  user: IUser;
  org: IOrganization;
  membership: IMembership;
}

export async function requireUser(): Promise<IUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireTenant(): Promise<TenantContext> {
  const user = await requireUser();
  await connectDB();
  const slug = await getActiveOrgSlug();
  if (!slug) redirect("/org-select");

  const org = await Organization.findOne({ slug });
  if (!org) redirect("/org-select");

  const membership = await Membership.findOne({
    user: user._id,
    organization: org._id,
    status: "active",
  });
  if (!membership) redirect("/org-select");

  return { user, org, membership };
}

/** Superadmin role only — used by the password prompt page itself. */
export async function requireSuperAdminNoElevation(): Promise<IUser> {
  const user = await requireUser();
  try {
    requireSuperAdminRole(user);
  } catch {
    redirect("/dashboard");
  }
  return user;
}

/** Superadmin role AND a fresh password re-entry (see /admin-verify). */
export async function requireSuperAdmin(): Promise<IUser> {
  const user = await requireSuperAdminNoElevation();
  if (!(await hasAdminElevation(String(user._id)))) redirect("/admin-verify");
  return user;
}
