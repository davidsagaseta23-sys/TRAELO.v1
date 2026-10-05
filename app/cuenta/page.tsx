"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Pkg, isDone } from "@/lib/shipments";
import PackageCard from "@/components/PackageCard";
import { getSettings } from "@/lib/settings";

const inp = "w-full rounded-2xl bg-mist px-5 py-4 text-base font-semibold outline-none ring-2 ring-transparent focus:ring-brand";
type Profile = { full_name: string; client_code: string; phone: string };
const G = (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
);

export default function Cuenta() {
  const [ready, setReady] = useState(false);
  const [logged, setLogged] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [f, setF] = useState({ name: "", phone: "", email: "", pass: "" });
  const [msg, setMsg] = useState("");
  const [uid, setUid] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pkgs, setPkgs] = useState<Pkg[]>([]);
  const [tab, setTab] = useState<"curso" | "fin">("curso");
  const [phone, setPhone] = useState("");
  const [waNum, setWaNum] = useState("");
  useEffect(() => { getSettings().then((s) => setWaNum(s.whatsapp)); }, []);

  const load = useCallback(async () => {
    const { data: u } = await supabase().auth.getUser();
    if (!u.user) return;
    setUid(u.user.id);
    const [p, k] = await Promise.all([
      supabase().from("profiles").select("full_name,client_code,phone").eq("id", u.user.id).single(),
      supabase().from("packages").select("*, package_events(*)").order("created_at", { ascending: false }),
    ]);
    setProfile(p.data as Profile | null); setPkgs((k.data ?? []) as Pkg[]);
  }, []);
  useEffect(() => {
    supabase().auth.getSession().then(({ data }) => { setLogged(!!data.session); setReady(true); if (data.session) load(); });
  }, [load]);

  async function google() {
    const { error } = await supabase().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/cuenta` } });
    if (error) setMsg("No pudimos conectar con Google. Probá de nuevo.");
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    if (mode === "register") {
      const { data, error } = await supabase().auth.signUp({ email: f.email, password: f.pass, options: { data: { full_name: f.name, phone: f.phone } } });
      if (error) return setMsg(error.message);
      if (!data.session) return setMsg("Te enviamos un email para confirmar tu cuenta. Después ingresá desde acá.");
    } else {
      const { error } = await supabase().auth.signInWithPassword({ email: f.email, password: f.pass });
      if (error) return setMsg("Email o contraseña incorrectos.");
    }
    setLogged(true); load();
  }
  async function savePhone() {
    if (phone.trim().length < 6) return;
    await supabase().from("profiles").update({ phone: phone.trim() }).eq("id", uid); load();
  }

  if (!ready) return null;
  if (!logged) return (
    <main className="grid min-h-screen md:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-ink p-14 text-white md:flex">
        <a href="/"><img src="/logo.png" alt="TRAELO" className="h-8 w-auto rounded bg-white p-1.5" /></a>
        <div><h2 className="text-4xl font-extrabold leading-tight tracking-tight">Seguí tus compras en cada etapa.</h2>
          <p className="mt-4 max-w-sm text-lg text-white/70">Desde que llegan a nuestro warehouse hasta que las recibís en Argentina.</p></div>
        <img src="/isotipo.png" alt="" className="w-40 rounded-2xl bg-white p-4" />
      </aside>
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <a href="/" className="md:hidden"><img src="/logo.png" alt="TRAELO" className="mb-10 h-8 w-auto" /></a>
          <h1 className="text-3xl font-extrabold tracking-tight">{mode === "login" ? "Ingresá a tu cuenta" : "Creá tu cuenta"}</h1>
          <button onClick={google} className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-ink/15 py-4 font-bold">{G} Continuar con Google</button>
          <div className="my-6 flex items-center gap-4 text-sm text-ink/40"><span className="h-px flex-1 bg-ink/10" />o con tu email<span className="h-px flex-1 bg-ink/10" /></div>
          <form onSubmit={submit} className="space-y-3">
            {mode === "register" && (<>
              <input className={inp} placeholder="Nombre y apellido" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
              <input className={inp} type="tel" placeholder="WhatsApp" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} required /></>)}
            <input className={inp} type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
            <input className={inp} type="password" placeholder="Contraseña (mínimo 6 caracteres)" minLength={6} value={f.pass} onChange={(e) => setF({ ...f, pass: e.target.value })} required />
            {mode === "register" && <p className="text-xs text-ink/50">Al crear tu cuenta aceptás los <a href="/terminos" className="underline">Términos y condiciones</a>.</p>}
            {msg && <p role="alert" className="text-sm font-medium text-red-600">{msg}</p>}
            <button className="w-full rounded-2xl bg-brand py-4 text-lg font-bold text-white">{mode === "login" ? "Ingresar" : "Crear cuenta"}</button>
          </form>
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setMsg(""); }} className="mt-6 text-sm font-bold text-brand">
            {mode === "login" ? "¿No tenés cuenta? Registrate" : "¿Ya tenés cuenta? Ingresá"}</button>
        </div>
      </section>
    </main>);

  const list = pkgs.filter((p) => (tab === "fin") === isDone(p.status));
  return (<>
    <header className="border-b border-ink/5"><div className="wrap flex h-[4.5rem] items-center justify-between">
      <a href="/"><img src="/logo.png" alt="TRAELO" className="h-8 w-auto" /></a>
      <button onClick={async () => { await supabase().auth.signOut(); setLogged(false); setPkgs([]); }} className="text-sm font-bold text-ink/60">Cerrar sesión</button>
    </div></header>
    <main className="bg-mist pb-20"><div className="wrap pt-10">
      <div className="rounded-[2rem] bg-ink p-8 text-white md:p-10">
        <p className="text-white/60">Bienvenido/a</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">{profile?.full_name || "Mi cuenta"}</h1>
        {profile && <p className="mt-4 text-white/70">Tu código de cliente: <b className="rounded-lg bg-white/10 px-2 py-1 text-white">{profile.client_code}</b></p>}
      </div>
      {profile && !profile.phone && (
        <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-white p-5 sm:flex-row">
          <p className="flex-1 font-medium">Agregá tu WhatsApp para que podamos avisarte de tus envíos.</p>
          <input className={inp + " sm:max-w-xs"} type="tel" placeholder="WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button onClick={savePhone} className="rounded-2xl bg-brand px-6 py-3 font-bold text-white">Guardar</button>
        </div>)}
      <div className="mt-10 flex gap-2">
        {([["curso", "En curso"], ["fin", "Finalizados"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-full px-5 py-2.5 text-sm font-bold ${tab === k ? "bg-ink text-white" : "bg-white text-ink/60"}`}>{l}</button>))}
      </div>
      <div className="mt-6 space-y-5">
        {list.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center text-ink/60">
            {tab === "curso" ? "No tenés envíos en curso. Cuando recibamos tu paquete en el warehouse lo vas a ver acá." : "Todavía no tenés envíos finalizados."}</div>
        ) : list.map((p) => <PackageCard key={p.id} p={p} whatsapp={waNum} />)}
      </div>
    </div></main></>);
}
