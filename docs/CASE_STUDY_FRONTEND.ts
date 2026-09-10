const tenantFlowFrontend = {
  id: "tenantflow-frontend",
  featured: true,
  detailedCaseStudyData: {
    hero: {
      meta: {
        title: "TenantFlow Dashboard",
        stackedTitle: ["Tenant", "Flow", "UI"],
        subtitle:
          "A production-grade Next.js 14 App Router dashboard for a multi-tenant SaaS platform — with RTK Query auto-refresh token rotation, per-workspace state isolation, Stripe checkout flows, and an AI document generation UI. Designed, architected, and built by one engineer.",
        badge: "Engineering Case Study · 2025",
      },
      meta_row: [
        { label: "Role", value: "Sole Architect & Engineer" },
        {
          label: "Stack",
          value:
            "Next.js 14 · TypeScript · Chakra UI v3 · Redux Toolkit · RTK Query",
        },
        {
          label: "Domain",
          value: "SaaS Dashboard · Admin Console · AI-Powered UI",
        },
        {
          label: "Pattern",
          value:
            "App Router · RTK Query Reauth · Workspace State · Typed API Layer",
        },
      ],
    },
    execSummary: {
      section: "Executive Summary",
      role: {
        title: "Sole Architect & Engineer",
        body: "Owned 100% of frontend architecture, component design, state management, and API integration.",
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
          body: "Multi-tenant SaaS frontends have unique complexity — every API call must be scoped to the active workspace, auth tokens expire and must rotate silently, Stripe checkout flows must redirect correctly, and usage limits must be surfaced before the user hits them. **Building this naively produces a fragile app where workspace context leaks, token expiry breaks sessions, and billing errors surface as blank screens.**",
        },
        {
          n: "2",
          title: "The Solution",
          body: "A **typed Next.js 14 App Router frontend** with RTK Query handling all data fetching — including automatic refresh token rotation on 401 responses. The active workspace is stored in Redux and injected into every API request as an `x-org-slug` header. Usage is surfaced progressively with a UsageBar component before limits are hit. Stripe checkout and portal redirects are handled server-side.",
        },
        {
          n: "3",
          title: "The Outcome",
          body: "**Zero manual token refresh logic** in any component — RTK Query base query handles rotation transparently. **Every API call is workspace-scoped** automatically via the Redux org slice. A **complete dashboard + admin console** built from a shared component library with a custom Chakra UI v3 theme.",
        },
        {
          n: "4",
          title: "The Scale Signal",
          body: "The workspace-aware base query means adding new API endpoints requires zero boilerplate — the `x-org-slug` header, auth token, and refresh rotation are inherited automatically. The typed RTK Query layer means every new endpoint has full TypeScript coverage from request to component.",
        },
      ],
    },
    stack: {
      section: "Technology Stack",
      items: [
        "Next.js 14 (App Router)",
        "TypeScript",
        "React",
        "Chakra UI v3",
        "Redux Toolkit",
        "RTK Query",
        "Custom Chakra Theme (createSystem)",
        "Workspace-Aware Base Query",
        "Automatic Refresh Token Rotation",
        "Typed API Endpoints",
        "Server-Side Stripe Redirects",
      ],
    },
    deepDives: {
      section: "Engineering Deep Dives",
      items: [
        {
          id: "A",
          category: "Auth & Token Management",
          title: "RTK Query Automatic Refresh Token Rotation",
          content: {
            intro:
              "The naive approach to token expiry is catching 401 errors in a global Axios interceptor and redirecting to login. This breaks in-flight requests and destroys user state. The correct approach is transparent rotation — the token refreshes and the original request retries without the user noticing.",
            problem_continued:
              "RTK Query's baseQuery wrapping pattern enables this transparently:",
            steps: [
              {
                step: "Step 1 — 401 detected",
                text: "The base query receives a 401 response on any request. Rather than propagating the error, it intercepts it.",
              },
              {
                step: "Step 2 — Refresh attempt",
                text: "The wrapper calls `/auth/refresh` with the stored refresh token. If successful, both tokens are updated in Redux via `updateTokens`.",
              },
              {
                step: "Step 3 — Original request retried",
                text: "The original request is retried with the new access token. The component never sees the 401 — it receives the successful response.",
              },
            ],
            winbox:
              "Token expiry is completely transparent to all components. No manual refresh logic. No broken in-flight requests. Refresh token rotation is enforced on every use.",
          },
        },
        {
          id: "B",
          category: "Multi-Tenancy",
          title: "Workspace-Aware RTK Query Base Query",
          content: {
            problem:
              "Every API call in a multi-tenant app must include the active workspace context. Passing it manually from every component creates duplication and a constant source of bugs — one missed parameter and the request hits the wrong tenant.",
            solution:
              "The RTK Query base query reads `state.org.activeOrg.slug` on every request and injects it as the `x-org-slug` header automatically. Switching workspace updates the Redux org slice, which immediately propagates to all subsequent API calls without any component changes.",
            callout:
              "The workspace slug is never passed as a prop or argument from any component. It is a Redux-level concern resolved once in the base query — the same architectural pattern that makes the backend tenant middleware secure.",
            winbox:
              "Zero prop-drilling of workspace context. All components are workspace-agnostic. Switching organizations updates all subsequent API calls automatically.",
          },
        },
        {
          id: "C",
          category: "Type Safety",
          title: "Typed RTK Query Endpoints — Request to Component",
          content: {
            problem:
              "Untyped API layers mean shape mismatches between what the backend returns and what the frontend expects surface as runtime errors in production — often silently, as undefined values that break rendering.",
            solution:
              "Every RTK Query endpoint is typed with the exact API response interface. The `ApiResponse<T>` generic wrapper means every endpoint's data shape is validated at compile time. Shared TypeScript interfaces between the store and components mean mismatches are caught at build time, not in production.",
            callout:
              "The highest-value use of TypeScript in this project is at the API boundary. A backend change that breaks the response shape surfaces as a TypeScript error in the IDE before the code ships.",
            winbox:
              "API shape mismatches caught at compile time. Every component consuming RTK Query data has full type inference. Zero runtime undefined errors from API response shape assumptions.",
          },
        },
        {
          id: "D",
          category: "Design System",
          title: "Custom Chakra UI v3 Theme with Semantic Tokens",
          content: {
            problem:
              "Using Chakra UI without a custom theme produces generic, recognizable-as-Chakra UIs. Every color decision made in a component is a one-off that can't be updated globally. Dark mode surfaces require coordinated decisions across dozens of files.",
            solution:
              "A custom `createSystem` theme defines the entire visual language: a signature electric violet accent, a 10-step gray scale calibrated for dark surfaces, semantic color tokens (`bg.surface`, `text.muted`, `brand.subtle`) that abstract the raw palette, and CSS keyframes for transitions. Every component references semantic tokens — never raw hex values.",
            callout:
              "Semantic tokens are the key decision. `bg.surface` can be redefined globally in one place. Components never hardcode `#111827` — they reference `bg.surface`, which means the entire surface hierarchy can shift without touching a single component.",
            winbox:
              "Global visual consistency enforced by token architecture. Design changes propagate from one file. Components are palette-agnostic — they reference semantics, not values.",
          },
        },
      ],
    },
    tradeoffs: {
      section: "Engineering Trade-offs",
      items: [
        {
          title: "RTK Query vs. Axios + React Query",
          badge: { label: "Architecture", variant: "blue" },
          chosen:
            "RTK Query co-located with Redux. Workspace context, auth tokens, and API data live in the same store — the base query reads all three in one place. Cache invalidation uses shared tag types. No separate library to configure.",
          rejected:
            "Axios + React Query (or SWR). Popular combination but splits state management across two systems — auth in Redux, server state in Query. The workspace header injection requires a custom Axios instance that must stay in sync with Redux state separately.",
        },
        {
          title: "Next.js App Router vs. Pages Router",
          badge: { label: "Framework", variant: "purple" },
          chosen:
            "App Router with client components for all interactive pages. Route-level code splitting, layout nesting for dashboard shell, and server components for static wrapper layers (root layout, metadata).",
          rejected:
            "Pages Router. Still fully supported but doesn't benefit from layout nesting — the dashboard sidebar would require prop-drilling or context at every page, rather than being a layout-level concern.",
        },
        {
          title: "Semantic Token Theme vs. Inline Styles",
          badge: { label: "Design System", variant: "orange" },
          chosen:
            "Custom `createSystem` theme with semantic tokens. All color decisions made once. Components reference `bg.surface`, `text.muted` — never raw hex. Global palette changes propagate automatically.",
          rejected:
            "Inline style objects per component. Fast to start, impossible to maintain. Changing the surface color requires finding every instance of `#111827` across dozens of files.",
        },
        {
          title: "Redux for Workspace State vs. React Context",
          badge: { label: "State Management", variant: "yellow" },
          chosen:
            "Redux org slice for active workspace. RTK Query base query reads it directly from the store — no Provider nesting, no context drilling, no subscription issues. Workspace switch is a single dispatch that propagates to all subsequent API calls.",
          rejected:
            "React Context for workspace state. Works for UI concerns but cannot be read inside RTK Query base query without complex workarounds — the base query runs outside the component tree.",
        },
      ],
    },
    metrics: {
      section: "Results & Impact",
      items: [
        {
          value: "Zero",
          label:
            "Manual token refresh logic in any component — RTK Query handles it transparently",
        },
        {
          value: "1",
          label:
            "Place where workspace context is injected — the RTK Query base query",
        },
        {
          value: "100%",
          label:
            "API endpoints typed end-to-end — request body to component data",
        },
        {
          value: "0",
          label:
            "Raw hex values in components — all colors reference semantic tokens",
        },
      ],
    },
    lessons: {
      section: "Engineering Lessons",
      items: [
        {
          icon: "🔄",
          title: "Token Rotation Belongs in the Data Layer, Not Components",
          body: "Handling 401s in individual components or global Axios interceptors is fragile. Wrapping RTK Query's base query means rotation is transparent — components never see the 401, they just receive the successful retry response.",
        },
        {
          icon: "🏗️",
          title: "Workspace Context Is a Infrastructure Concern",
          body: "Passing workspace slug from component to API call is the wrong abstraction level. Reading it from the Redux store in the base query means it's resolved once, consistently, for every request — the same principle that makes the backend tenant middleware secure.",
        },
        {
          icon: "📘",
          title: "TypeScript Pays Most at the API Boundary",
          body: "Type inference inside components is valuable but recoverable. An untyped API boundary lets backend shape changes become runtime errors. Typing the RTK Query endpoints catches these at build time.",
        },
        {
          icon: "🎨",
          title: "Semantic Tokens Are Not Optional in a Design System",
          body: "A theme without semantic tokens is just a color palette. Semantic tokens abstract the palette from the components — `bg.surface` is a contract, not a value. That abstraction is what makes global changes possible without touching individual components.",
        },
      ],
    },
    roadmap: {
      section: "Roadmap & Scalability Path",
      items: [
        "Real-time notifications via WebSocket connection in layout",
        "Optimistic UI updates for document toggle and member role changes",
        "Skeleton loading states replacing PageSpinner for better UX",
        "Infinite scroll replacing pagination on document list",
        "Toast notification system for all mutation feedback",
        "E2E tests with Playwright covering auth, workspace switching, and billing flows",
        "Storybook component documentation",
        "i18n support via next-intl",
      ],
    },
  },
  miniCaseStudyData: {
    index: "04",
    featured: true,
    status: "complete",
    type: "SaaS Dashboard · Frontend Architecture",
    title: "TenantFlow Dashboard",
    subtitle: "Next.js 14 App Router multi-tenant SaaS frontend",
    description:
      "A typed Next.js 14 App Router dashboard for a multi-tenant SaaS platform. RTK Query handles all data fetching with automatic refresh token rotation. Workspace context is injected globally via the Redux base query. Covers custom Chakra UI v3 theming, typed API endpoints, Stripe checkout flows, and a full admin console. Built solo.",
    chips: [
      { label: "Solo Project", variant: "y" },
      { label: "Full-Stack", variant: "b" },
      { label: "Production-Ready", variant: "o" },
    ],
    tags: [
      "TypeScript",
      "Next.js 14",
      "React",
      "Chakra UI v3",
      "Redux Toolkit",
      "RTK Query",
      "Stripe",
      "Google Gemini",
    ],
    metrics: [
      { label: "Token Refresh", value: "Auto" },
      { label: "API Coverage", value: "100%" },
      { label: "Type Safety", value: "E2E" },
    ],
    highlights: [
      "RTK Query automatic token rotation",
      "Workspace-aware base query",
      "Typed API endpoints end-to-end",
      "Custom Chakra UI v3 semantic tokens",
      "Full admin console",
    ],
    href: "/case-studies/tenantflow-frontend",
    image: {
      aspect: "16/9",
      label: "Dashboard Screenshot",
      hint: "1200 × 675px recommended",
    },
  },
};

export default tenantFlowFrontend;
