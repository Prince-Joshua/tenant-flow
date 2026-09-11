import type { DisplayCurrency } from "./pricing";

const EUROZONE = new Set([
  "DE", "FR", "ES", "IT", "NL", "IE", "PT", "BE", "AT", "FI", "GR",
]);

/** Only affects which currency the price is DISPLAYED in — see getUserCountry.ts. */
export function resolveDisplayCurrency(country: string | null): DisplayCurrency {
  if (!country) return "usd";
  const c = country.toUpperCase();
  if (c === "NG") return "ngn";
  if (c === "GB") return "gbp";
  if (EUROZONE.has(c)) return "eur";
  return "usd";
}
