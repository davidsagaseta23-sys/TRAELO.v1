export default function Consolidation({ days }: { days: string }) {
  return (
    <section className="wrap">
      <div className="rounded-[2rem] bg-ink px-8 py-14 text-white md:px-16 md:py-20">
        <h2 className="h2">¿Tenés varios paquetes?</h2>
        <p className="mt-3 text-lg text-white/70">Podés consolidarlos y enviarlos juntos.</p>
        <p className="mt-10 text-3xl font-extrabold text-[#4D8BFF] md:text-4xl">CONSOLIDACIÓN GRATIS</p>
        <p className="mt-2 text-lg text-white/70">{days} días de almacenamiento sin cargo.</p>
      </div>
    </section>
  );
}
