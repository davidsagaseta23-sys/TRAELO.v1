import { wa } from "@/lib/rates";
export default function Cta({ whatsapp }: { whatsapp: string }) {
  return (
    <section className="bg-brand px-6 py-20 text-center text-white md:py-32">
      <h2 className="text-3xl font-extrabold tracking-tight md:text-6xl">¿Qué querés traer?</h2>
      <p className="mt-3 text-lg text-white/85">Calculá tu envío o hablá con nosotros.</p>
      <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
        <a href="#calculadora" className="rounded-2xl bg-white px-8 py-4 text-lg font-bold text-brand">Calcular envío</a>
        <a href={wa("Hola TRAELO, quiero hacer una consulta.", whatsapp)} target="_blank" rel="noopener noreferrer" className="rounded-2xl border-2 border-white px-8 py-4 text-lg font-bold">WhatsApp</a>
      </div>
    </section>
  );
}
