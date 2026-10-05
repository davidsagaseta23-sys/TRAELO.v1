"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Rate } from "@/lib/rates";
import AdminShell from "@/components/AdminShell";

const inp = "w-full rounded-xl bg-mist px-3 py-3 outline-none ring-2 ring-transparent focus:ring-brand";
type Form = { id?: string; origin: string; product_name: string; price: string; active: boolean };
const empty: Form = { origin: "Miami", product_name: "", price: "", active: true };

function Tarifas() {
  const [rows, setRows] = useState<Rate[]>([]); const [form, setForm] = useState<Form | null>(null); const [msg, setMsg] = useState("");
  const load = useCallback(async () => {
    const { data, error } = await supabase().from("shipping_rates").select("*").order("origin", { ascending: false }).order("created_at");
    if (error) setMsg(error.message); else setRows((data ?? []) as Rate[]);
  }, []);
  useEffect(() => { load(); }, [load]);
  async function save() {
    if (!form || !form.product_name.trim()) return setMsg("Ingresá el nombre del producto.");
    const price = form.price.trim() === "" ? null : Number(form.price.replace(",", "."));
    if (price !== null && (!Number.isFinite(price) || price < 0)) return setMsg("Precio inválido.");
    const row = { origin: form.origin.trim(), product_name: form.product_name.trim(), price_per_kg: price, active: form.active };
    const { error } = form.id ? await supabase().from("shipping_rates").update(row).eq("id", form.id) : await supabase().from("shipping_rates").insert(row);
    if (error) return setMsg(error.message);
    setForm(null); setMsg("Cambios guardados."); load();
  }
  async function remove(r: Rate) {
    if (!confirm(`¿Eliminar "${r.product_name}" (${r.origin})?`)) return;
    const { error } = await supabase().from("shipping_rates").delete().eq("id", r.id);
    setMsg(error ? error.message : "Tarifa eliminada."); load();
  }
  async function toggle(r: Rate) {
    const { error } = await supabase().from("shipping_rates").update({ active: !r.active }).eq("id", r.id);
    if (error) setMsg(error.message); load();
  }
  return (<>
    <div className="flex items-center justify-between gap-3"><h1 className="text-2xl font-extrabold">Configuración de tarifas</h1>
      <button onClick={() => setForm(empty)} className="rounded-xl bg-brand px-5 py-3 font-bold text-white">+ Nueva tarifa</button></div>
    {msg && <p className="mt-4 rounded-xl bg-white p-3 text-sm">{msg}</p>}
    {form && (
      <div className="mt-5 grid gap-3 rounded-2xl bg-white p-5 sm:grid-cols-2">
        <input className={inp} placeholder="Origen (Miami, China...)" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
        <input className={inp} placeholder="Producto" value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} />
        <input className={inp} inputMode="decimal" placeholder="Precio por kg (vacío = Consultar)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <label className="flex items-center gap-2 font-medium"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Activo</label>
        <div className="flex gap-3"><button onClick={save} className="rounded-xl bg-ink px-5 py-3 font-bold text-white">Guardar cambios</button>
          <button onClick={() => setForm(null)} className="px-3 font-bold text-ink/60">Cancelar</button></div>
      </div>)}
    <div className="mt-6 overflow-x-auto rounded-2xl bg-white p-2">
      <table className="w-full min-w-[560px] text-left">
        <thead className="text-sm text-ink/50"><tr><th className="p-3">Origen</th><th>Producto</th><th>Precio/kg</th><th>Activo</th><th>Acciones</th></tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.id} className="border-t border-ink/5"><td className="p-3">{r.origin}</td><td>{r.product_name}</td>
            <td>{r.price_per_kg === null ? "—" : `USD ${Number(r.price_per_kg)}`}</td>
            <td><input type="checkbox" checked={r.active} onChange={() => toggle(r)} aria-label="Activo" /></td>
            <td className="space-x-3 font-bold"><button className="text-brand" onClick={() => setForm({ id: r.id, origin: r.origin, product_name: r.product_name, price: r.price_per_kg === null ? "" : String(r.price_per_kg), active: r.active })}>Editar</button>
              <button className="text-red-600" onClick={() => remove(r)}>Eliminar</button></td></tr>))}</tbody>
      </table>
    </div></>);
}
export default function Admin() { return <AdminShell active="tarifas"><Tarifas /></AdminShell>; }
