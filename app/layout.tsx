import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
export const metadata: Metadata = { title: "TRAELO", description: "Comprá en el exterior y nosotros lo traemos a Argentina. Calculá tu envío." };
export const viewport: Viewport = { width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}
