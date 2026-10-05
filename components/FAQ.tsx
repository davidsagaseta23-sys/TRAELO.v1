import type { Faq } from "@/lib/settings";
export default function FAQ({ faqs }: { faqs: Faq[] }) {
  return (
    <section id="faq" className="sec">
      <div className="wrap">
        <h2 className="h2">Preguntas frecuentes</h2>
        <div className="mt-12 max-w-2xl divide-y divide-ink/10 border-t border-ink/10">
          {faqs.map((f) => (
            <details key={f.id} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold leading-snug">
                {f.question}<span className="text-2xl text-brand transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 whitespace-pre-line text-ink/70">{f.answer}</p>
            </details>))}
        </div>
      </div>
    </section>
  );
}
