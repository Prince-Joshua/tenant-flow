const featureFlags = {
  id: "feature-flag-service",
  featured: true,
  detailedCaseStudyData: {
    hero: {
      meta: {
        title: "Feature Flag Service",
        stackedTitle: ["Feature", "Flag", "Service"],
        subtitle:
          "A full-stack feature flag management system engineered for safe, incremental feature rollouts — with JWT-protected dashboards, deterministic user targeting, and a full audit trail. Built with TypeScript, Next.js 14, Node.js, and MongoDB.",
        badge: "Engineering Case Study · 2025",
      },
      meta_row: [
        { label: "Role", value: "Sole Architect & Engineer" },
        {
          label: "Stack",
          value:
            "TypeScript · Next.js 14 · Node.js · Express · MongoDB · Chakra UI v3 · Redux Toolkit",
        },
        { label: "Domain", value: "Developer Tooling · Platform Engineering" },
        {
          label: "Pattern",
          value: "Deterministic Hashing · Audit Logging · Protected REST API",
        },
      ],
    },

    execSummary: {
      section: "Executive Summary",
      role: {
        title: "Sole Architect & Engineer",
        body: "Owned 100% of architecture, backend implementation, security design, and frontend dashboard.",
        badges: [
          { label: "Solo Project", variant: "yellow" },
          { label: "Full-Stack", variant: "blue" },
          { label: "Production-Ready", variant: "orange" },
        ],
      },
      cards: [
        {
          n: "1",
          title: "The Problem",
          body: "Shipping new features to all users at once is high-risk — one bad release affects everyone simultaneously. Most teams either deploy and pray, or maintain complex branching strategies that slow velocity. **The challenge was to build a lightweight system that decouples deployment from release, giving engineers surgical control over who sees what and when.**",
        },
        {
          n: "2",
          title: "The Solution",
          body: "A **JWT-protected TypeScript REST API** with a Next.js 14 App Router dashboard that lets engineers create flags, set rollout percentages, toggle features instantly, and audit every change — without touching code or redeploying. A typed `useFeatureFlag` hook makes integration into any Next.js app a single function call.",
        },
        {
          n: "3",
          title: "The Outcome",
          body: "**Zero redeployments** required to toggle a feature. **Deterministic** per-user targeting that guarantees consistent experiences across sessions. A **permanent audit trail** of every flag change — who did it, what changed, and when.",
        },
        {
          n: "4",
          title: "The Scale Signal",
          body: "The `/check` endpoint is **stateless and database-read-only** — a single indexed MongoDB lookup per call. The deterministic hashing algorithm produces consistent results without any per-user state storage. **Horizontal scaling requires zero architectural changes.**",
        },
      ],
    },

    stack: {
      section: "Technology Stack",
      items: [
        "Node.js",
        "Express.js",
        "TypeScript",
        "MongoDB",
        "Mongoose",
        "Next.js 14 (App Router)",
        "React",
        "Chakra UI v3",
        "Redux Toolkit",
        "RTK Query",
        "JWT (jsonwebtoken)",
        "bcryptjs",
        "Deterministic Hash Targeting",
        "Audit Logging",
        "Protected REST API",
        "BullMQ / Redis (planned)",
        "npm SDK package (planned)",
      ],
    },

    architecture: {
      section: "System Architecture",
      layers: [
        {
          type: "client",
          color: "accent2",
          title: "Client Layer",
          sub: "Next.js 14 App Router · Chakra UI v3 · Redux Toolkit + RTK Query",
          arrow: "↓ HTTPS Requests (REST + Bearer Token Auth)",
          subs: [],
        },
        {
          type: "gateway",
          color: "accent",
          title: "API Gateway",
          sub: "Express.js · CORS · JSON Body Parser",
          arrow: "↓ Every request passes through",
          subs: [],
        },
        {
          type: "middleware",
          color: "muted2",
          title: "Middleware Layer",
          sub: "JWT Auth Guard · Global Error Handler",
          arrow: "↓ Only authenticated requests reach protected routes",
          subs: [
            "JWT Bearer Token Verification",
            "req.user hydration",
            "Global typed AppError handler",
          ],
        },
        {
          type: "service",
          color: "accent3",
          title: "Controller / Service Layer",
          sub: "Business Logic · Audit Recording · Rollout Targeting",
          arrow: "↓ Reads / Writes",
          subs: [
            "Auth (register, login)",
            "Flags (CRUD + toggle)",
            "Check (stateless targeting)",
            "Audit Log (immutable history)",
          ],
        },
        {
          type: "data",
          color: "accent4",
          title: "Data Layer",
          sub: "MongoDB · Mongoose · User · Flag · AuditLog Models",
          arrow: null,
          subs: [],
        },
      ],
      legend: [
        { label: "Client", color: "accent2" },
        { label: "API Gateway", color: "accent" },
        { label: "Middleware", color: "muted2" },
        { label: "Services", color: "accent3" },
        { label: "Data Layer", color: "accent4" },
      ],
    },

    deepDives: {
      section: "Engineering Deep Dives",
      items: [
        {
          id: "A",
          category: "Targeting & Consistency",
          title: "Deterministic Hash-Based Rollout",
          content: {
            intro:
              "The naive approach to percentage rollouts is random number generation — flip a coin on every request and let 50% through. This produces a deeply broken user experience: the same user sees the new feature on one visit and the old one on the next, with no consistency.",
            problem_continued:
              "The correct solution is determinism: given the same userId and the same rolloutPercentage, the result must always be identical — no database writes, no session state, no randomness.",
            steps: [
              {
                step: "Step 1 — Hash the userId",
                text: "The userId string is reduced to a numeric hash by summing the char codes of each character. This produces a stable integer for any given userId.",
              },
              {
                step: "Step 2 — Bucket into 0–99",
                text: "The hash is taken modulo 100, placing every user into a consistent bucket between 0 and 99.",
              },
              {
                step: "Step 3 — Compare against rollout threshold",
                text: "If the user's bucket is less than the flag's rolloutPercentage, the flag is enabled. A flag at 30% enables buckets 0–29 — always the same users, every time.",
              },
            ],
            winbox:
              "Consistent user experiences guaranteed across every session and device — without storing any per-user state. The check endpoint is a pure function: same inputs, same output, always.",
          },
        },
        {
          id: "B",
          category: "Security",
          title: "Typed JWT Authentication with Minimal Public Surface",
          content: {
            problem:
              "An unprotected flag management API allows any caller to create, toggle, or delete flags without authorization.",
            solution:
              "All mutation endpoints (create, toggle, delete) and read endpoints (list flags, audit log) are protected behind a typed JWT `protect` middleware. The middleware extracts the Bearer token, verifies it against JWT_SECRET, and hydrates `req.user` with the typed authenticated user document.",
            callout:
              "Only the `/check/:name` endpoint is intentionally public — it is the consumption endpoint used by client applications to evaluate flags. It performs a single indexed read and returns a boolean. No mutation is possible through this surface.",
            winbox:
              "The public API surface is minimal by design. All write operations require authentication. The check endpoint is read-only and stateless — safe to expose without auth.",
          },
        },
        {
          id: "C",
          category: "Observability",
          title: "Immutable Typed Audit Log",
          content: {
            problem:
              "Feature flags are high-leverage controls — toggling the wrong flag at the wrong time can affect thousands of users. Without an audit trail, there is no way to answer 'who changed this, and when?' during an incident.",
            solution:
              "Every mutation — flag creation, toggle on, toggle off, and deletion — writes an immutable typed AuditLog document to MongoDB. The log captures the acting user's ID and name (denormalized at write time), the action (typed enum), the flag name, and a server-generated timestamp.",
            callout:
              "The userName is stored directly on the log document rather than populated via a reference join. This means audit history survives user deletion — a deleted account's actions remain fully readable in the audit trail.",
            winbox:
              "Every flag change is permanently recorded with full attribution. The audit log is append-only by convention, giving engineers a reliable incident timeline for any flag-related production issue.",
          },
        },
        {
          id: "D",
          category: "Frontend Architecture",
          title: "Typed useFeatureFlag Hook — Next.js 14 App Router",
          content: {
            problem:
              "If consuming a feature flag requires writing custom fetch logic in every component, engineers will avoid using the system — the adoption friction defeats the purpose of building it.",
            solution:
              "A single typed `useFeatureFlag(flagName, userId)` hook abstracts the entire check flow. It calls the public `/check/:name` endpoint, manages loading state, and returns a clean typed `{ enabled: boolean; loading: boolean }` interface. Any component in any Next.js app can gate behaviour behind a flag with one line.",
            callout:
              "The hook is intentionally stateless and side-effect-free beyond the API call. It does not write to global Redux state, does not depend on the dashboard's auth context — making it portable to any React or Next.js application.",
            winbox:
              "Flag consumption reduced to a single import and one hook call. Zero boilerplate required in consuming components. Fully typed for TypeScript safety.",
          },
        },
      ],
    },

    tradeoffs: {
      section: "Engineering Trade-offs",
      items: [
        {
          title: "Deterministic Hash vs. Random Rollout",
          badge: { label: "User Experience", variant: "blue" },
          chosen:
            "Deterministic char-code hash modulo 100. Same user always lands in the same bucket — consistent experience across sessions, devices, and API calls. Stateless and requires zero database writes per check.",
          rejected:
            "Random number generation per request. Simple to implement but produces incoherent user experiences — the same user sees different variants on consecutive visits.",
        },
        {
          title: "Denormalized userName on AuditLog vs. Populated Reference",
          badge: { label: "Data Integrity", variant: "purple" },
          chosen:
            "userName stored directly on the AuditLog document at write time. Audit history is durable — deleting a user account does not corrupt historical log entries.",
          rejected:
            "Foreign key reference to User model with population at read time. Cleaner schema but creates a data integrity dependency — deleting a user silently breaks their audit history.",
        },
        {
          title: "Public Check Endpoint vs. Auth-Required Check",
          badge: { label: "Security", variant: "yellow" },
          chosen:
            "The `/check/:name` endpoint is intentionally public. It performs a single indexed read and returns a boolean. No mutation surface exists — safe to expose without auth.",
          rejected:
            "Requiring JWT auth on the check endpoint. Adds integration friction for every consuming application and gains no meaningful security benefit.",
        },
        {
          title: "TypeScript End-to-End vs. JavaScript",
          badge: { label: "Type Safety", variant: "green" },
          chosen:
            "Full TypeScript on both backend (Express + Mongoose) and frontend (Next.js + RTK Query). Shared interface contracts. Compile-time safety on API response shapes.",
          rejected:
            "JavaScript with JSDoc. Faster initial setup but loses compile-time guarantees on API contracts — a particularly high-value property when the frontend and backend share flag and audit log types.",
        },
      ],
    },

    metrics: {
      section: "Results & Impact",
      items: [
        {
          value: "Zero",
          label: "Redeployments required to toggle any feature flag",
        },
        {
          value: "O(1)",
          label: "Check endpoint cost — single indexed MongoDB read per call",
        },
        {
          value: "100%",
          label:
            "Audit coverage — every mutation permanently recorded with attribution",
        },
        {
          value: "1 line",
          label:
            "Flag consumption in any Next.js app via typed useFeatureFlag hook",
        },
      ],
    },

    apiDesign: {
      section: "API Design Contract",
      responseEnvelope: {
        title: "Standard Response Envelope",
        description:
          "All endpoints return a consistent typed JSON shape. Clients never need to guess the response structure on success or failure.",
        successExample: `{
  "success": true,
  "message": "Flag retrieved successfully",
  "data": {
    "_id": "64abc...",
    "name": "new-checkout-button",
    "isEnabled": true,
    "rolloutPercentage": 50,
    "createdAt": "2025-01-12T10:00:00.000Z"
  },
  "error": null
}`,
        errorExample: `{
  "success": false,
  "message": "Flag name already exists",
  "data": null,
  "error": { "code": "CONFLICT" }
}`,
      },
      statusCodes: {
        title: "HTTP Status Code Philosophy",
        headers: ["Code", "Meaning", "When Used"],
        rows: [
          {
            code: "200",
            meaning: "OK",
            when: "Successful GET, PATCH, DELETE operations",
            color: "#6ee7b7",
          },
          {
            code: "201",
            meaning: "Created",
            when: "Successful POST — new user or flag",
            color: "#6ee7b7",
          },
          {
            code: "400",
            meaning: "Bad Request",
            when: "Missing required fields",
            color: "HEX.accent3",
          },
          {
            code: "401",
            meaning: "Unauthorized",
            when: "Missing or invalid JWT token",
            color: "HEX.accent3",
          },
          {
            code: "404",
            meaning: "Not Found",
            when: "Flag or user does not exist",
            color: "HEX.accent3",
          },
          {
            code: "409",
            meaning: "Conflict",
            when: "Flag name already exists",
            color: "HEX.accent3",
          },
          {
            code: "500",
            meaning: "Server Error",
            when: "Global error handler — stack trace never reaches client in production",
            color: "#f87171",
          },
        ],
      },
      errorHandlerCode: `// All errors funnel through a single typed Express error middleware.
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    data: null,
    error: {
      code: err.code || 'SERVER_ERROR',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
});`,
    },

    challenges: {
      section: "Challenges & Decisions",
      headers: ["Challenge", "Decision", "Impact"],
      items: [
        {
          challenge: {
            title: "Consistent Rollout Targeting",
            body: "Random-per-request rollout produces incoherent user experiences across visits.",
          },
          decision:
            "Deterministic char-code hash modulo 100. Every userId maps to a stable bucket permanently.",
          impact: {
            body: "Consistent variant per user across every session and device. Zero per-user state storage required.",
            tag: "User Experience",
          },
        },
        {
          challenge: {
            title: "Audit History Durability",
            body: "Storing a reference to the User model means deleting a user corrupts their audit history.",
          },
          decision:
            "Denormalize userName onto the AuditLog document at write time. History is self-contained.",
          impact: {
            body: "Audit trail is permanent and deletion-proof. Full attribution survives account removal.",
            tag: "Data Integrity",
          },
        },
        {
          challenge: {
            title: "Flag Consumption Friction",
            body: "Per-component fetch logic creates adoption friction and inconsistent implementations.",
          },
          decision:
            "Single typed useFeatureFlag(flagName, userId) hook abstracts the entire check flow.",
          impact: {
            body: "Any Next.js component can gate behaviour behind a flag with one import and one hook call.",
            tag: "Developer Experience",
          },
        },
        {
          challenge: {
            title: "Type Safety Across the Stack",
            body: "Mismatched API response shapes between backend and frontend cause runtime errors that TypeScript cannot catch.",
          },
          decision:
            "Shared interface contracts in typed index files on both backend and frontend. RTK Query endpoints typed against API response interfaces.",
          impact: {
            body: "Compile-time guarantees on API contracts. Runtime shape mismatches caught at build time.",
            tag: "Type Safety",
          },
        },
      ],
    },

    limitations: {
      section: "Known Limitations & Honest Assessment",
      intro:
        "Senior engineers know their system's boundaries. These are the current architectural limitations and the paths to resolving them.",
      items: [
        {
          title: "No SDK Package",
          body: "The useFeatureFlag hook currently lives inside the frontend source tree. Consuming apps need to copy it manually.",
          mitigation:
            "Extract into a standalone npm package — publishable as @yourname/feature-flags-sdk. The hook is already self-contained and dependency-free.",
          resolved: false,
        },
        {
          title: "No Real-Time Flag Push",
          body: "Flag changes take effect only on the next API call. No mechanism to push a toggle change to active sessions instantly.",
          mitigation:
            "WebSockets or Server-Sent Events channel broadcasting flag change events to connected clients.",
          resolved: false,
        },
        {
          title: "Single Hash Function",
          body: "The char-code sum hash is simple and effective but not cryptographically uniform — extreme userIds could cluster unevenly across buckets.",
          mitigation:
            "Replace with MurmurHash or FNV-1a for better distribution uniformity at large user volumes. Drop-in replacement with no API changes.",
          resolved: false,
        },
        {
          title: "No Automated Test Coverage",
          body: "Core flows manually tested but no formal test suite exists.",
          mitigation:
            "Jest + Supertest integration tests covering auth, flag CRUD, toggle logic, check targeting, and audit recording.",
          resolved: false,
        },
      ],
    },

    lessons: {
      section: "Engineering Lessons",
      items: [
        {
          icon: "🎯",
          title: "Determinism Is a Feature, Not an Optimisation",
          body: "Building percentage rollouts with random generation feels simpler but produces a broken product. Investing in deterministic hashing upfront is what makes the system actually useful — consistent experiences are non-negotiable for A/B testing validity.",
        },
        {
          icon: "📋",
          title: "Audit Trails Should Be Append-Only and Self-Contained",
          body: "Storing a user reference on the audit log instead of denormalizing the name is a correctness error masquerading as a normalization win. Compliance-grade logs must survive the deletion of the entities they reference.",
        },
        {
          icon: "🔒",
          title: "Minimal Public Surface Is a Security Strategy",
          body: "Deliberately designing the check endpoint to be public and read-only required conscious reasoning about the threat model. Knowing what to expose and what to protect is a distinct skill from knowing how to implement auth.",
        },
        {
          icon: "🪝",
          title: "Abstractions Determine Adoption",
          body: "A flag system that requires ten lines of boilerplate per component will be abandoned. The useFeatureFlag hook reduced consumption to a single call — that decision is what makes the system actually usable, not just functional.",
        },
        {
          icon: "📘",
          title: "TypeScript Pays Dividends at the API Boundary",
          body: "The highest-value use of TypeScript in this project is at the API contract layer — typed RTK Query endpoints and shared interface files catch shape mismatches at compile time that would otherwise surface as runtime bugs in production.",
        },
      ],
    },

    roadmap: {
      section: "Roadmap & Scalability Path",
      items: [
        "npm SDK package — typed useFeatureFlag as a publishable library",
        "Real-time flag push via WebSockets or Server-Sent Events",
        "Attribute-based targeting — role, country, plan tier, custom properties",
        "MurmurHash / FNV-1a for uniform bucket distribution",
        "Jest + Supertest typed integration test suite",
        "OpenAPI / Swagger documentation generation",
        "Multi-workspace support — team isolation for flag namespaces",
        "Webhook notifications on flag state changes",
        "Redis cache for hot flag reads",
        "Flag scheduling — auto-enable / disable at a set time",
        "Analytics — flag impression counts and conversion tracking per variant",
      ],
    },
  },

  featuredCaseStudyData: {
    section: "Featured Case Study",
    title: {
      eyebrow: "Engineering Case Study · 2025",
      main: ["Feature", "Flag", "Service"],
      subtitle:
        "A full-stack TypeScript feature flag system — JWT-protected dashboard, deterministic user targeting, immutable audit trail, and a typed useFeatureFlag hook for Next.js.",
    },
    metrics: [
      { label: "Redeployments", val: "Zero", sub: "to toggle any feature" },
      { label: "Check Cost", val: "O(1)", sub: "single indexed read" },
      { label: "Audit Coverage", val: "100%", sub: "every mutation recorded" },
    ],
    chips: [
      { variant: "y", text: "Solo Project" },
      { variant: "b", text: "Full-Stack" },
      { variant: "o", text: "Production-Ready" },
    ],
    badges: [
      { dot: "y", text: "Deterministic hash-based rollout" },
      { dot: "b", text: "JWT-protected mutation surface" },
      { dot: "o", text: "Immutable audit log with attribution" },
      { dot: "p", text: "Typed useFeatureFlag Next.js hook" },
      { dot: "y", text: "Public read-only check endpoint" },
      { dot: "b", text: "Chakra UI v3 + Redux Toolkit" },
      { dot: "o", text: "TypeScript end-to-end" },
      { dot: "p", text: "Next.js 14 App Router" },
      { dot: "y", text: "npm SDK package (planned)" },
      { dot: "b", text: "Real-time flag push (planned)" },
    ],
    cta: { label: "Read Full Case Study →", href: "#" },
    dotColors: { y: "accent", b: "accent2", o: "accent3", p: "accent4" },
  },

  miniCaseStudyData: {
    index: "01",
    featured: true,
    status: "complete",
    type: "Developer Tooling · Platform Engineering",
    title: "Feature Flag Service",
    subtitle: "A full-stack TypeScript feature flag management system",
    description:
      "A JWT-protected MERN platform rewritten in TypeScript with Next.js 14 App Router for safe, incremental feature rollouts. Engineers create flags, set rollout percentages, and toggle features instantly — without redeploying. Covers deterministic hash-based user targeting, immutable audit logging, and a typed useFeatureFlag hook. Designed and built solo.",
    chips: [
      { label: "Solo Project", variant: "y" },
      { label: "Full-Stack", variant: "b" },
      { label: "Production-Ready", variant: "o" },
    ],
    tags: [
      "TypeScript",
      "Next.js 14",
      "Node.js",
      "Express",
      "MongoDB",
      "Chakra UI v3",
      "Redux Toolkit",
      "JWT",
      "Audit Logging",
      "Deterministic Hashing",
    ],
    metrics: [
      { label: "Redeployments", value: "Zero" },
      { label: "Check Cost", value: "O(1)" },
      { label: "Audit Coverage", value: "100%" },
    ],
    highlights: [
      "Deterministic hash-based rollout targeting",
      "Immutable audit log with user attribution",
      "JWT-protected mutation surface",
      "Typed useFeatureFlag Next.js hook",
      "TypeScript end-to-end",
    ],
    href: "/case-studies/feature-flag-service",
    image: {
      aspect: "16/9",
      label: "System Architecture Diagram",
      hint: "1200 × 675px recommended",
    },
  },
};

export default featureFlags;
