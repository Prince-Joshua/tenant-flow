import { headers } from "next/headers";

export async function getUserCountry(): Promise<string | null> {
  const h = await headers();
  return (
    h.get("x-vercel-ip-country") ??
    (h.get("cf-ipcountry") !== "XX" ? h.get("cf-ipcountry") : null)
  );
}
