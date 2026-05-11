import type { Palette } from "./types";

/**
 * Tek iridescent palet — mor + pembe + fuchsia + indigo.
 * Apple Intelligence / Gemini / Claude vibe.
 */
export const iridescent: Palette = {
  id: "iridescent",
  label: "Iridescent",
  nucleusCore: "#fef3ff",
  nucleusMid: "#e0aaff",
  nucleusDeep: "#5b21b6",
  auraInner: "#f5d0fe",
  auraMid: "#a78bfa",
  auraOuter: "#1e1b4b",
  orbitDeep: "#4c1d95",
  orbitMid: "#a855f7",
  orbitHighlight: "#fce7f3",
  electron: "#f0abfc",
  boltDeep: "#3b0764",
  boltMid: "#c084fc",
  boltBright: "#fdf4ff",
  shellClass: "glass-shell-iridescent",
};

export const PALETTES: Palette[] = [iridescent];

export function getPalette(): Palette {
  return iridescent;
}
