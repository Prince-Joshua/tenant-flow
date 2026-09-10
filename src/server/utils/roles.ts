import "server-only";
import type { IUser, IOrganization, IMembership } from "@/server/types";
import AppError from "@/server/utils/appError";

export function requireSuperAdminRole(user: IUser): void {
  if (user.role !== "superadmin") {
    throw new Error("Forbidden: superadmin role required");
  }
}

export function requireRole(
  membership: IMembership,
  ...allowedRoles: IMembership["role"][]
): void {
  if (!allowedRoles.includes(membership.role)) {
    throw new AppError(
      "You do not have permission to perform this action",
      403,
      "FORBIDDEN",
    );
  }
}

export function checkUsage(org: IOrganization, resource: "documents"): void {
  if (
    resource === "documents" &&
    org.usage.documentsGenerated >= org.limits.documentsPerCycle
  ) {
    throw new AppError(
      "Document limit reached. Please upgrade your plan.",
      403,
      "PLAN_LIMIT_REACHED",
    );
  }
}
