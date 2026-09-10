"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import connectDB from "@/server/db";
import { TFDocument, Organization } from "@/server/models";
import { requireTenant } from "@/server/data/tenant";
import { checkUsage } from "@/server/utils/roles";
import { buildPrompt, generateContent } from "@/server/genai";
import logActivity from "@/server/utils/activityLogger";
import AppError from "@/server/utils/appError";
import type { IDocument, IOrganization, IUser, IMembership } from "@/server/types";
import type { ActionState } from "./types";

async function getAuthorizedDocument(
  org: IOrganization,
  user: IUser,
  membership: IMembership,
  id: string,
) {
  const doc = await TFDocument.findOne({ _id: id, organization: org._id });
  if (!doc) throw new AppError("Document not found", 404, "NOT_FOUND");
  const isCreator = doc.createdBy.toString() === user._id.toString();
  const isPrivileged = ["owner", "admin"].includes(membership.role);
  if (!isCreator && !isPrivileged)
    throw new AppError("Cannot modify this document", 403, "FORBIDDEN");
  return doc;
}

export async function generateDocumentAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { user, org } = await requireTenant();
  const title = String(formData.get("title") || "").trim();
  const prompt = String(formData.get("prompt") || "").trim();
  const tone = String(formData.get("tone") || "professional");
  const length = String(formData.get("length") || "medium");
  const asDraft = formData.get("asDraft") === "on";
  const templateId = String(formData.get("templateId") || "");
  if (!title || !prompt) return { error: "Title and prompt are required" };

  let docId: string;
  try {
    await connectDB();
    checkUsage(org, "documents");

    let effectivePrompt = prompt;
    if (templateId) {
      const template = await TFDocument.findOne({
        _id: templateId,
        organization: org._id,
        isTemplate: true,
      });
      if (template) {
        effectivePrompt = `Use the following template as a structural guide:\n\n${template.content}\n\nNow write: ${prompt}`;
      }
    }

    const content = await generateContent(buildPrompt(effectivePrompt, tone, length));
    const doc = await TFDocument.create({
      title,
      content,
      prompt,
      organization: org._id,
      createdBy: user._id,
      tokensUsed: content.split(" ").length,
      status: asDraft ? "draft" : "active",
    });
    await Organization.findByIdAndUpdate(org._id, {
      $inc: { "usage.documentsGenerated": 1 },
    });
    await logActivity({
      org,
      user,
      action: "DOCUMENT_GENERATED",
      resource: "document",
      meta: { documentId: doc._id, title, status: doc.status },
    });
    docId = doc._id.toString();
  } catch (err) {
    console.error("generateDocumentAction error:", err);
    return {
      error: err instanceof AppError ? err.message : "Generation failed",
    };
  }

  revalidatePath("/dashboard/documents");
  redirect(`/dashboard/documents?doc=${docId}`);
}

export async function updateDocumentAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { user, org, membership } = await requireTenant();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const status = String(formData.get("status") || "");

  try {
    await connectDB();
    const doc = await getAuthorizedDocument(org, user, membership, id);

    if (title) doc.title = title;
    if (content) doc.content = content;
    if (status && ["draft", "active", "archived"].includes(status)) {
      doc.status = status as IDocument["status"];
    }
    await doc.save();
    await logActivity({
      org,
      user,
      action: "DOCUMENT_UPDATED",
      resource: "document",
      meta: { documentId: doc._id, title: doc.title },
    });
  } catch (err) {
    return { error: err instanceof AppError ? err.message : "Update failed" };
  }

  revalidatePath("/dashboard/documents");
  return { success: "Document updated" };
}

export async function renameDocumentAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { user, org, membership } = await requireTenant();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "Title cannot be empty" };

  try {
    await connectDB();
    const doc = await getAuthorizedDocument(org, user, membership, id);
    const previousTitle = doc.title;
    doc.title = title;
    await doc.save();
    await logActivity({
      org,
      user,
      action: "DOCUMENT_RENAMED",
      resource: "document",
      meta: { documentId: doc._id, from: previousTitle, to: title },
    });
  } catch (err) {
    return { error: err instanceof AppError ? err.message : "Rename failed" };
  }

  revalidatePath("/dashboard/documents");
  return { success: "Document renamed" };
}

export async function duplicateDocumentAction(formData: FormData): Promise<void> {
  const { user, org, membership } = await requireTenant();
  const id = String(formData.get("id") || "");

  let newId: string | null = null;
  try {
    await connectDB();
    const doc = await getAuthorizedDocument(org, user, membership, id);
    const copy = await TFDocument.create({
      title: `${doc.title} (copy)`,
      content: doc.content,
      prompt: doc.prompt,
      organization: org._id,
      createdBy: user._id,
      tokensUsed: doc.tokensUsed,
      status: "draft",
      isTemplate: false,
    });
    await logActivity({
      org,
      user,
      action: "DOCUMENT_DUPLICATED",
      resource: "document",
      meta: { sourceId: doc._id, documentId: copy._id },
    });
    newId = copy._id.toString();
  } catch (err) {
    console.error("duplicateDocumentAction error:", err);
  }

  revalidatePath("/dashboard/documents");
  redirect(newId ? `/dashboard/documents?doc=${newId}` : "/dashboard/documents");
}

export async function archiveDocumentAction(formData: FormData): Promise<void> {
  const { user, org, membership } = await requireTenant();
  const id = String(formData.get("id") || "");

  try {
    await connectDB();
    const doc = await getAuthorizedDocument(org, user, membership, id);
    doc.status = "archived";
    await doc.save();
    await logActivity({
      org,
      user,
      action: "DOCUMENT_ARCHIVED",
      resource: "document",
      meta: { documentId: doc._id, title: doc.title },
    });
  } catch (err) {
    console.error("archiveDocumentAction error:", err);
  }

  revalidatePath("/dashboard/documents");
  redirect("/dashboard/documents");
}

export async function restoreDocumentAction(formData: FormData): Promise<void> {
  const { user, org, membership } = await requireTenant();
  const id = String(formData.get("id") || "");

  try {
    await connectDB();
    const doc = await getAuthorizedDocument(org, user, membership, id);
    doc.status = "active";
    await doc.save();
    await logActivity({
      org,
      user,
      action: "DOCUMENT_RESTORED",
      resource: "document",
      meta: { documentId: doc._id, title: doc.title },
    });
  } catch (err) {
    console.error("restoreDocumentAction error:", err);
  }

  revalidatePath("/dashboard/documents");
  redirect("/dashboard/documents?status=archived");
}

// Hard delete. Kept separate from archive — this permanently removes the
// document and cannot be undone.
export async function deleteDocumentAction(formData: FormData): Promise<void> {
  const { user, org, membership } = await requireTenant();
  const id = String(formData.get("id") || "");

  try {
    await connectDB();
    const doc = await TFDocument.findOne({ _id: id, organization: org._id });
    if (doc) {
      const isCreator = doc.createdBy.toString() === user._id.toString();
      const isPrivileged = ["owner", "admin"].includes(membership.role);
      if (isCreator || isPrivileged) {
        await doc.deleteOne();
        await logActivity({
          org,
          user,
          action: "DOCUMENT_DELETED",
          resource: "document",
          meta: { documentId: doc._id, title: doc.title },
        });
      }
    }
  } catch {
    // Nothing to surface inline for a plain delete button.
  }

  revalidatePath("/dashboard/documents");
  redirect("/dashboard/documents");
}

export async function regenerateDocumentAction(
  formData: FormData,
): Promise<void> {
  const { user, org } = await requireTenant();
  const id = String(formData.get("id") || "");

  await connectDB();
  const doc = await TFDocument.findOne({ _id: id, organization: org._id });
  if (doc) {
    const freshOrg = await Organization.findById(org._id);
    if (
      freshOrg &&
      freshOrg.usage.documentsGenerated < freshOrg.limits.documentsPerCycle
    ) {
      doc.content = await generateContent(doc.prompt || doc.title);
      doc.tokensUsed = doc.content.split(" ").length;
      await doc.save();
      await Organization.findByIdAndUpdate(org._id, {
        $inc: { "usage.documentsGenerated": 1 },
      });
      await logActivity({
        org,
        user,
        action: "DOCUMENT_REGENERATED",
        resource: "document",
        meta: { documentId: doc._id },
      });
    }
  }

  revalidatePath("/dashboard/documents");
  redirect(`/dashboard/documents?doc=${id}`);
}

export async function saveAsTemplateAction(formData: FormData): Promise<void> {
  const { user, org, membership } = await requireTenant();
  const id = String(formData.get("id") || "");

  try {
    await connectDB();
    const doc = await getAuthorizedDocument(org, user, membership, id);
    doc.isTemplate = true;
    await doc.save();
    await logActivity({
      org,
      user,
      action: "DOCUMENT_SAVED_AS_TEMPLATE",
      resource: "document",
      meta: { documentId: doc._id, title: doc.title },
    });
  } catch (err) {
    console.error("saveAsTemplateAction error:", err);
  }

  revalidatePath("/dashboard/documents");
  redirect("/dashboard/documents");
}

export async function createFromTemplateAction(formData: FormData): Promise<void> {
  const { user, org } = await requireTenant();
  const templateId = String(formData.get("templateId") || "");

  let newId: string | null = null;
  try {
    await connectDB();
    const template = await TFDocument.findOne({
      _id: templateId,
      organization: org._id,
      isTemplate: true,
    });
    if (template) {
      const doc = await TFDocument.create({
        title: `${template.title} (from template)`,
        content: template.content,
        prompt: template.prompt,
        organization: org._id,
        createdBy: user._id,
        tokensUsed: template.tokensUsed,
        status: "draft",
        isTemplate: false,
      });
      await logActivity({
        org,
        user,
        action: "DOCUMENT_CREATED_FROM_TEMPLATE",
        resource: "document",
        meta: { templateId: template._id, documentId: doc._id },
      });
      newId = doc._id.toString();
    }
  } catch (err) {
    console.error("createFromTemplateAction error:", err);
  }

  revalidatePath("/dashboard/documents");
  redirect(newId ? `/dashboard/documents?doc=${newId}` : "/dashboard/documents");
}
