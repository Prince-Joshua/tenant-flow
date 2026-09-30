import "server-only";
import connectDB from "@/server/db";
import { Notification } from "@/server/models";
import type { Types } from "mongoose";
import type { INotification } from "@/server/types";

type NotifyOrgInput = {
  organization: Types.ObjectId | string;
  type: Exclude<INotification["type"], "announcement">;
  title: string;
  body?: string;
  link?: string;
};

// Fire a notification scoped to a single org — only that org's members
// will see it. Call this from wherever the triggering event happens
// (invite accepted, subscription past due, promo campaign, etc).
export async function notifyOrg({
  organization,
  type,
  title,
  body,
  link,
}: NotifyOrgInput): Promise<void> {
  await connectDB();
  await Notification.create({
    audience: "org",
    organization,
    type,
    title,
    body,
    link,
  });
}
