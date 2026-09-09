import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/server/db';
import stripe from '@/server/config/stripe';
import { Organization } from '@/server/models';
import PLANS from '@/server/config/plans';
import type Stripe from 'stripe';

export async function POST(req: NextRequest) {
  await connectDB();
  const sig = req.headers.get('stripe-signature') as string;
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return NextResponse.json({ message: `Webhook error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.orgId;
        const plan = session.metadata?.plan;
        if (!orgId || !plan) break;
        const org = await Organization.findById(orgId);
        if (!org) break;
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        org.plan = plan as 'free' | 'pro' | 'enterprise';
        org.stripeSubscriptionId = sub.id;
        org.subscriptionStatus = sub.status as typeof org.subscriptionStatus;
        org.billingCycleEnd = new Date(sub.current_period_end * 1000);
        org.limits = PLANS[plan].limits;
        await org.save();
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        const org = await Organization.findOne({ stripeSubscriptionId: subscriptionId });
        if (!org) break;
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        org.usage.documentsGenerated = 0;
        org.usage.apiCalls = 0;
        org.subscriptionStatus = 'active';
        org.billingCycleEnd = new Date(sub.current_period_end * 1000);
        await org.save();
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const org = await Organization.findOne({ stripeSubscriptionId: invoice.subscription as string });
        if (org) {
          org.subscriptionStatus = 'past_due';
          await org.save();
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const org = await Organization.findOne({ stripeSubscriptionId: sub.id });
        if (!org) break;
        org.plan = 'free';
        org.subscriptionStatus = 'canceled';
        org.stripeSubscriptionId = undefined;
        org.limits = PLANS.free.limits;
        org.usage.documentsGenerated = 0;
        await org.save();
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Webhook handler error' }, { status: 500 });
  }
}
