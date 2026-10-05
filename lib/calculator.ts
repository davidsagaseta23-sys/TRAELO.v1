export const MIN_KG = 1;
export function parseWeight(v: string): number | null {
  const n = parseFloat(v.replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
}
export const billableWeight = (kg: number, min = MIN_KG) => Math.max(kg, min);
export const shippingCost = (kg: number, pricePerKg: number, min = MIN_KG) => billableWeight(kg, min) * pricePerKg;
