import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/server/db";
import stripe from "@/server/config/stripe";
import { Organization } from "@/server/models";
import PLANS from "@/server/config/plans";
import type Stripe from "stripe";

function getSubscriptionPeriodEnd(sub: Stripe.Subscription): Date {
  const end = sub.items.data[0]?.current_period_end;
  return new Date((end ?? Math.floor(Date.now() / 1000)) * 1000);
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  if (invoice.parent?.type === "subscription_details") {
    const sub = invoice.parent.subscription_details?.subscription;
    return typeof sub === "string" ? sub : (sub?.id ?? null);
  }
  return null;
}

export async function POST(req: NextRequest) {
  await connectDB();
  const sig = req.headers.get("stripe-signature") as string;
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(
      { message: `Webhook error: ${message}` },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.orgId;
        const plan = session.metadata?.plan;
        if (!orgId || !plan) break;
        const org = await Organization.findById(orgId);
        if (!org) break;
        const sub = await stripe.subscriptions.retrieve(
          session.subscription as string,
        );
        org.plan = plan as "free" | "pro" | "enterprise";
        org.stripeSubscriptionId = sub.id;
        org.subscriptionStatus = sub.status as typeof org.subscriptionStatus;
        org.billingCycleEnd = getSubscriptionPeriodEnd(sub);
        org.limits = PLANS[plan].limits;
        // Record what currency/amount Stripe actually resolved for this
        // customer (Adaptive Pricing conversion, or the fixed NGN
        // override) — not something our app decided.
        org.subscriptionCurrency = sub.items.data[0]?.price.currency;
        org.subscriptionAmount =
          sub.items.data[0]?.price.unit_amount ?? undefined;

        org.usage.documentsGenerated = 0;
        org.usage.apiCalls = 0;
        await org.save();
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = getInvoiceSubscriptionId(invoice);
        if (!subscriptionId) break;
        const org = await Organization.findOne({
          stripeSubscriptionId: subscriptionId,
        });
        if (!org) break;
        const sub = await stripe.subscriptions.retrieve(subscriptionId);

        org.usage.documentsGenerated = 0;
        org.usage.apiCalls = 0;
        org.subscriptionStatus = "active";
        org.billingCycleEnd = getSubscriptionPeriodEnd(sub);
        org.subscriptionCurrency = sub.items.data[0]?.price.currency;
        org.subscriptionAmount =
          sub.items.data[0]?.price.unit_amount ?? undefined;
        await org.save();
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = getInvoiceSubscriptionId(invoice);
        if (!subscriptionId) break;
        const org = await Organization.findOne({
          stripeSubscriptionId: subscriptionId,
        });
        if (org) {
          org.subscriptionStatus = "past_due";
          await org.save();
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const org = await Organization.findOne({
          stripeSubscriptionId: sub.id,
        });
        if (!org) break;
        org.plan = "free";
        org.subscriptionStatus = "canceled";
        org.stripeSubscriptionId = undefined;
        org.subscriptionCurrency = undefined;
        org.subscriptionAmount = undefined;
        org.limits = PLANS.free.limits;
        org.usage.documentsGenerated = 0;
        await org.save();
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Webhook handler error" },
      { status: 500 },
    );
  }
}
