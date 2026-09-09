'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import connectDB from '@/server/db';
import { TFDocument, Organization } from '@/server/models';
import { requireTenant } from '@/server/data/tenant';
import { checkUsage } from '@/server/utils/roles';
import { buildPrompt, generateContent } from '@/server/genai';
import logActivity from '@/server/utils/activityLogger';
import AppError from '@/server/utils/appError';
import type { ActionState } from '../types';

export async function generateDocumentAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const { user, org } = await requireTenant();
  const title = String(formData.get('title') || '').trim();
  const prompt = String(formData.get('prompt') || '').trim();
  const tone = String(formData.get('tone') || 'professional');
  const length = String(formData.get('length') || 'medium');
  if (!title || !prompt) return { error: 'Title and prompt are required' };

  let docId: string;
  try {
    await connectDB();
    checkUsage(org, 'documents');
    const content = await generateContent(buildPrompt(prompt, tone, length));
    const doc = await TFDocument.create({
      title,
      content,
      prompt,
      organization: org._id,
      createdBy: user._id,
      tokensUsed: content.split(' ').length,
    });
    await Organization.findByIdAndUpdate(org._id, { $inc: { 'usage.documentsGenerated': 1 } });
    await logActivity({ org, user, action: 'DOCUMENT_GENERATED', resource: 'document', meta: { documentId: doc._id, title } });
    docId = doc._id.toString();
  } catch (err) {
    return { error: err instanceof AppError ? err.message : 'Generation failed' };
  }

  revalidatePath('/dashboard/documents');
  redirect(`/dashboard/documents?doc=${docId}`);
}

export async function updateDocumentAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const { user, org, membership } = await requireTenant();
  const id = String(formData.get('id') || '');
  const title = String(formData.get('title') || '').trim();
  const content = String(formData.get('content') || '').trim();

  try {
    await connectDB();
    const doc = await TFDocument.findOne({ _id: id, organization: org._id });
    if (!doc) throw new AppError('Document not found', 404, 'NOT_FOUND');
    const isCreator = doc.createdBy.toString() === user._id.toString();
    const isPrivileged = ['owner', 'admin'].includes(membership.role);
    if (!isCreator && !isPrivileged) throw new AppError('Cannot edit this document', 403, 'FORBIDDEN');

    if (title) doc.title = title;
    if (content) doc.content = content;
    await doc.save();
    await logActivity({ org, user, action: 'DOCUMENT_UPDATED', resource: 'document', meta: { documentId: doc._id, title: doc.title } });
  } catch (err) {
    return { error: err instanceof AppError ? err.message : 'Update failed' };
  }

  revalidatePath('/dashboard/documents');
  return { success: 'Document updated' };
}

export async function deleteDocumentAction(formData: FormData): Promise<void> {
  const { user, org, membership } = await requireTenant();
  const id = String(formData.get('id') || '');

  try {
    await connectDB();
    const doc = await TFDocument.findOne({ _id: id, organization: org._id });
    if (doc) {
      const isCreator = doc.createdBy.toString() === user._id.toString();
      const isPrivileged = ['owner', 'admin'].includes(membership.role);
      if (isCreator || isPrivileged) {
        await doc.deleteOne();
        await logActivity({ org, user, action: 'DOCUMENT_DELETED', resource: 'document', meta: { documentId: doc._id, title: doc.title } });
      }
    }
  } catch {
    // Nothing to surface inline for a plain delete button.
  }

  revalidatePath('/dashboard/documents');
  redirect('/dashboard/documents');
}

export async function regenerateDocumentAction(formData: FormData): Promise<void> {
  const { user, org } = await requireTenant();
  const id = String(formData.get('id') || '');

  await connectDB();
  const doc = await TFDocument.findOne({ _id: id, organization: org._id });
  if (doc) {
    const freshOrg = await Organization.findById(org._id);
    if (freshOrg && freshOrg.usage.documentsGenerated < freshOrg.limits.documentsPerCycle) {
      doc.content = await generateContent(doc.prompt || doc.title);
      doc.tokensUsed = doc.content.split(' ').length;
      await doc.save();
      await Organization.findByIdAndUpdate(org._id, { $inc: { 'usage.documentsGenerated': 1 } });
      await logActivity({ org, user, action: 'DOCUMENT_REGENERATED', resource: 'document', meta: { documentId: doc._id } });
    }
  }

  revalidatePath('/dashboard/documents');
  redirect(`/dashboard/documents?doc=${id}`);
}
