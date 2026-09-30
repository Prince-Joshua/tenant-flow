"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/server/db";
import { Notification } from "@/server/models";
import { requireUser, requireTenant, requireSuperAdmin } from "@/server/data/tenant";
import type { ActionState } from "./types";

// Admin-only: broadcasts a notification to every user on the platform.
export async function createAnnouncementAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireSuperAdmin();
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const link = String(formData.get("link") || "").trim();
  if (!title) return { error: "Title is required" };

  await connectDB();
  await Notification.create({
    audience: "global",
    type: "announcement",
    title,
    body: body || undefined,
    link: link || undefined,
    createdBy: admin._id,
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin/announcements");
  return { success: "Announcement published" };
}

export async function markNotificationReadAction(id: string): Promise<void> {
  const user = await requireUser();
  await connectDB();
  await Notification.findByIdAndUpdate(id, {
    $addToSet: { readBy: user._id },
  });
  revalidatePath("/dashboard");
}

export async function markAllNotificationsReadAction(): Promise<void> {
  const { user, org } = await requireTenant();
  await connectDB();
  await Notification.updateMany(
    { $or: [{ audience: "global" }, { audience: "org", organization: org._id }] },
    { $addToSet: { readBy: user._id } },
  );
  revalidatePath("/dashboard");
}
