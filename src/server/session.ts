import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "tf_session";
const ORG_COOKIE = "tf_org";
const ADMIN_COOKIE = "tf_admin";
const ADMIN_ELEVATION_SECONDS = 60 * 15; // re-enter password after 15 min
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days, sliding

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
};

export async function createSession(userId: string): Promise<void> {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, cookieOptions);
}

export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(ORG_COOKIE);
  store.delete(ADMIN_COOKIE);
}

export async function setActiveOrgCookie(slug: string): Promise<void> {
  const store = await cookies();
  store.set(ORG_COOKIE, slug, cookieOptions);
}

export async function getActiveOrgSlug(): Promise<string | null> {
  const store = await cookies();
  return store.get(ORG_COOKIE)?.value ?? null;
}

export async function clearActiveOrgCookie(): Promise<void> {
  const store = await cookies();
  store.delete(ORG_COOKIE);
}

/** Step-up auth for /admin: set only after the superadmin re-enters their password. */
export async function createAdminElevation(userId: string): Promise<void> {
  const token = await new SignJWT({ sub: userId, scope: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_ELEVATION_SECONDS}s`)
    .sign(getSecretKey());

  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    ...cookieOptions,
    sameSite: "strict" as const,
    maxAge: ADMIN_ELEVATION_SECONDS,
  });
}

export async function hasAdminElevation(userId: string): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.sub === userId && payload.scope === "admin";
  } catch {
    return false;
  }
}
