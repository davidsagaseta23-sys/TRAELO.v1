import { getActiveRates } from "@/lib/rates";
import { fill, getFaqs, getSettings } from "@/lib/settings";
import Header from "@/components/Header"; import Hero from "@/components/Hero";
import Calculator from "@/components/Calculator"; import HowItWorks from "@/components/HowItWorks";
import Rates from "@/components/Rates"; import Consolidation from "@/components/Consolidation";
import FAQ from "@/components/FAQ"; import Cta from "@/components/Cta"; import Footer from "@/components/Footer";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [rates, s, faqs] = await Promise.all([getActiveRates(), getSettings(), getFaqs()]);
  return (<>
    <Header /><main>
      <Hero /><Calculator rates={rates} whatsapp={s.whatsapp} minKg={s.min_kg} /><HowItWorks /><Rates rates={rates} />
      <Consolidation days={s.storage_days} /><FAQ faqs={faqs.map((f) => ({ ...f, answer: fill(f.answer, s) }))} /><Cta whatsapp={s.whatsapp} />
    </main><Footer whatsapp={s.whatsapp} instagram={s.instagram} />
  </>);
}
