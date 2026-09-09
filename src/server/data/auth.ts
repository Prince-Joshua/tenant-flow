import 'server-only';
import connectDB from '@/server/db';
import { User, Membership } from '@/server/models';
import { getSessionUserId } from '@/server/session';
import type { IUser } from '@/server/types';

/** Loads the signed-in user straight from Mongo — the replacement for the
 * old `getAuthUser(req)` + `useGetMeQuery()` combo. Returns `null` instead
 * of throwing so callers (Server Components, layouts) can decide whether
 * to redirect. */
export async function getCurrentUser(): Promise<IUser | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  await connectDB();
  const user = await User.findById(userId).select('-password');
  return user;
}

export async function getCurrentUserWithMemberships() {
  const user = await getCurrentUser();
  if (!user) return null;
  const memberships = await Membership.find({ user: user._id, status: 'active' }).populate(
    'organization',
    'name slug plan usage limits'
  );
  return { user, memberships };
}
