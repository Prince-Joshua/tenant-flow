"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/server/db";
import { Contact } from "@/server/models";
import { requireTenant } from "@/server/data/tenant";
import { requireRole } from "@/server/utils/roles";
import logActivity from "@/server/utils/activityLogger";
import AppError from "@/server/utils/appError";
import type { ActionState } from "./types";

export async function addContactAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { user, org, membership } = await requireTenant();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const note = String(formData.get("note") || "").trim();
  if (!name) return { error: "Name is required" };
  if (!email) return { error: "Email is required" };

  try {
    await connectDB();
    requireRole(membership, "owner", "admin");

    const contactCount = await Contact.countDocuments({
      organization: org._id,
    });
    if (contactCount >= org.limits.contactsAllowed)
      throw new AppError(
        "Contact limit reached. Please upgrade.",
        403,
        "PLAN_LIMIT_REACHED",
      );

    const existing = await Contact.findOne({ organization: org._id, email });
    if (existing) throw new AppError("Contact already saved", 409, "CONFLICT");

    await Contact.create({
      organization: org._id,
      createdBy: user._id,
      name,
      email,
      note: note || undefined,
    });
    await logActivity({
      org,
      user,
      action: "CONTACT_ADDED",
      resource: "contact",
      meta: { email },
    });
  } catch (err) {
    return {
      error: err instanceof AppError ? err.message : "Failed to add contact",
    };
  }

  revalidatePath("/dashboard/contacts");
  return { success: `${name} added to contacts` };
}

export async function removeContactAction(formData: FormData): Promise<void> {
  const { user, org, membership } = await requireTenant();
  const contactId = String(formData.get("contactId") || "");

  try {
    await connectDB();
    requireRole(membership, "owner", "admin");
    const contact = await Contact.findOne({
      _id: contactId,
      organization: org._id,
    });
    if (contact) {
      await contact.deleteOne();
      await logActivity({
        org,
        user,
        action: "CONTACT_REMOVED",
        resource: "contact",
        meta: { contactId },
      });
    }
  } catch {
    // Permission or lookup failure on a plain delete button — nothing to
    // surface inline for, just leave state unchanged.
  }

  revalidatePath("/dashboard/contacts");
}
