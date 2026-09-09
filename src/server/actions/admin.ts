'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/server/db';
import { Organization } from '@/server/models';
import { requireSuperAdmin } from '@/server/data/tenant';
import PLANS from '@/server/config/plans';

export async function updateOrgPlanAction(formData: FormData): Promise<void> {
  await requireSuperAdmin();
  const id = String(formData.get('id') || '');
  const plan = String(formData.get('plan') || '');
  if (!PLANS[plan]) return;

  await connectDB();
  const org = await Organization.findById(id);
  if (org) {
    org.plan = plan as 'free' | 'pro' | 'enterprise';
    org.limits = PLANS[plan].limits;
    await org.save();
  }

  revalidatePath('/admin/orgs');
}

export async function suspendOrgAction(formData: FormData): Promise<void> {
  await requireSuperAdmin();
  const id = String(formData.get('id') || '');

  await connectDB();
  await Organization.findByIdAndUpdate(id, { subscriptionStatus: 'inactive' });

  revalidatePath('/admin/orgs');
}

export async function resetOrgUsageAction(formData: FormData): Promise<void> {
  await requireSuperAdmin();
  const id = String(formData.get('id') || '');

  await connectDB();
  await Organization.findByIdAndUpdate(id, { 'usage.documentsGenerated': 0, 'usage.apiCalls': 0 });

  revalidatePath('/admin/orgs');
}
