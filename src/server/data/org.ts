import 'server-only';
import connectDB from '@/server/db';
import { Membership, ActivityLog } from '@/server/models';
import type { IOrganization } from '@/server/types';

export async function getOrgMembers(org: IOrganization) {
  await connectDB();
  return Membership.find({ organization: org._id, status: 'active' }).populate('user', 'name email');
}

export async function getOrgActivity(org: IOrganization, limit = 50) {
  await connectDB();
  return ActivityLog.find({ organization: org._id }).sort({ createdAt: -1 }).limit(limit);
}
