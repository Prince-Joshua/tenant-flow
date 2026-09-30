import "server-only";
import connectDB from "@/server/db";
import { Notification } from "@/server/models";
import type { Types } from "mongoose";
import {
  cursorFilter,
  cursorSort,
  encodeCursor,
  toCursorPage,
} from "@/lib/cursor";

export const NOTIFICATIONS_PAGE_SIZE = 30;

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
  createdAt: string;
  isRead: boolean;
  cursor: string;
};

function audienceQuery(
  orgId?: Types.ObjectId | string | null
): Record<string, any> {
  return orgId
    ? { $or: [{ audience: "global" }, { audience: "org", organization: orgId }] }
    : { audience: "global" };
}

function toItem(n: any, userId: Types.ObjectId | string): NotificationItem {
  return {
    id: n._id.toString(),
    type: n.type,
    title: n.title,
    body: n.body,
    link: n.link,
    createdAt: n.createdAt.toISOString(),
    isRead: (n.readBy ?? []).some(
      (id: Types.ObjectId) => id.toString() === userId.toString(),
    ),
    cursor: encodeCursor(n.createdAt, n._id.toString()),
  };
}

/** One page of notifications, newest first, cursor-paginated. */
export async function getNotificationsPage({
  userId,
  orgId,
  cursor,
  limit = NOTIFICATIONS_PAGE_SIZE,
}: {
  userId: Types.ObjectId | string;
  orgId?: Types.ObjectId | string | null;
  cursor?: string | null;
  limit?: number;
}): Promise<{ items: NotificationItem[]; nextCursor: string | null }> {
  await connectDB();
  const after = cursorFilter(cursor);
  const rows = await Notification.find(
    after ? { $and: [audienceQuery(orgId), after] } : audienceQuery(orgId),
  )
    .sort(cursorSort(-1))
    .limit(limit + 1);
  const { items, nextCursor } = toCursorPage(rows as any[], limit);
  return { items: items.map((n) => toItem(n, userId)), nextCursor };
}

export async function getNotificationsForUser({
  userId,
  orgId,
  limit = NOTIFICATIONS_PAGE_SIZE,
}: {
  userId: Types.ObjectId | string;
  orgId?: Types.ObjectId | string | null;
  limit?: number;
}): Promise<NotificationItem[]> {
  return (await getNotificationsPage({ userId, orgId, limit })).items;
}

// Admin listing of past global announcements — no per-user read state.
export async function getGlobalAnnouncements(limit = 30) {
  await connectDB();
  return Notification.find({ audience: "global" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("createdBy", "name email");
}

export async function getUnreadNotificationCount({
  userId,
  orgId,
}: {
  userId: Types.ObjectId | string;
  orgId?: Types.ObjectId | string | null;
}): Promise<number> {
  await connectDB();
  return Notification.countDocuments({
    ...audienceQuery(orgId),
    readBy: { $ne: userId },
  });
}
