const LS_KEY = "portfolio-accent";
const DEFAULT = "#3772ff";

export const PALETTE = [
  { label: "blue",   hex: "#3772ff" },
  { label: "red",    hex: "#df2935" },
  { label: "yellow", hex: "#fdca40" },
  { label: "violet", hex: "#7a5ae0" },
  { label: "green",  hex: "#1f8a5b" },
] as const;

export function getStoredAccent(): string {
  if (typeof window === "undefined") return DEFAULT;
  return localStorage.getItem(LS_KEY) ?? DEFAULT;
}

export function applyAccent(hex: string): void {
  document.documentElement.style.setProperty("--palette-blue", hex);
  localStorage.setItem(LS_KEY, hex);
}

export function initAccent(): string {
  const hex = getStoredAccent();
  document.documentElement.style.setProperty("--palette-blue", hex);
  return hex;
}
