'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/server/db';
import { User, Membership } from '@/server/models';
import { requireTenant } from '@/server/data/tenant';
import { requireRole } from '@/server/utils/roles';
import { generateRandomToken } from '@/server/utils/tokens';
import { sendInviteEmail } from '@/server/utils/email';
import logActivity from '@/server/utils/activityLogger';
import AppError from '@/server/utils/appError';
import type { ActionState } from './types';

export async function updateOrgAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const { user, org, membership } = await requireTenant();
  const name = String(formData.get('name') || '').trim();
  if (!name) return { error: 'Name is required' };

  try {
    await connectDB();
    requireRole(membership, 'owner', 'admin');
    org.name = name;
    await org.save();
    await logActivity({ org, user, action: 'ORG_UPDATED', resource: 'organization', meta: { newName: name } });
  } catch (err) {
    return { error: err instanceof AppError ? err.message : 'Update failed' };
  }

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard');
  return { success: 'Organization updated' };
}

export async function inviteMemberAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const { user, org, membership: callerMembership } = await requireTenant();
  const email = String(formData.get('email') || '').trim();
  const roleInput = String(formData.get('role') || '');
  if (!email) return { error: 'Email is required' };
  const assignedRole: 'admin' | 'member' = ['admin', 'member'].includes(roleInput) ? (roleInput as 'admin' | 'member') : 'member';

  try {
    await connectDB();
    requireRole(callerMembership, 'owner', 'admin');

    const memberCount = await Membership.countDocuments({ organization: org._id, status: 'active' });
    if (memberCount >= org.limits.membersAllowed) throw new AppError('Member limit reached. Please upgrade.', 403, 'PLAN_LIMIT_REACHED');

    const invitedUser = await User.findOne({ email });
    if (invitedUser) {
      const existing = await Membership.findOne({ user: invitedUser._id, organization: org._id });
      if (existing) throw new AppError('User is already a member', 409, 'CONFLICT');
      const inviteToken = generateRandomToken();
      await Membership.create({
        user: invitedUser._id,
        organization: org._id,
        role: assignedRole,
        status: 'invited',
        inviteToken,
        inviteExpires: new Date(Date.now() + 172800000),
      });
    }
    await sendInviteEmail(email, generateRandomToken(), org.name, user.name);
    await logActivity({ org, user, action: 'MEMBER_INVITED', resource: 'membership', meta: { invitedEmail: email, role: assignedRole } });
  } catch (err) {
    return { error: err instanceof AppError ? err.message : 'Invite failed' };
  }

  revalidatePath('/dashboard/members');
  return { success: `Invite sent to ${email}` };
}

export async function updateMemberRoleAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const { user, org, membership: callerMembership } = await requireTenant();
  const memberId = String(formData.get('memberId') || '');
  const role = String(formData.get('role') || '');
  if (!['admin', 'member'].includes(role)) return { error: 'Invalid role' };

  try {
    await connectDB();
    requireRole(callerMembership, 'owner');
    const membership = await Membership.findOne({ _id: memberId, organization: org._id });
    if (!membership) throw new AppError('Member not found', 404, 'NOT_FOUND');
    if (membership.role === 'owner') throw new AppError('Cannot change owner role', 403, 'FORBIDDEN');
    membership.role = role as 'admin' | 'member';
    await membership.save();
    await logActivity({ org, user, action: 'MEMBER_ROLE_UPDATED', resource: 'membership', meta: { memberId, newRole: role } });
  } catch (err) {
    return { error: err instanceof AppError ? err.message : 'Update failed' };
  }

  revalidatePath('/dashboard/members');
  return { success: 'Role updated' };
}

export async function removeMemberAction(formData: FormData): Promise<void> {
  const { user, org, membership: callerMembership } = await requireTenant();
  const memberId = String(formData.get('memberId') || '');

  try {
    await connectDB();
    requireRole(callerMembership, 'owner', 'admin');
    const membership = await Membership.findOne({ _id: memberId, organization: org._id });
    if (membership && membership.role !== 'owner') {
      await membership.deleteOne();
      await logActivity({ org, user, action: 'MEMBER_REMOVED', resource: 'membership', meta: { memberId } });
    }
  } catch {
    // Permission or lookup failure on a plain delete button — nothing to
    // surface inline for, just leave state unchanged.
  }

  revalidatePath('/dashboard/members');
}
