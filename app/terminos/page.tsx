import { supabase } from "@/lib/supabase";
import { fdate } from "@/lib/shipments";
export const dynamic = "force-dynamic";
export const metadata = { title: "Términos y Condiciones | TRAELO" };
export default async function Terminos() {
  let page: { title: string; body: string; updated_at: string } | null = null;
  try { const { data } = await supabase().from("pages").select("title,body,updated_at").eq("slug", "terminos").maybeSingle(); page = data; } catch {}
  const blocks = (page?.body ?? "").split(/\n{2,}/).filter((b) => b.trim());
  return (<>
    <header className="border-b border-ink/5"><div className="wrap flex h-[4.5rem] items-center justify-between">
      <a href="/"><img src="/logo.png" alt="TRAELO" className="h-8 w-auto" /></a>
      <a href="/" className="text-sm font-semibold text-ink/70">Volver al inicio</a></div></header>
    <main className="wrap py-14 md:py-24"><article className="max-w-2xl">
      <h1 className="h2">{page?.title || "Términos y Condiciones"}</h1>
      {blocks.length === 0 ? <p className="sub">Estamos preparando este documento. Consultanos por WhatsApp ante cualquier duda.</p> : (<>
        {page?.updated_at && <p className="mt-3 text-sm text-ink/50">Última actualización: {fdate(page.updated_at)}</p>}
        <div className="mt-10 space-y-5 text-lg leading-relaxed text-ink/80">
          {blocks.map((b, i) => b.startsWith("## ")
            ? <h2 key={i} className="pt-4 text-2xl font-extrabold text-ink">{b.slice(3)}</h2>
            : <p key={i} className="whitespace-pre-line">{b}</p>)}
        </div></>)}
    </article></main></>);
}
