import type { IntensityId, Palette, PaletteId } from "../ai-button/shared/types";

/**
 * Atölye config'leri — her motifin slider/toggle/select alanları tipte.
 * "intensity" preset chip'i bu config'in tüm alanlarını belirli bir snapshot'a kaydırır.
 * Stil chip'i hangi component'in render edileceğini belirler; ortak alanlar carry-over olur.
 */

export type BoltMode = "none" | "hover" | "always";
export type RotationDir = "cw" | "ccw" | "alternate";

export type AtomConfig = {
  // Orbit topolojisi
  orbitRx: number;
  orbitRy: number;
  orbitPeriod: number;
  electronCount: number;
  orbitPlaneCount: number;
  // Nucleus / aura
  nucleusRadius: number;
  auraPulseDur: number;
  auraOpacity: number;
  showAura: boolean;
  // Bolt
  boltMode: BoltMode;
  boltThickness: number;
  // Visual
  glowStrength: number;
  hoverScale: number;
};

export type VortexConfig = {
  ringCount: number;
  baseRotation: number;
  ringFalloff: number;
  outerRx: number;
  aspect: number;
  centerHole: number;
  auraStrength: number;
  strokeWidth: number;
  hoverSpeedBoost: number;
  rotationDir: RotationDir;
};

export type PlasmaConfig = {
  arcCount: number;
  arcSegments: number;
  jitter: number;
  speed: number;
  hoverArcBonus: number;
  sphereRadius: number;
  highlightIntensity: number;
  coreRadius: number;
  arcStrokeWidth: number;
  auraStrength: number;
  showHighlight: boolean;
};

export type PulsarConfig = {
  flareCount: number;
  flareLength: number;
  rotationDuration: number;
  ringCount: number;
  ringDuration: number;
  auraPulse: number;
  coreMinScale: number;
  coreMaxScale: number;
  flareAlternation: boolean;
  flareStrokeWidth: number;
  auraIntensity: number;
  hoverSpeedBoost: number;
};

export type FrameStyle = "glass" | "outline" | "minimal" | "none";
export type Background = "dark" | "light" | "custom";

export type SharedConfig = {
  size: number;
  paletteId: PaletteId;
  customPalette: Palette | null;
  paused: boolean;
  forceHover: boolean;
  background: Background;
  backgroundCustom: string;
  frameStyle: FrameStyle;
};

export type MotifConfigMap = {
  atom: AtomConfig;
  vortex: VortexConfig;
  "plasma-ball": PlasmaConfig;
  pulsar: PulsarConfig;
};

export type AnyMotifConfig =
  | AtomConfig
  | VortexConfig
  | PlasmaConfig
  | PulsarConfig;

// ───────────────────────────────────────────────────────────────────────────────
// DEFAULTS — stil × yoğunluk preset matrisi
// ───────────────────────────────────────────────────────────────────────────────

export const SHARED_DEFAULT: SharedConfig = {
  size: 180,
  paletteId: "iridescent",
  customPalette: null,
  paused: false,
  forceHover: false,
  background: "dark",
  backgroundCustom: "#15102b",
  frameStyle: "glass",
};

// Atom — 3 stil × 3 intensity = 9 preset
const ATOM_BASE: AtomConfig = {
  orbitRx: 22,
  orbitRy: 9,
  orbitPeriod: 7,
  electronCount: 3,
  orbitPlaneCount: 3,
  nucleusRadius: 4,
  auraPulseDur: 1.6,
  auraOpacity: 0.55,
  showAura: true,
  boltMode: "hover",
  boltThickness: 1.6,
  glowStrength: 1.6,
  hoverScale: 1.12,
};

export const ATOM_PRESETS: Record<string, Record<IntensityId, AtomConfig>> = {
  "atom-classic": {
    calm: { ...ATOM_BASE, orbitPeriod: 12, auraPulseDur: 2.4, boltMode: "none", glowStrength: 1.2 },
    normal: { ...ATOM_BASE },
    intense: { ...ATOM_BASE, orbitPeriod: 4, auraPulseDur: 1.0, boltMode: "always", glowStrength: 2.4, hoverScale: 1.2 },
  },
  "atom-quark": {
    calm: { ...ATOM_BASE, orbitPlaneCount: 1, electronCount: 4, orbitPeriod: 9, orbitRy: 7, auraPulseDur: 2.4, boltMode: "none" },
    normal: { ...ATOM_BASE, orbitPlaneCount: 1, electronCount: 5, orbitPeriod: 5, orbitRy: 7 },
    intense: { ...ATOM_BASE, orbitPlaneCount: 1, electronCount: 6, orbitPeriod: 2.5, orbitRy: 7, auraPulseDur: 1.0, glowStrength: 2.4 },
  },
  "atom-minimal": {
    calm: { ...ATOM_BASE, orbitPlaneCount: 1, electronCount: 1, orbitPeriod: 12, orbitRy: 8, auraPulseDur: 2.8, nucleusRadius: 4.6, boltMode: "none" },
    normal: { ...ATOM_BASE, orbitPlaneCount: 1, electronCount: 1, orbitRy: 8, nucleusRadius: 4.6 },
    intense: { ...ATOM_BASE, orbitPlaneCount: 1, electronCount: 1, orbitPeriod: 3.5, orbitRy: 8, auraPulseDur: 1.0, nucleusRadius: 4.6 },
  },
};

// Vortex
const VORTEX_BASE: VortexConfig = {
  ringCount: 5,
  baseRotation: 14,
  ringFalloff: 0.7,
  outerRx: 22,
  aspect: 2.2,
  centerHole: 3.5,
  auraStrength: 0.15,
  strokeWidth: 0.8,
  hoverSpeedBoost: 2.5,
  rotationDir: "cw",
};

export const VORTEX_PRESETS: Record<string, Record<IntensityId, VortexConfig>> = {
  "vortex-classic": {
    calm: { ...VORTEX_BASE, baseRotation: 22, hoverSpeedBoost: 1.6 },
    normal: { ...VORTEX_BASE },
    intense: { ...VORTEX_BASE, baseRotation: 7, hoverSpeedBoost: 3.5, ringCount: 7 },
  },
  "vortex-funnel": {
    calm: { ...VORTEX_BASE, baseRotation: 22, ringCount: 5, hoverSpeedBoost: 1.6 },
    normal: { ...VORTEX_BASE, ringCount: 5 },
    intense: { ...VORTEX_BASE, baseRotation: 7, ringCount: 6, hoverSpeedBoost: 3.5 },
  },
  "vortex-galactic": {
    calm: { ...VORTEX_BASE, baseRotation: 12, ringCount: 5, hoverSpeedBoost: 1.6 },
    normal: { ...VORTEX_BASE, baseRotation: 6, ringCount: 5 },
    intense: { ...VORTEX_BASE, baseRotation: 3, ringCount: 5, hoverSpeedBoost: 3.5 },
  },
};

// Plasma
const PLASMA_BASE: PlasmaConfig = {
  arcCount: 4,
  arcSegments: 8,
  jitter: 2.4,
  speed: 1,
  hoverArcBonus: 2,
  sphereRadius: 20,
  highlightIntensity: 0.35,
  coreRadius: 3.6,
  arcStrokeWidth: 1.3,
  auraStrength: 0.22,
  showHighlight: true,
};

export const PLASMA_PRESETS: Record<string, Record<IntensityId, PlasmaConfig>> = {
  "plasma-classic": {
    calm: { ...PLASMA_BASE, arcCount: 2, jitter: 1.4, speed: 0.4, hoverArcBonus: 0 },
    normal: { ...PLASMA_BASE },
    intense: { ...PLASMA_BASE, arcCount: 8, jitter: 3.2, speed: 2, hoverArcBonus: 2 },
  },
  "plasma-sleeping": {
    calm: { ...PLASMA_BASE, arcCount: 1, jitter: 0.9, speed: 0.18, hoverArcBonus: 1, highlightIntensity: 0.55 },
    normal: { ...PLASMA_BASE, arcCount: 2, jitter: 1.4, speed: 0.32, hoverArcBonus: 1, highlightIntensity: 0.55 },
    intense: { ...PLASMA_BASE, arcCount: 3, jitter: 2.1, speed: 0.55, hoverArcBonus: 1, highlightIntensity: 0.55 },
  },
  "plasma-pulse-sync": {
    calm: { ...PLASMA_BASE, arcCount: 4, speed: 0.6 },
    normal: { ...PLASMA_BASE, arcCount: 6 },
    intense: { ...PLASMA_BASE, arcCount: 8, speed: 1.6 },
  },
};

// Pulsar
const PULSAR_BASE: PulsarConfig = {
  flareCount: 14,
  flareLength: 24,
  rotationDuration: 18,
  ringCount: 3,
  ringDuration: 1.4,
  auraPulse: 1.8,
  coreMinScale: 1.0,
  coreMaxScale: 1.6,
  flareAlternation: true,
  flareStrokeWidth: 0.6,
  auraIntensity: 0.22,
  hoverSpeedBoost: 1.8,
};

export const PULSAR_PRESETS: Record<string, Record<IntensityId, PulsarConfig>> = {
  "pulsar-classic": {
    calm: { ...PULSAR_BASE, flareCount: 10, rotationDuration: 28, ringCount: 2, auraPulse: 2.6 },
    normal: { ...PULSAR_BASE },
    intense: { ...PULSAR_BASE, flareCount: 20, rotationDuration: 9, ringCount: 4, auraPulse: 1.0 },
  },
  "pulsar-lighthouse": {
    calm: { ...PULSAR_BASE, flareCount: 2, flareLength: 22, rotationDuration: 7, ringCount: 0, auraPulse: 2.6 },
    normal: { ...PULSAR_BASE, flareCount: 2, flareLength: 26, rotationDuration: 4, ringCount: 0 },
    intense: { ...PULSAR_BASE, flareCount: 2, flareLength: 28, rotationDuration: 2, ringCount: 0, auraPulse: 1.0 },
  },
  "pulsar-heartbeat": {
    calm: { ...PULSAR_BASE, flareCount: 0, ringCount: 1, ringDuration: 1.6, auraPulse: 2.6 },
    normal: { ...PULSAR_BASE, flareCount: 0, ringCount: 1, ringDuration: 1.2 },
    intense: { ...PULSAR_BASE, flareCount: 0, ringCount: 1, ringDuration: 0.8, auraPulse: 1.0 },
  },
};

export type PresetLookup = {
  atom: typeof ATOM_PRESETS;
  vortex: typeof VORTEX_PRESETS;
  "plasma-ball": typeof PLASMA_PRESETS;
  pulsar: typeof PULSAR_PRESETS;
};

export const PRESETS: PresetLookup = {
  atom: ATOM_PRESETS,
  vortex: VORTEX_PRESETS,
  "plasma-ball": PLASMA_PRESETS,
  pulsar: PULSAR_PRESETS,
};

export function getPreset(
  motifId: keyof MotifConfigMap,
  styleId: string,
  intensity: IntensityId,
): AnyMotifConfig {
  const matrix = PRESETS[motifId] as Record<string, Record<IntensityId, AnyMotifConfig>>;
  const styleRow = matrix[styleId] ?? Object.values(matrix)[0];
  return styleRow[intensity] ?? styleRow.normal;
}
