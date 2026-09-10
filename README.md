# TenantFlow

A production-grade multi-tenant SaaS platform built with TypeScript, Next.js 14, Node.js, Express, MongoDB, Stripe, and Google Gemini. Features JWT refresh token rotation, Stripe subscription lifecycle management, per-tenant usage metering, role-based access control, and an AI writing assistant.

---

## Tech Stack

| Layer    | Technology                                                                   |
| -------- | ---------------------------------------------------------------------------- |
| Frontend | Next.js 14 (App Router), TypeScript, Chakra UI v3, Redux Toolkit + RTK Query |
| Backend  | Node.js, Express, TypeScript                                                 |
| Database | MongoDB, Mongoose                                                            |
| Auth     | JWT access + refresh token rotation                                          |
| Billing  | Stripe Subscriptions + Webhooks                                              |
| AI       | Google Gemini 2.0 Flash                                                      |
| Email    | Resend                                                                       |

---

## Local Setup

**Backend**

```bash
cd backend
npm install
cp .env.example .env   # fill in all values
npm run dev
npm run create-admin   # create superadmin account
```

**Frontend**

```bash
cd frontend
npm install
# create .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev
```

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint               | Auth | Description                    |
| ------ | ---------------------- | ---- | ------------------------------ |
| POST   | `/register`            | ❌   | Register + create org          |
| POST   | `/login`               | ❌   | Login, returns tokens          |
| POST   | `/refresh`             | ❌   | Rotate refresh token           |
| POST   | `/logout`              | ✅   | Invalidate refresh token       |
| GET    | `/verify-email?token=` | ❌   | Verify email address           |
| POST   | `/forgot-password`     | ❌   | Send reset email               |
| POST   | `/reset-password`      | ❌   | Set new password               |
| GET    | `/me`                  | ✅   | Get current user + memberships |

### Organization — `/api/org` (requires `x-org-slug` header)

| Method | Endpoint            | Role   | Description        |
| ------ | ------------------- | ------ | ------------------ |
| GET    | `/`                 | member | Get org + members  |
| PATCH  | `/`                 | admin  | Update org name    |
| POST   | `/members/invite`   | admin  | Invite member      |
| PATCH  | `/members/:id/role` | owner  | Update member role |
| DELETE | `/members/:id`      | admin  | Remove member      |
| GET    | `/activity`         | member | Get activity log   |

### Billing — `/api/billing`

| Method | Endpoint    | Role   | Description            |
| ------ | ----------- | ------ | ---------------------- |
| GET    | `/`         | member | Get billing info       |
| POST   | `/checkout` | owner  | Create Stripe checkout |
| POST   | `/portal`   | owner  | Open billing portal    |
| POST   | `/webhook`  | ❌     | Stripe webhook handler |

### Documents — `/api/documents`

| Method | Endpoint          | Auth   | Description          |
| ------ | ----------------- | ------ | -------------------- |
| GET    | `/`               | member | List documents       |
| POST   | `/generate`       | member | Generate with Gemini |
| GET    | `/:id`            | member | Get document         |
| PATCH  | `/:id`            | member | Update document      |
| DELETE | `/:id`            | member | Delete document      |
| POST   | `/:id/regenerate` | member | Regenerate content   |

### Admin — `/api/admin` (superadmin only)

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| GET    | `/stats`                | Platform overview |
| GET    | `/orgs`                 | All organizations |
| PATCH  | `/orgs/:id/plan`        | Change org plan   |
| PATCH  | `/orgs/:id/suspend`     | Suspend org       |
| PATCH  | `/orgs/:id/reset-usage` | Reset usage       |
| GET    | `/users`                | All users         |
| GET    | `/activity`             | Platform activity |

---

## Roadmap

- [ ] BullMQ async email dispatch
- [ ] Redis cache for tenant middleware
- [ ] Jest + Supertest test suite
- [ ] OpenAPI / Swagger docs
- [ ] Stripe usage-based billing
- [ ] SSO / OAuth2 (Google, GitHub)
- [ ] WebSocket real-time notifications
