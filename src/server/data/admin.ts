import 'server-only';
import connectDB from '@/server/db';
import { User, Organization, Membership, TFDocument, ActivityLog } from '@/server/models';

export async function getAdminStats() {
  await connectDB();
  const [totalUsers, totalOrgs, totalDocuments, planBreakdown, recentOrgs, recentUsers] = await Promise.all([
    User.countDocuments(),
    Organization.countDocuments(),
    TFDocument.countDocuments(),
    Organization.aggregate([{ $group: { _id: '$plan', count: { $sum: 1 } } }]),
    Organization.find().sort({ createdAt: -1 }).limit(5).populate('owner', 'name email'),
    User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt isEmailVerified role'),
  ]);

  const plans: Record<string, number> = { free: 0, pro: 0, enterprise: 0 };
  planBreakdown.forEach((p: { _id: string; count: number }) => {
    if (plans[p._id] !== undefined) plans[p._id] = p.count;
  });

  return { stats: { totalUsers, totalOrgs, totalDocuments, plans }, recentOrgs, recentUsers };
}

export async function getAllOrgs({ page = 1, limit = 20, search = '', plan = '' }: { page?: number; limit?: number; search?: string; plan?: string } = {}) {
  await connectDB();
  const query = { ...(search && { name: { $regex: search, $options: 'i' } }), ...(plan && { plan }) };

  const [orgs, total] = await Promise.all([
    Organization.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('owner', 'name email'),
    Organization.countDocuments(query),
  ]);

  const organizations = await Promise.all(
    orgs.map(async (org) => {
      const [memberCount, documentCount] = await Promise.all([
        Membership.countDocuments({ organization: org._id, status: 'active' }),
        TFDocument.countDocuments({ organization: org._id }),
      ]);
      return { ...org.toObject(), memberCount, documentCount };
    })
  );

  return { organizations, pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 } };
}

export async function getAllUsers({ page = 1, limit = 20, search = '' }: { page?: number; limit?: number; search?: string } = {}) {
  await connectDB();
  const query = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).select('-password'),
    User.countDocuments(query),
  ]);
  return { users, pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 } };
}

export async function getPlatformActivity(limit = 50) {
  await connectDB();
  return ActivityLog.find().sort({ createdAt: -1 }).limit(limit).populate('organization', 'name slug');
}
