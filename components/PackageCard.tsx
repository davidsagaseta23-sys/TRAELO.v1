import { BADGE, LABEL, Pkg, STEPS, fdate, stepOf } from "@/lib/shipments";
import { wa } from "@/lib/rates";
export default function PackageCard({ p, whatsapp }: { p: Pkg; whatsapp?: string }) {
  const cur = stepOf(p.status);
  const events = [...(p.package_events ?? [])].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const steps = STEPS.map((s, i) => (i === 3 ? (p.status === "delivered" ? "Entregado" : p.status === "dispatched" ? "Despachado por transporte" : s) : s));
  return (
    <article className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_-18px_rgba(29,36,44,0.25)] ring-1 ring-ink/5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-xl font-extrabold">{p.description}</h3>
          <p className="mt-1 text-sm text-ink/60">Desde {p.origin}{p.weight_kg ? ` · ${p.weight_kg} kg` : ""}{p.store_tracking ? ` · Tracking tienda: ${p.store_tracking}` : ""}</p>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-sm font-bold ${BADGE[p.status]}`}>{LABEL[p.status]}</span>
      </div>
      <ol className="mt-8 grid grid-cols-4 gap-2">
        {steps.map((s, i) => (
          <li key={s}>
            <div className="flex items-center">
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-extrabold ${i <= cur ? "bg-brand text-white" : "bg-mist text-ink/40"}`}>{i < cur || (i === cur && cur === 3) ? "✓" : i + 1}</span>
              {i < 3 && <span className={`mx-1 h-1 flex-1 rounded-full ${i < cur ? "bg-brand" : "bg-mist"}`} />}
            </div>
            <p className={`mt-2 text-xs font-bold leading-tight sm:text-sm ${i <= cur ? "text-ink" : "text-ink/35"}`}>{s}</p>
          </li>))}
      </ol>
      {p.status === "dispatched" && (p.transport_company || p.transport_tracking) && (
        <div className="mt-6 rounded-2xl bg-mist p-4 text-sm"><p className="font-bold">Despachado por transporte</p>
          <p className="mt-1 text-ink/70">{p.transport_company ?? "-"}{p.transport_tracking ? ` · Nº de seguimiento: ${p.transport_tracking}` : ""}</p></div>)}
      {events.length > 0 && (
        <ul className="mt-6 space-y-3 border-l-2 border-mist pl-5">
          {events.map((e) => (
            <li key={e.id} className="relative text-sm">
              <span className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full bg-brand" />
              <b>{LABEL[e.status]}</b> <span className="text-ink/50">· {fdate(e.created_at)}</span>
              {e.note && <p className="text-ink/70">{e.note}</p>}
            </li>))}
        </ul>)}
      <a href={wa(`Hola TRAELO, consulto por mi envío: ${p.description}`, whatsapp)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-sm font-bold text-brand">Consultar por este envío</a>
    </article>
  );
}
