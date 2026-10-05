"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BADGE, LABEL, NEXT, Pkg, Status, fdate } from "@/lib/shipments";
import AdminShell from "@/components/AdminShell";

const inp = "w-full rounded-xl bg-mist px-3 py-3 outline-none ring-2 ring-transparent focus:ring-brand";
const empty = { client: "", description: "", origin: "Miami", store_tracking: "", weight: "" };
type Client = { id: string; client_code: string; full_name: string; phone: string };

function Envios() {
  const [rows, setRows] = useState<Pkg[]>([]); const [clients, setClients] = useState<Client[]>([]);
  const [n, setN] = useState(empty); const [showNew, setShowNew] = useState(false); const [msg, setMsg] = useState("");
  const [q, setQ] = useState(""); const [flt, setFlt] = useState<Status | "all">("all");
  const [edit, setEdit] = useState<{ id: string; status: Status; note: string; company: string; track: string } | null>(null);

  const load = useCallback(async () => {
    const [a, b] = await Promise.all([
      supabase().from("packages").select("*, profiles(full_name,client_code)").order("created_at", { ascending: false }),
      supabase().from("profiles").select("id,client_code,full_name,phone").order("client_code"),
    ]);
    if (a.error) setMsg(a.error.message); else setRows((a.data ?? []) as Pkg[]);
    setClients((b.data ?? []) as Client[]);
  }, []);
  useEffect(() => {
    load();
    const c = new URLSearchParams(location.search).get("cliente");
    if (c) { setN((x) => ({ ...x, client: c })); setShowNew(true); }
  }, [load]);

  const shown = useMemo(() => rows.filter((p) => (flt === "all" || p.status === flt) &&
    `${p.description} ${p.profiles?.client_code} ${p.profiles?.full_name} ${p.store_tracking ?? ""}`.toLowerCase().includes(q.toLowerCase())), [rows, flt, q]);

  async function create() {
    const code = n.client.trim().split(" ")[0].toUpperCase();
    const c = clients.find((x) => x.client_code === code);
    if (!c) return setMsg("Elegí un cliente de la lista (código TRL-XXXX).");
    if (!n.description.trim()) return setMsg("Ingresá la descripción del paquete.");
    const w = n.weight.trim() === "" ? null : Number(n.weight.replace(",", "."));
    const { data: pkg, error } = await supabase().from("packages").insert({
      user_id: c.id, description: n.description.trim(), origin: n.origin, store_tracking: n.store_tracking.trim() || null, weight_kg: w, status: "received" }).select().single();
    if (error || !pkg) return setMsg(error?.message ?? "Error al crear.");
    await supabase().from("package_events").insert({ package_id: pkg.id, status: "received" });
    setN(empty); setShowNew(false); setMsg(`Paquete asignado a ${c.full_name || c.client_code}.`); load();
  }
  async function setStatus(id: string, status: Status, note = "", company = "", track = "") {
    const patch: Record<string, unknown> = { status };
    if (status === "dispatched") { patch.transport_company = company || null; patch.transport_tracking = track || null; }
    const { error } = await supabase().from("packages").update(patch).eq("id", id);
    if (error) return setMsg(error.message);
    await supabase().from("package_events").insert({ package_id: id, status, note: note.trim() || null });
    setEdit(null); setMsg("Estado actualizado. El cliente ya lo ve en su cuenta."); load();
  }
  async function remove(p: Pkg) {
    if (!confirm(`¿Eliminar "${p.description}"?`)) return;
    const { error } = await supabase().from("packages").delete().eq("id", p.id);
    setMsg(error ? error.message : "Paquete eliminado."); load();
  }
  const count = (s: Status | "all") => (s === "all" ? rows.length : rows.filter((p) => p.status === s).length);

  return (<>
    <div className="flex items-center justify-between gap-3"><h1 className="text-2xl font-extrabold">Envíos</h1>
      <button onClick={() => setShowNew(!showNew)} className="rounded-xl bg-brand px-5 py-3 font-bold text-white">+ Registrar paquete</button></div>
    {msg && <p className="mt-4 rounded-xl bg-white p-3 text-sm">{msg}</p>}
    {showNew && (
      <div className="mt-5 grid gap-3 rounded-2xl bg-white p-5 sm:grid-cols-2">
        <input className={inp} list="clientes" placeholder="Cliente (código o nombre)" value={n.client} onChange={(e) => setN({ ...n, client: e.target.value })} />
        <datalist id="clientes">{clients.map((c) => <option key={c.id} value={`${c.client_code} — ${c.full_name}`} />)}</datalist>
        <input className={inp} placeholder="Descripción del paquete" value={n.description} onChange={(e) => setN({ ...n, description: e.target.value })} />
        <select className={inp} value={n.origin} onChange={(e) => setN({ ...n, origin: e.target.value })}><option>Miami</option><option>China</option></select>
        <input className={inp} inputMode="decimal" placeholder="Peso (kg)" value={n.weight} onChange={(e) => setN({ ...n, weight: e.target.value })} />
        <input className={inp} placeholder="Tracking de la tienda (opcional)" value={n.store_tracking} onChange={(e) => setN({ ...n, store_tracking: e.target.value })} />
        <button onClick={create} className="rounded-xl bg-ink px-5 py-3 font-bold text-white">Asignar al cliente</button>
      </div>)}
    <div className="mt-6 flex flex-wrap gap-2">
      {(["all", ...Object.keys(LABEL)] as (Status | "all")[]).map((s) => (
        <button key={s} onClick={() => setFlt(s)} className={`rounded-full px-4 py-2 text-sm font-bold ${flt === s ? "bg-ink text-white" : "bg-white text-ink/60"}`}>
          {s === "all" ? "Todos" : LABEL[s]} · {count(s)}</button>))}
    </div>
    <input className={inp + " mt-4 bg-white"} placeholder="Buscar por cliente, código o paquete" value={q} onChange={(e) => setQ(e.target.value)} />
    <div className="mt-5 space-y-3">
      {shown.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-ink/60">No hay envíos para mostrar.</p>}
      {shown.map((p) => (
        <div key={p.id} className="rounded-2xl bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div><b>{p.description}</b><p className="text-sm text-ink/60">{p.profiles?.client_code} · {p.profiles?.full_name} · {p.origin} · {fdate(p.created_at)}</p></div>
            <span className={`rounded-full px-3 py-1 text-sm font-bold ${BADGE[p.status]}`}>{LABEL[p.status]}</span>
          </div>
          {edit?.id === p.id ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <select className={inp} value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value as Status })}>
                {(Object.keys(LABEL) as Status[]).map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}</select>
              <input className={inp} placeholder="Nota para el cliente (opcional)" value={edit.note} onChange={(e) => setEdit({ ...edit, note: e.target.value })} />
              {edit.status === "dispatched" && (<>
                <input className={inp} placeholder="Empresa de transporte" value={edit.company} onChange={(e) => setEdit({ ...edit, company: e.target.value })} />
                <input className={inp} placeholder="Nº de seguimiento del transporte" value={edit.track} onChange={(e) => setEdit({ ...edit, track: e.target.value })} /></>)}
              <div className="flex gap-3"><button onClick={() => setStatus(edit.id, edit.status, edit.note, edit.company, edit.track)} className="rounded-xl bg-ink px-5 py-3 font-bold text-white">Guardar</button>
                <button onClick={() => setEdit(null)} className="px-3 font-bold text-ink/60">Cancelar</button></div>
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-4 text-sm font-bold">
              {NEXT[p.status] && <button className="rounded-lg bg-brand px-3 py-2 text-white" onClick={() => setStatus(p.id, NEXT[p.status]!)}>Avanzar a: {LABEL[NEXT[p.status]!]}</button>}
              <button className="py-2 text-brand" onClick={() => setEdit({ id: p.id, status: p.status, note: "", company: p.transport_company ?? "", track: p.transport_tracking ?? "" })}>{NEXT[p.status] ? "Otro estado" : "Cambiar estado"}</button>
              <button className="py-2 text-red-600" onClick={() => remove(p)}>Eliminar</button>
            </div>)}
        </div>))}
    </div></>);
}
export default function AdminEnvios() { return <AdminShell active="envios"><Envios /></AdminShell>; }
