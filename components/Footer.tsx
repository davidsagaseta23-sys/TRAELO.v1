import { wa } from "@/lib/rates";
export default function Footer({ whatsapp, instagram }: { whatsapp: string; instagram: string }) {
  return (
    <footer className="py-12">
      <div className="wrap flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <img src="/logo.png" alt="TRAELO" className="h-8 w-auto self-start" />
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink/70">
          <a href="#inicio">Inicio</a><a href="#como-funciona">Cómo funciona</a><a href="#tarifas">Tarifas</a><a href="#faq">FAQ</a><a href="/terminos">Términos y condiciones</a>
        </nav>
        <div className="flex gap-6 text-sm font-bold text-brand">
          <a href={instagram || "#"} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={wa("Hola TRAELO", whatsapp)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
      </div>
    </footer>
  );
}
