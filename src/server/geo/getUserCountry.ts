import { headers } from "next/headers";

/**
 * Best-effort country for DISPLAY purposes only (which currency to show
 * a price in). This is never used to decide what a customer is actually
 * charged — that's resolved by Stripe itself (Adaptive Pricing / the
 * fixed NGN override) at checkout, independent of this.
 *
 * Reads the hosting platform's edge geolocation header, which is set by
 * infrastructure from the real connection — not something a client can
 * spoof by editing a request. Falls back to null (→ USD display) if
 * neither header is present, e.g. in local dev or on a host that
 * doesn't inject one.
 */
export async function getUserCountry(): Promise<string | null> {
  const h = await headers();
  return (
    h.get("x-vercel-ip-country") ??
    (h.get("cf-ipcountry") !== "XX" ? h.get("cf-ipcountry") : null)
  );
}
