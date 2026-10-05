import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { brand: "#0559FF", ink: "#1D242C", mist: "#F3F5F8" },
    fontFamily: { sans: ["\"Manrope Variable\"", "system-ui", "sans-serif"] },
  } },
  plugins: [],
} satisfies Config;
