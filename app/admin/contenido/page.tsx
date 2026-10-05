"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Faq } from "@/lib/settings";
import AdminShell from "@/components/AdminShell";

const inp = "w-full rounded-xl bg-mist px-3 py-3 outline-none ring-2 ring-transparent focus:ring-brand";
const card = "rounded-2xl bg-white p-5 sm:p-6";

function Datos({ say }: { say: (m: string) => void }) {
  const [v, setV] = useState({ whatsapp: "", instagram: "", storage_days: "15", min_kg: "1" });
  useEffect(() => { supabase().from("site_settings").select("key,value").then(({ data }) => {
    const m: Record<string, string> = {}; (data ?? []).forEach((r) => (m[r.key] = r.value)); setV((x) => ({ ...x, ...m })); }); }, []);
  async function save() {
    if (!(Number(v.min_kg) > 0) || !(Number(v.storage_days) >= 0)) return say("Revisá el peso mínimo y los días gratis.");
    const { error } = await supabase().from("site_settings").upsert(Object.entries(v).map(([key, value]) => ({ key, value: value.trim() })));
    say(error ? error.message : "Datos guardados. Ya se ven en la web.");
  }
  const f = (k: keyof typeof v, label: string, hint: string) => (
    <label className="block"><span className="mb-1 block text-sm font-bold">{label}</span>
      <input className={inp} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} /><span className="text-xs text-ink/50">{hint}</span></label>);
  return (<div className={card + " grid gap-5 sm:grid-cols-2"}>
    {f("whatsapp", "WhatsApp", "Con código de país, sin + ni espacios. Ej: 5491155551234")}
    {f("instagram", "Link de Instagram", "Ej: https://instagram.com/traelo.ar")}
    {f("storage_days", "Días de almacenamiento gratis", "Se actualiza en consolidación y preguntas frecuentes")}
    {f("min_kg", "Peso mínimo facturable (kg)", "Lo usa la calculadora")}
    <button onClick={save} className="rounded-xl bg-ink px-5 py-3 font-bold text-white sm:col-span-2 sm:w-fit">Guardar datos</button></div>);
}

function Terminos({ say }: { say: (m: string) => void }) {
  const [t, setT] = useState({ title: "Términos y Condiciones", body: "" });
  useEffect(() => { supabase().from("pages").select("title,body").eq("slug", "terminos").maybeSingle().then(({ data }) => { if (data) setT(data); }); }, []);
  async function save() {
    const { error } = await supabase().from("pages").upsert({ slug: "terminos", title: t.title.trim() || "Términos y Condiciones", body: t.body, updated_at: new Date().toISOString() });
    say(error ? error.message : "Términos publicados.");
  }
  return (<div className={card + " space-y-4"}>
    <input className={inp} value={t.title} onChange={(e) => setT({ ...t, title: e.target.value })} />
    <textarea className={inp + " h-96 leading-relaxed"} placeholder="Pegá acá el texto. Separá los párrafos con una línea en blanco. Para un título de sección empezá el párrafo con ## " value={t.body} onChange={(e) => setT({ ...t, body: e.target.value })} />
    <div className="flex items-center gap-5"><button onClick={save} className="rounded-xl bg-ink px-5 py-3 font-bold text-white">Publicar</button>
      <a href="/terminos" target="_blank" className="text-sm font-bold text-brand">Ver página pública</a></div></div>);
}

function Preguntas({ say }: { say: (m: string) => void }) {
  const [rows, setRows] = useState<Faq[]>([]); const [e, setE] = useState<{ id?: string; question: string; answer: string; active: boolean } | null>(null);
  const load = useCallback(async () => { const { data } = await supabase().from("faqs").select("*").order("position"); setRows((data ?? []) as Faq[]); }, []);
  useEffect(() => { load(); }, [load]);
  async function save() {
    if (!e || !e.question.trim() || !e.answer.trim()) return say("Completá pregunta y respuesta.");
    const row = { question: e.question.trim(), answer: e.answer.trim(), active: e.active };
    const { error } = e.id ? await supabase().from("faqs").update(row).eq("id", e.id) : await supabase().from("faqs").insert({ ...row, position: Math.max(0, ...rows.map((r) => r.position)) + 1 });
    if (error) return say(error.message); setE(null); say("Pregunta guardada."); load();
  }
  async function move(i: number, d: number) {
    const a = rows[i], b = rows[i + d]; if (!b) return;
    await supabase().from("faqs").update({ position: b.position }).eq("id", a.id);
    await supabase().from("faqs").update({ position: a.position }).eq("id", b.id); load();
  }
  async function del(r: Faq) {
    if (!confirm(`¿Eliminar "${r.question}"?`)) return;
    const { error } = await supabase().from("faqs").delete().eq("id", r.id); say(error ? error.message : "Pregunta eliminada."); load();
  }
  return (<div className="space-y-3">
    <button onClick={() => setE({ question: "", answer: "", active: true })} className="rounded-xl bg-brand px-5 py-3 font-bold text-white">+ Nueva pregunta</button>
    <p className="text-xs text-ink/50">Podés usar {"{{peso_minimo}}"} y {"{{dias_gratis}}"} en las respuestas: se reemplazan por los valores de “Datos del negocio”.</p>
    {e && (<div className={card + " space-y-3"}>
      <input className={inp} placeholder="Pregunta" value={e.question} onChange={(x) => setE({ ...e, question: x.target.value })} />
      <textarea className={inp + " h-28"} placeholder="Respuesta" value={e.answer} onChange={(x) => setE({ ...e, answer: x.target.value })} />
      <label className="flex items-center gap-2 font-medium"><input type="checkbox" checked={e.active} onChange={(x) => setE({ ...e, active: x.target.checked })} /> Visible en la web</label>
      <div className="flex gap-3"><button onClick={save} className="rounded-xl bg-ink px-5 py-3 font-bold text-white">Guardar</button><button onClick={() => setE(null)} className="px-3 font-bold text-ink/60">Cancelar</button></div></div>)}
    {rows.map((r, i) => (
      <div key={r.id} className={card + " flex flex-wrap items-start justify-between gap-3"}>
        <div className="min-w-0 flex-1"><b className={r.active ? "" : "text-ink/40"}>{r.question}</b>{!r.active && <span className="ml-2 text-xs font-bold text-ink/40">OCULTA</span>}
          <p className="mt-1 line-clamp-2 text-sm text-ink/60">{r.answer}</p></div>
        <div className="flex gap-4 text-sm font-bold">
          <button disabled={i === 0} onClick={() => move(i, -1)} className="disabled:opacity-25" aria-label="Subir">↑</button>
          <button disabled={i === rows.length - 1} onClick={() => move(i, 1)} className="disabled:opacity-25" aria-label="Bajar">↓</button>
          <button className="text-brand" onClick={() => setE({ id: r.id, question: r.question, answer: r.answer, active: r.active })}>Editar</button>
          <button className="text-red-600" onClick={() => del(r)}>Eliminar</button></div>
      </div>))}</div>);
}

function Contenido() {
  const [tab, setTab] = useState<"datos" | "terminos" | "faq">("datos"); const [msg, setMsg] = useState("");
  const tabs = [["datos", "Datos del negocio"], ["terminos", "Términos y condiciones"], ["faq", "Preguntas frecuentes"]] as const;
  return (<>
    <h1 className="text-2xl font-extrabold">Contenido</h1>
    <div className="mt-5 flex flex-wrap gap-2">{tabs.map(([k, l]) => (
      <button key={k} onClick={() => { setTab(k); setMsg(""); }} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === k ? "bg-ink text-white" : "bg-white text-ink/60"}`}>{l}</button>))}</div>
    {msg && <p className="mt-4 rounded-xl bg-white p-3 text-sm">{msg}</p>}
    <div className="mt-5">{tab === "datos" ? <Datos say={setMsg} /> : tab === "terminos" ? <Terminos say={setMsg} /> : <Preguntas say={setMsg} />}</div></>);
}
export default function AdminContenido() { return <AdminShell active="contenido"><Contenido /></AdminShell>; }
