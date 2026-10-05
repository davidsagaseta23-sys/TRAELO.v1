import { supabase } from "./supabase";
export type Rate = { id: string; origin: string; product_name: string; price_per_kg: number | null; active: boolean };
export async function getActiveRates(): Promise<Rate[]> {
  try {
    const { data } = await supabase().from("shipping_rates").select("*")
      .eq("active", true).order("origin", { ascending: false }).order("created_at");
    return ((data ?? []) as Rate[]).map((r) => ({ ...r, price_per_kg: r.price_per_kg === null ? null : Number(r.price_per_kg) }));
  } catch { return []; }
}
export const usd = (n: number) => `USD ${n.toFixed(2)}`;
export const wa = (text: string, number: string = process.env.NEXT_PUBLIC_WHATSAPP ?? "") => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
