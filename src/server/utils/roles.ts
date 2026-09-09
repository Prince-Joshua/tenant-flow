import 'server-only';
import type { IUser, IOrganization, IMembership } from '@/server/types';
import AppError from '@/server/utils/appError';

/** Throws if the given user isn't a superadmin. Called from
 * `requireSuperAdmin()` in `@/server/data/tenant`, which catches the throw
 * and redirects — kept as a plain guard (rather than returning a boolean)
 * so callers can't accidentally ignore the check.
 *
 * Lives outside `@/server/auth` on purpose: that file has a top-level
 * `'use server'` directive, which requires every export to be an async
 * Server Action. This is a plain sync helper, not something callable from
 * the client. */
export function requireSuperAdminRole(user: IUser): void {
  if (user.role !== 'superadmin') {
    throw new Error('Forbidden: superadmin role required');
  }
}

/** Throws an `AppError` (caught by each action's `err instanceof AppError`
 * handling) unless the caller's membership role is one of `allowedRoles`.
 * Same reasoning as `requireSuperAdminRole` above for living here instead
 * of in `@/server/auth`. */
export function requireRole(membership: IMembership, ...allowedRoles: IMembership['role'][]): void {
  if (!allowedRoles.includes(membership.role)) {
    throw new AppError('You do not have permission to perform this action', 403, 'FORBIDDEN');
  }
}

/** Throws an `AppError` if the org has hit its plan limit for `resource`.
 * Only 'documents' is wired up for now — mirrors the same check
 * `regenerateDocumentAction` does inline against
 * `usage.documentsGenerated` / `limits.documentsPerCycle`. */
export function checkUsage(org: IOrganization, resource: 'documents'): void {
  if (resource === 'documents' && org.usage.documentsGenerated >= org.limits.documentsPerCycle) {
    throw new AppError('Document limit reached. Please upgrade your plan.', 403, 'PLAN_LIMIT_REACHED');
  }
}
