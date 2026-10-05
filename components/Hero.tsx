export default function Hero() {
  return (
    <section id="inicio" className="wrap grid items-center gap-12 pb-20 pt-10 md:grid-cols-[1.1fr_1fr] md:pb-32 md:pt-24">
      <div>
        <h1 className="text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-7xl">TRAÉ LO QUE QUERÉS.</h1>
        <p className="mt-6 max-w-sm text-xl text-ink/60">Comprá en el exterior y nosotros lo traemos a Argentina.</p>
        <a href="#calculadora" className="mt-10 inline-block rounded-2xl bg-brand px-9 py-4 text-lg font-bold text-white">Calcular mi envío</a>
        <a href="/cuenta" className="mt-4 block text-base font-bold text-brand sm:ml-6 sm:mt-0 sm:inline-block">Seguir mi envío</a>
      </div>
      <img src="/isotipo.png" alt="" className="mx-auto w-72 md:w-full md:max-w-md" />
    </section>
  );
}
