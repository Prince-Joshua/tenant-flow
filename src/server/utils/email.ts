import { BrevoClient } from "@getbrevo/brevo";

if (!process.env.BREVO_API_KEY) {
  throw new Error("BREVO_API_KEY environment variable is not set");
}

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

const sendEmail = async (
  to: string,
  subject: string,
  html: string,
): Promise<void> => {
  try {
    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: "TenantFlow",
        email: process.env.BREVO_SENDER_EMAIL ?? "onboarding@tenantflow.dev",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });
  } catch (err) {
    console.error("Email error:", err);
  }
};

export const sendVerificationEmail = async (
  email: string,
  token: string,
): Promise<void> => {
  const url = `${process.env.APP_URL}/verify-email?token=${token}`;
  await sendEmail(
    email,
    "Verify your TenantFlow account",
    `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
      <h2>Welcome to TenantFlow</h2>
      <p>Click below to verify your email address.</p>
      <a href="${url}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Verify Email</a>
      <p style="color:#888;font-size:0.85rem;margin-top:16px">This link expires in 24 hours.</p>
    </div>
  `,
  );
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
): Promise<void> => {
  const url = `${process.env.APP_URL}/reset-password?token=${token}`;
  await sendEmail(
    email,
    "Reset your TenantFlow password",
    `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
      <h2>Password Reset</h2>
      <p>Click below to reset your password.</p>
      <a href="${url}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Reset Password</a>
      <p style="color:#888;font-size:0.85rem;margin-top:16px">This link expires in 1 hour.</p>
    </div>
  `,
  );
};

export const sendInviteEmail = async (
  email: string,
  token: string,
  orgName: string,
  inviterName: string,
): Promise<void> => {
  const url = `${process.env.APP_URL}/invite/accept?token=${token}`;
  await sendEmail(
    email,
    `You've been invited to join ${orgName} on TenantFlow`,
    `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
      <h2>You've been invited</h2>
      <p><strong>${inviterName}</strong> has invited you to join <strong>${orgName}</strong> on TenantFlow.</p>
      <a href="${url}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Accept Invite</a>
      <p style="color:#888;font-size:0.85rem;margin-top:16px">This invite expires in 48 hours.</p>
    </div>
  `,
  );
};
