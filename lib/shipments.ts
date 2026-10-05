export type Status = "received" | "in_transit" | "arrived_ar" | "delivered" | "dispatched";
export const LABEL: Record<Status, string> = {
  received: "Recibido en warehouse", in_transit: "En camino a Argentina", arrived_ar: "En depósito en Argentina",
  delivered: "Entregado", dispatched: "Despachado por transporte",
};
export const STEPS = ["Recibido en warehouse", "En camino a Argentina", "En depósito en Argentina", "Entregado o despachado"];
export const stepOf = (s: Status) => ({ received: 0, in_transit: 1, arrived_ar: 2, delivered: 3, dispatched: 3 }[s]);
export type PkgEvent = { id: string; status: Status; note: string | null; created_at: string };
export type Pkg = {
  id: string; description: string; origin: string; store_tracking: string | null; weight_kg: number | null;
  status: Status; transport_company: string | null; transport_tracking: string | null; created_at: string;
  package_events?: PkgEvent[]; profiles?: { full_name: string; client_code: string };
};
export const fdate = (d: string) => new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
export const BADGE: Record<Status, string> = {
  received: "bg-mist text-ink", in_transit: "bg-brand/10 text-brand", arrived_ar: "bg-brand text-white",
  delivered: "bg-emerald-100 text-emerald-700", dispatched: "bg-emerald-100 text-emerald-700",
};
export const NEXT: Partial<Record<Status, Status>> = { received: "in_transit", in_transit: "arrived_ar" };
export const isDone = (s: Status) => s === "delivered" || s === "dispatched";
