import "server-only";
import connectDB from "@/server/db";
import { Notification } from "@/server/models";
import type { Types } from "mongoose";

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
  createdAt: string;
  isRead: boolean;
};

function audienceQuery(orgId?: Types.ObjectId | string | null) {
  return orgId
    ? { $or: [{ audience: "global" }, { audience: "org", organization: orgId }] }
    : { audience: "global" as const };
}

export async function getNotificationsForUser({
  userId,
  orgId,
  limit = 30,
}: {
  userId: Types.ObjectId | string;
  orgId?: Types.ObjectId | string | null;
  limit?: number;
}): Promise<NotificationItem[]> {
  await connectDB();
  const docs = await Notification.find(audienceQuery(orgId))
    .sort({ createdAt: -1 })
    .limit(limit);

  return docs.map((n) => ({
    id: n._id.toString(),
    type: n.type,
    title: n.title,
    body: n.body,
    link: n.link,
    createdAt: n.createdAt.toISOString(),
    isRead: n.readBy.some((id) => id.toString() === userId.toString()),
  }));
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
