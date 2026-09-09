import 'server-only';
import connectDB from '@/server/db';
import stripe from '@/server/config/stripe';
import PLANS from '@/server/config/plans';
import type { IOrganization } from '@/server/types';

export async function getBillingInfo(org: IOrganization) {
  await connectDB();
  let invoices: { id: string; amount: number; currency: string; status: string | null; date: Date; pdf: string | null }[] = [];
  if (org.stripeCustomerId) {
    const stripeInvoices = await stripe.invoices.list({ customer: org.stripeCustomerId, limit: 5 });
    invoices = stripeInvoices.data.map((inv) => ({
      id: inv.id,
      amount: inv.amount_paid / 100,
      currency: inv.currency,
      status: inv.status,
      date: new Date(inv.created * 1000),
      pdf: inv.invoice_pdf ?? null,
    }));
  }

  return {
    plan: org.plan,
    subscriptionStatus: org.subscriptionStatus,
    billingCycleEnd: org.billingCycleEnd,
    usage: org.usage,
    limits: org.limits,
    invoices,
    plans: PLANS,
  };
}
