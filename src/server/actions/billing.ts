'use server';

import { redirect } from 'next/navigation';
import connectDB from '@/server/db';
import stripe from '@/server/config/stripe';
import PLANS from '@/server/config/plans';
import { requireTenant } from '@/server/data/tenant';
import { requireRole } from '@/server/utils/roles';
import AppError from '@/server/utils/appError';

/** Bound directly to a plain `<form action={createCheckoutAction}>` (no
 * `useFormState`), so on failure it redirects back with a `?error=` query
 * param instead of returning an `ActionState`. */
export async function createCheckoutAction(formData: FormData): Promise<void> {
  const { user, org, membership } = await requireTenant();
  const plan = String(formData.get('plan') || '');

  let url: string | null;
  try {
    await connectDB();
    requireRole(membership, 'owner');
    if (!PLANS[plan] || plan === 'free') throw new AppError('Invalid plan', 400, 'VALIDATION_ERROR');

    let customerId = org.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, name: org.name, metadata: { orgId: org._id.toString() } });
      customerId = customer.id;
      org.stripeCustomerId = customerId;
      await org.save();
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: PLANS[plan].priceId as string, quantity: 1 }],
      metadata: { orgId: org._id.toString(), plan },
      success_url: `${process.env.APP_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.APP_URL}/dashboard/billing?canceled=true`,
    });
    url = session.url;
  } catch (err) {
    const message = err instanceof AppError ? err.message : 'Could not start checkout';
    redirect(`/dashboard/billing?error=${encodeURIComponent(message)}`);
  }

  redirect(url || '/dashboard/billing?error=Could%20not%20start%20checkout');
}

export async function createPortalAction(): Promise<void> {
  const { org, membership } = await requireTenant();

  let url: string;
  try {
    await connectDB();
    requireRole(membership, 'owner');
    if (!org.stripeCustomerId) throw new AppError('No billing account found', 400, 'NOT_FOUND');
    const session = await stripe.billingPortal.sessions.create({ customer: org.stripeCustomerId, return_url: `${process.env.APP_URL}/dashboard/billing` });
    url = session.url;
  } catch (err) {
    const message = err instanceof AppError ? err.message : 'Could not open billing portal';
    redirect(`/dashboard/billing?error=${encodeURIComponent(message)}`);
  }

  redirect(url);
}
