"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
export default function AdminShell({ active, children }: { active: "envios" | "clientes" | "tarifas" | "contenido"; children: React.ReactNode }) {
  const [s, setS] = useState<"load" | "out" | "in">("load");
  const [email, setEmail] = useState(""); const [pass, setPass] = useState(""); const [err, setErr] = useState("");
  useEffect(() => { supabase().auth.getSession().then(({ data }) => setS(data.session ? "in" : "out")); }, []);
  async function login(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase().auth.signInWithPassword({ email, password: pass });
    if (error) setErr("Email o contraseña incorrectos."); else setS("in");
  }
  if (s === "load") return null;
  const inp = "w-full rounded-xl bg-mist px-4 py-3 outline-none ring-2 ring-transparent focus:ring-brand";
  if (s === "out") return (
    <main className="flex min-h-screen items-center justify-center bg-mist p-5">
      <form onSubmit={login} className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-8">
        <img src="/logo.png" alt="TRAELO" className="h-8" /><h1 className="text-xl font-extrabold">Administración</h1>
        <input className={inp} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={inp} type="password" placeholder="Contraseña" value={pass} onChange={(e) => setPass(e.target.value)} required />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full rounded-xl bg-brand py-3 font-bold text-white">Ingresar</button>
      </form>
    </main>);
  const tab = (k: string, href: string, l: string) => (
    <a href={href} className={`rounded-full px-4 py-2 text-sm font-bold ${active === k ? "bg-ink text-white" : "text-ink/60"}`}>{l}</a>);
  return (
    <div className="min-h-screen bg-mist">
      <header className="bg-white"><div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <div className="flex items-center gap-5"><img src="/logo.png" alt="TRAELO" className="h-7" />
          <nav className="flex gap-1 overflow-x-auto">{tab("envios", "/admin/envios", "Envíos")}{tab("clientes", "/admin/clientes", "Clientes")}{tab("tarifas", "/admin", "Tarifas")}{tab("contenido", "/admin/contenido", "Contenido")}</nav></div>
        <button onClick={async () => { await supabase().auth.signOut(); setS("out"); }} className="text-sm font-bold text-ink/60">Salir</button>
      </div></header>
      <main className="mx-auto max-w-5xl p-5 md:py-10">{children}</main>
    </div>);
}
