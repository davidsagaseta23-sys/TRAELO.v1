"use client";
import { useState } from "react";
const links = [["Inicio", "#inicio"], ["Cómo funciona", "#como-funciona"], ["Tarifas", "#tarifas"], ["FAQ", "#faq"]];
export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur">
      <div className="wrap flex h-[4.5rem] items-center justify-between">
        <a href="#inicio"><img src="/logo.png" alt="TRAELO" className="h-8 w-auto" /></a>
        <nav className="hidden items-center gap-9 text-sm font-semibold md:flex">
          {links.map(([l, h]) => <a key={h} href={h} className="text-ink/70 hover:text-ink">{l}</a>)}
          <a href="/cuenta" className="text-ink/70 hover:text-ink">Mi cuenta</a>
          <a href="#calculadora" className="rounded-full bg-brand px-5 py-2.5 font-bold text-white">Calcular envío</a>
        </nav>
        <button className="-mr-2 p-2 md:hidden" aria-label="Menú" aria-expanded={open} onClick={() => setOpen(!open)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="wrap flex flex-col pb-6 md:hidden">
          {links.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="py-3 text-xl font-bold">{l}</a>)}
          <a href="/cuenta" className="py-3 text-xl font-bold">Mi cuenta</a>
          <a href="#calculadora" onClick={() => setOpen(false)} className="mt-3 rounded-2xl bg-brand py-4 text-center font-bold text-white">Calcular envío</a>
        </nav>
      )}
    </header>
  );
}
