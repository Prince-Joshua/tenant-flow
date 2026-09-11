# TenantFlow

A production-grade multi-tenant SaaS platform built as a single Next.js 16 App Router application, using Server Components and Server Actions end to end — no separate backend. Features cookie-based session auth, Stripe subscription billing with per-tenant usage metering, role-based access control, and an AI writing assistant powered by Google Gemini.

---

## Key Features

- **AI document generation** — prompt-based drafting via Gemini, with tone/length controls, regeneration (staged as a pending version for review before it overwrites the current content), duplication, and reusable templates.
- **Approval workflow** — documents move `draft → review → approved/rejected`. Creators/editors submit for review; org owners/admins approve or reject (with an optional reason). Every transition is recorded in a per-document approval history.
- **Comments** — threaded per-document comments, moderated by the document owner and org owners/admins.
- **Export** — copy to clipboard, download as PDF or Word (.docx), generated client-side.
- **Sharing**, three distinct paths depending on who the recipient is:
  - *Collaborators* — invite an org member as a view/edit collaborator on a document.
  - *Public link* — a token-based URL anyone can open, no login required.
  - *Contacts* — send a one-off copy to a saved external contact (see below), without giving them a public link or an account.
- **Contacts** — a private, org-scoped address book for customers or other outside people, separate from `Membership`. No login, no dashboard access — just a name/email/note you can pick when emailing or sharing a document. Gated by a per-plan `contactsAllowed` limit, same pattern as team member seats.
- **Members & roles** — invite-by-email with `owner` / `admin` / `member` roles, seat limits enforced per plan.
- **Activity log** — an audited feed of document, member, and contact events per org.

---

## Tech Stack

| Layer | Technology |
|---|---|
| App | Next.js 16 (App Router), TypeScript, Server Actions — one unified app, no separate API server |
| UI | Chakra UI v3, Framer Motion (page/panel transitions) |
| Database | MongoDB (Atlas in production), Mongoose |
| Auth | Signed, httpOnly session cookie (no JWT access/refresh tokens) |
| Billing | Stripe Subscriptions + Webhooks |
| AI | Google Gemini |
| Email | Brevo (transactional) |
| Package manager | pnpm (workspace monorepo — `@tenantflow/types` is a local workspace package) |
| Hosting | Vercel |

---

## Local Setup

```bash
pnpm install
cp .env.example .env   # fill in all values — see below
pnpm dev
pnpm create-admin       # seeds a superadmin (see note below)
```

> This is a pnpm workspace — use `pnpm`, not `npm`. `npm install` will fail to resolve `@tenantflow/types` (`workspace:*` is a pnpm/yarn-only protocol).

### Environment variables

See `.env.example` for the full list. Notable ones:

- `MONGO_URI` — MongoDB connection string (Atlas in production; whitelist `0.0.0.0/0` in Atlas Network Access if deploying to Vercel, since serverless functions don't have static IPs)
- `SESSION_SECRET` — signs the session cookie
- `APP_URL` — used to build absolute links in emails and Stripe redirect URLs; must be the real deployed URL (no trailing slash) in production
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — from Stripe Dashboard → Developers → API keys / Webhooks
- `STRIPE_FREE_PRICE_ID` / `STRIPE_PRO_PRICE_ID` / `STRIPE_ENTERPRISE_PRICE_ID` — must be actual **Price** IDs (`price_...`), not Product IDs (`prod_...`); free tier's can be left blank, since checkout is never invoked for the free plan
- `BREVO_API_KEY` / `BREVO_SENDER_EMAIL` — the sender address must be a **verified sender** (or verified domain) in Brevo, or transactional email sends will fail silently server-side
- `GEMINI_API_KEY` — Google Gemini API key

### Superadmin seed script

`pnpm create-admin` runs `src/server/scripts/createSuperAdmin.ts`, which seeds a default account:

```
admin@tenantflow.dev / superadmin123
```

⚠️ This is a hardcoded placeholder committed to the repo — log in once and change the password through the app immediately after running this, especially before/after running it against a production database.

---

## Deploying (Vercel)

1. Import the GitHub repo into Vercel. The repo root *is* the workspace root (contains `pnpm-workspace.yaml`), so leave Root Directory unset.
2. Add every env var from `.env.example` in Vercel → Settings → Environment Variables, scoped to Production.
3. Whitelist `0.0.0.0/0` in MongoDB Atlas → Network Access.
4. Deploy, then set `APP_URL` to the real Vercel URL (or custom domain) once you have it, and redeploy.
5. In Stripe → Developers → Webhooks, add an endpoint at `https://<your-domain>/api/billing/webhook`, subscribed to `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, and `customer.subscription.deleted`. Copy its signing secret into `STRIPE_WEBHOOK_SECRET` and redeploy — each endpoint has its own secret, so a local Stripe CLI's `whsec_...` will not work in production.

Note on the Stripe SDK: this project targets a post-Basil API version, where `Subscription.current_period_end` moved to `subscription.items.data[].current_period_end`, and `Invoice.subscription` moved to `invoice.parent.subscription_details.subscription`. The webhook handler (`src/app/api/billing/webhook/route.ts`) already accounts for this.

---

## App Routes

Public/auth pages (`src/app/*/page.tsx`): `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/org-select`.

Authenticated app: `/dashboard` (org home, documents, members, contacts, billing — see `src/app/dashboard/`), `/admin` (superadmin-only: overview, `/admin/orgs`, `/admin/users`, `/admin/activity`).

All data access and mutation goes through Server Actions and Server Components in `src/server/actions/` and `src/server/data/` — there is no separate REST API to document; route handlers exist only where an external caller needs one (currently just `/api/billing/webhook` for Stripe).

---

## Roadmap

- [ ] BullMQ async email dispatch
- [ ] Redis cache for tenant middleware
- [ ] Jest + Supertest test suite
- [ ] Stripe usage-based billing
- [ ] SSO / OAuth2 (Google, GitHub)
- [ ] WebSocket real-time notifications