"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import connectDB from "@/server/db";
import { Comment, TFDocument } from "@/server/models";
import { requireTenant } from "@/server/data/tenant";
import logActivity from "@/server/utils/activityLogger";
import AppError from "@/server/utils/appError";
import type { ActionState } from "./types";

export async function addCommentAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { user, org } = await requireTenant();
  const documentId = String(formData.get("documentId") || "");
  const body = String(formData.get("body") || "").trim();

  if (!body) return { error: "Comment can't be empty" };
  if (body.length > 2000) return { error: "Comment is too long" };

  try {
    await connectDB();
    const doc = await TFDocument.findOne({
      _id: documentId,
      organization: org._id,
    });
    if (!doc) throw new AppError("Document not found", 404, "NOT_FOUND");

    await Comment.create({
      document: documentId,
      organization: org._id,
      author: user._id,
      authorName: user.name,
      body,
    });
    await logActivity({
      org,
      user,
      action: "COMMENT_ADDED",
      resource: "document",
      meta: { documentId },
    });
  } catch (err) {
    return {
      error: err instanceof AppError ? err.message : "Failed to add comment",
    };
  }

  revalidatePath("/dashboard/documents");
  return { success: "Comment added" };
}

export async function deleteCommentAction(formData: FormData): Promise<void> {
  const { user, org, membership } = await requireTenant();
  const commentId = String(formData.get("commentId") || "");
  const documentId = String(formData.get("documentId") || "");

  try {
    await connectDB();
    const comment = await Comment.findOne({
      _id: commentId,
      organization: org._id,
    });
    if (comment) {
      const doc = await TFDocument.findOne({
        _id: comment.document,
        organization: org._id,
      });
      const isAuthor = comment.author.toString() === user._id.toString();
      const isPrivileged = ["owner", "admin"].includes(membership.role);
      const isDocCreator =
        doc && doc.createdBy.toString() === user._id.toString();
      if (isAuthor || isPrivileged || isDocCreator) {
        await comment.deleteOne();
        await logActivity({
          org,
          user,
          action: "COMMENT_DELETED",
          resource: "document",
          meta: { documentId },
        });
      }
    }
  } catch (err) {
    console.error("deleteCommentAction error:", err);
  }

  revalidatePath("/dashboard/documents");
  redirect(`/dashboard/documents?doc=${documentId}`);
}
