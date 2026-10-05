"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fdate } from "@/lib/shipments";
import AdminShell from "@/components/AdminShell";
type C = { id: string; client_code: string; full_name: string; phone: string; created_at: string; packages: { id: string }[] };
function Clientes() {
  const [rows, setRows] = useState<C[]>([]); const [q, setQ] = useState(""); const [msg, setMsg] = useState("");
  useEffect(() => {
    supabase().from("profiles").select("id,client_code,full_name,phone,created_at,packages(id)").order("client_code", { ascending: false })
      .then(({ data, error }) => { if (error) setMsg(error.message); else setRows((data ?? []) as C[]); });
  }, []);
  const shown = useMemo(() => rows.filter((c) => `${c.client_code} ${c.full_name} ${c.phone}`.toLowerCase().includes(q.toLowerCase())), [rows, q]);
  return (<>
    <div className="flex items-baseline justify-between"><h1 className="text-2xl font-extrabold">Clientes</h1><span className="text-sm text-ink/60">{rows.length} registrados</span></div>
    {msg && <p className="mt-4 rounded-xl bg-white p-3 text-sm">{msg}</p>}
    <input className="mt-5 w-full rounded-xl bg-white px-4 py-3 outline-none ring-2 ring-transparent focus:ring-brand" placeholder="Buscar por código, nombre o teléfono" value={q} onChange={(e) => setQ(e.target.value)} />
    <div className="mt-5 space-y-3">
      {shown.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-ink/60">No hay clientes para mostrar.</p>}
      {shown.map((c) => (
        <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5">
          <div><p><b>{c.full_name || "Sin nombre"}</b> <span className="ml-2 rounded-lg bg-mist px-2 py-1 text-sm font-bold">{c.client_code}</span></p>
            <p className="mt-1 text-sm text-ink/60">{c.phone || "Sin teléfono"} · {c.packages.length} envío(s) · Alta {fdate(c.created_at)}</p></div>
          <div className="flex gap-4 text-sm font-bold">
            {c.phone && <a className="py-2 text-brand" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}>WhatsApp</a>}
            <a className="rounded-lg bg-brand px-3 py-2 text-white" href={`/admin/envios?cliente=${c.client_code}`}>Cargar paquete</a>
          </div>
        </div>))}
    </div></>);
}
export default function AdminClientes() { return <AdminShell active="clientes"><Clientes /></AdminShell>; }
