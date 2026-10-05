const steps = ["Comprás", "Nos enviás tu compra", "La recibimos y pesamos", "La enviamos a Argentina"];
export default function HowItWorks() {
  return (
    <section id="como-funciona" className="sec">
      <div className="wrap">
        <h2 className="h2">Cómo funciona</h2>
        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s}>
              <span className="text-5xl font-extrabold text-brand">0{i + 1}</span>
              <p className="mt-3 text-xl font-bold leading-snug">{s}</p>
            </li>))}
        </ol>
      </div>
    </section>
  );
}
