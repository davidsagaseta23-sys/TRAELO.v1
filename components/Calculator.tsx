"use client";
import { useMemo, useState } from "react";
import { Rate, usd, wa } from "@/lib/rates";
import { billableWeight, parseWeight, shippingCost } from "@/lib/calculator";

const field = "w-full appearance-none rounded-2xl bg-mist px-5 py-4 text-lg font-semibold outline-none ring-2 ring-transparent focus:ring-brand";

export default function Calculator({ rates, whatsapp, minKg }: { rates: Rate[]; whatsapp: string; minKg: number }) {
  const origins = useMemo(() => Array.from(new Set(rates.map((r) => r.origin))), [rates]);
  const [origin, setOrigin] = useState(origins[0] ?? "");
  const options = rates.filter((r) => r.origin === origin);
  const [rateId, setRateId] = useState("");
  const rate = options.find((r) => r.id === rateId) ?? options[0];
  const [weight, setWeight] = useState("");
  const kg = parseWeight(weight);
  const price = rate?.price_per_kg ?? null;
  const total = kg !== null && price !== null ? shippingCost(kg, price, minKg) : null;
  const message = [
    "Hola TRAELO, quiero consultar por un envío.", `Origen: ${origin}`, `Tipo de producto: ${rate?.product_name ?? "-"}`,
    `Peso: ${kg !== null ? `${kg} kg` : "-"}`, `Costo estimado: ${total !== null ? usd(total) : "Consultar tarifa"}`,
  ].join("\n");

  return (
    <section id="calculadora" className="sec">
      <div className="wrap grid gap-10 md:grid-cols-2 md:gap-20">
        <div className="md:pt-4">
          <h2 className="h2">¿Cuánto cuesta traerlo?</h2>
          <p className="sub">Calculá de forma rápida el costo estimado de tu envío.</p>
        </div>
        <div className="space-y-6 rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_-20px_rgba(5,89,255,0.25)] ring-1 ring-ink/5 sm:p-8">
          <label className="block"><span className="mb-2 block text-sm font-semibold text-ink/60">Origen</span>
            <select className={field} value={origin} onChange={(e) => { setOrigin(e.target.value); setRateId(""); }}>
              {origins.map((o) => <option key={o}>{o}</option>)}
            </select></label>
          <label className="block"><span className="mb-2 block text-sm font-semibold text-ink/60">Tipo de producto</span>
            <select className={field} value={rate?.id ?? ""} onChange={(e) => setRateId(e.target.value)}>
              {options.map((r) => <option key={r.id} value={r.id}>{r.product_name}</option>)}
            </select></label>
          <label className="block"><span className="mb-2 block text-sm font-semibold text-ink/60">Peso del paquete (kg)</span>
            <input className={field} inputMode="decimal" placeholder="Ej: 2.5" value={weight}
              onChange={(e) => setWeight(e.target.value.replace(/[^0-9.,]/g, ""))} />
            {kg !== null && kg < minKg && <span className="mt-2 block text-sm text-ink/60">El peso mínimo facturable es {minKg} kg.</span>}
          </label>
          <div className="rounded-2xl bg-ink p-6 text-white">
            <p className="text-sm text-white/70">Tu envío estimado</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight">
              {!rate ? "—" : price === null ? "Consultar tarifa" : total === null ? "Ingresá el peso" : usd(total)}
            </p>
            {total !== null && kg !== null && price !== null && (
              <p className="mt-1 text-sm text-white/70">{billableWeight(kg, minKg)} kg × {usd(price)}</p>)}
          </div>
          <p className="text-sm leading-relaxed text-ink/60">Este valor corresponde al envío internacional. El envío dentro de Argentina se cotiza por separado.</p>
          <a href={wa(message, whatsapp)} target="_blank" rel="noopener noreferrer" className="block rounded-2xl bg-brand py-4 text-center text-lg font-bold text-white">Consultar por WhatsApp</a>
        </div>
      </div>
    </section>
  );
}
