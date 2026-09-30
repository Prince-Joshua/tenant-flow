// Run this on a daily schedule (cron, Vercel Cron, GitHub Actions, etc.)
// via: pnpm tsx src/server/scripts/notifyExpiringSubscriptions.ts
//
// Flags any org whose paid subscription renews/expires within 3 days,
// and only notifies once per billing cycle (checked via existing
// notifications so re-running the script daily doesn't spam members).
import "dotenv/config";
import connectDB from "../db";
import { Organization, Notification } from "../models";

const WARNING_WINDOW_DAYS = 3;

async function run() {
  await connectDB();

  const now = new Date();
  const windowEnd = new Date(
    now.getTime() + WARNING_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  );

  const expiringOrgs = await Organization.find({
    plan: { $ne: "free" },
    subscriptionStatus: "active",
    billingCycleEnd: { $gte: now, $lte: windowEnd },
  });

  let notified = 0;
  for (const org of expiringOrgs) {
    const alreadyNotified = await Notification.exists({
      audience: "org",
      organization: org._id,
      type: "billing",
      title: "Your subscription renews soon",
      createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
    });
    if (alreadyNotified) continue;

    await Notification.create({
      audience: "org",
      organization: org._id,
      type: "billing",
      title: "Your subscription renews soon",
      body: `Your ${org.plan} plan renews on ${org.billingCycleEnd?.toLocaleDateString()}.`,
      link: "/dashboard/billing",
    });
    notified++;
  }

  console.log(`Notified ${notified} of ${expiringOrgs.length} expiring orgs.`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
