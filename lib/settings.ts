import { supabase } from "./supabase";
export type Settings = { whatsapp: string; instagram: string; storage_days: string; min_kg: number };
export type Faq = { id: string; question: string; answer: string; position: number; active: boolean };
export const DEFAULT_FAQS: Faq[] = [
  ["¿Qué productos puedo traer?", "Aceptamos carga general. No transportamos medicamentos, drogas, armas, alimentos ni perecederos, ni ningún producto que legalmente no podamos transportar."],
  ["¿Desde dónde puedo traer?", "Desde Miami y China."],
  ["¿Cómo se calcula el precio?", "Peso facturable × precio por kg. El precio depende del origen y del tipo de producto. Usá la calculadora para estimarlo."],
  ["¿Cuál es el peso mínimo?", "{{peso_minimo}} kg. Si tu paquete pesa menos, se calcula como {{peso_minimo}} kg. Por encima de eso se cobra el peso exacto."],
  ["¿Puedo consolidar varios paquetes?", "Sí, la consolidación es gratis. Podés juntar varios paquetes y enviarlos juntos."],
  ["¿Cuánto tiempo puedo dejar mi paquete?", "Tenés {{dias_gratis}} días de almacenamiento sin cargo, contados desde la llegada del primer paquete."],
  ["¿El precio incluye la entrega dentro de Argentina?", "No. El valor de la calculadora es el del envío internacional. La entrega dentro de Argentina se cotiza por separado."],
].map(([question, answer], i) => ({ id: String(i), question, answer, position: i, active: true }));

export async function getSettings(): Promise<Settings> {
  const map: Record<string, string> = {};
  try { const { data } = await supabase().from("site_settings").select("key,value"); (data ?? []).forEach((r) => (map[r.key] = r.value)); } catch {}
  return {
    whatsapp: map.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP || "",
    instagram: map.instagram || process.env.NEXT_PUBLIC_INSTAGRAM || "",
    storage_days: map.storage_days || "15",
    min_kg: Number(map.min_kg) > 0 ? Number(map.min_kg) : 1,
  };
}
export async function getFaqs(): Promise<Faq[]> {
  try {
    const { data } = await supabase().from("faqs").select("*").eq("active", true).order("position");
    if (data && data.length) return data as Faq[];
  } catch {}
  return DEFAULT_FAQS;
}
export const fill = (t: string, s: Settings) => t.split("{{peso_minimo}}").join(String(s.min_kg)).split("{{dias_gratis}}").join(s.storage_days);
