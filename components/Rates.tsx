import { Rate, usd } from "@/lib/rates";
export default function Rates({ rates }: { rates: Rate[] }) {
  const origins = Array.from(new Set(rates.map((r) => r.origin)));
  return (
    <section id="tarifas" className="sec pt-0 md:pt-0">
      <div className="wrap">
        <h2 className="h2">Tarifas</h2>
        <p className="sub">Precio por kilo del envío internacional.</p>
        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-20">
          {origins.map((o) => (
            <div key={o}>
              <h3 className="text-2xl font-extrabold">{o}</h3>
              <ul className="mt-5">
                {rates.filter((r) => r.origin === o).map((r) => (
                  <li key={r.id} className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-4">
                    <span className="text-lg font-medium">{r.product_name}</span>
                    <span className="whitespace-nowrap text-lg font-extrabold text-brand">{r.price_per_kg === null ? "Consultar tarifa" : `${usd(r.price_per_kg)}/kg`}</span>
                  </li>))}
              </ul>
            </div>))}
        </div>
      </div>
    </section>
  );
}
