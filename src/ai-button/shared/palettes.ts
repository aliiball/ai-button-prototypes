import type { Palette, PaletteId } from "./types";

/**
 * 4 palet — atölye konfigüratörünün renk ekseni.
 * Tüm motifler aynı anahtarları okur: palet eklemek = obje yazmak.
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

export const warm: Palette = {
  id: "warm",
  label: "Warm",
  nucleusCore: "#fff7ed",
  nucleusMid: "#fbbf24",
  nucleusDeep: "#7c2d12",
  auraInner: "#fef3c7",
  auraMid: "#fb923c",
  auraOuter: "#431407",
  orbitDeep: "#9a3412",
  orbitMid: "#f97316",
  orbitHighlight: "#fed7aa",
  electron: "#fde047",
  boltDeep: "#451a03",
  boltMid: "#fbbf24",
  boltBright: "#fff7ed",
  shellClass: "glass-shell-warm",
};

export const ocean: Palette = {
  id: "ocean",
  label: "Ocean",
  nucleusCore: "#ecfeff",
  nucleusMid: "#67e8f9",
  nucleusDeep: "#0c4a6e",
  auraInner: "#cffafe",
  auraMid: "#22d3ee",
  auraOuter: "#082f49",
  orbitDeep: "#155e75",
  orbitMid: "#06b6d4",
  orbitHighlight: "#a5f3fc",
  electron: "#67e8f9",
  boltDeep: "#083344",
  boltMid: "#22d3ee",
  boltBright: "#ecfeff",
  shellClass: "glass-shell-ocean",
};

export const cyber: Palette = {
  id: "cyber",
  label: "Cyber",
  nucleusCore: "#f0fdf4",
  nucleusMid: "#86efac",
  nucleusDeep: "#14532d",
  auraInner: "#dcfce7",
  auraMid: "#4ade80",
  auraOuter: "#052e16",
  orbitDeep: "#166534",
  orbitMid: "#22c55e",
  orbitHighlight: "#bbf7d0",
  electron: "#a3e635",
  boltDeep: "#052e16",
  boltMid: "#22c55e",
  boltBright: "#ecfccb",
  shellClass: "glass-shell-cyber",
};

export const PALETTES: Palette[] = [iridescent, warm, ocean, cyber];

export const PALETTE_MAP: Record<PaletteId, Palette> = {
  iridescent,
  warm,
  ocean,
  cyber,
};

export function getPalette(id: PaletteId = "iridescent"): Palette {
  return PALETTE_MAP[id];
}
