import { useEffect, useMemo, useReducer, useState } from "react";
import { GlassShell } from "./ai-button/shared/glass-shell";
import { PALETTES, PALETTE_MAP, iridescent } from "./ai-button/shared/palettes";
import {
  ATELIER_MOTIFS,
  STYLES_BY_PARENT,
  STYLE_MAP,
} from "./ai-button/styles";
import { MOTIF_MAP } from "./ai-button";
import type {
  IntensityId,
  Palette,
  PaletteId,
  StyleVariant,
} from "./ai-button/shared/types";

type AtelierMotifId = "atom" | "vortex" | "plasma-ball" | "pulsar";
import {
  ActionButton,
  ColorField,
  ControlGrid,
  Select,
  Slider,
  Toggle,
} from "./atelier/controls";
import {
  ATOM_PRESETS,
  PLASMA_PRESETS,
  PULSAR_PRESETS,
  SHARED_DEFAULT,
  VORTEX_PRESETS,
  type AnyMotifConfig,
  type AtomConfig,
  type MotifConfigMap,
  type PlasmaConfig,
  type PulsarConfig,
  type SharedConfig,
  type VortexConfig,
  getPreset,
} from "./atelier/configs";

const INTENSITIES: { id: IntensityId; label: string }[] = [
  { id: "calm", label: "Sakin" },
  { id: "normal", label: "Normal" },
  { id: "intense", label: "Yoğun" },
];

// ───────────────────────────────────────────────────────────────────────────────
// State / reducer
// ───────────────────────────────────────────────────────────────────────────────

type AtelierState = {
  motifId: AtelierMotifId;
  styleId: string;
  intensity: IntensityId;
  shared: SharedConfig;
  customPalette: Palette;
  configs: {
    atom: AtomConfig;
    vortex: VortexConfig;
    "plasma-ball": PlasmaConfig;
    pulsar: PulsarConfig;
  };
};

type Action =
  | { type: "set-motif"; motifId: AtelierMotifId }
  | { type: "set-style"; styleId: string }
  | { type: "set-intensity"; intensity: IntensityId }
  | { type: "set-palette-id"; paletteId: PaletteId | "custom" }
  | { type: "patch-custom-palette"; patch: Partial<Palette> }
  | { type: "patch-shared"; patch: Partial<SharedConfig> }
  | { type: "patch-config"; motifId: AtelierMotifId; patch: Partial<AnyMotifConfig> }
  | { type: "reset" }
  | { type: "load"; state: AtelierState };

function initialConfigs(): AtelierState["configs"] {
  return {
    atom: ATOM_PRESETS["atom-classic"].normal,
    vortex: VORTEX_PRESETS["vortex-classic"].normal,
    "plasma-ball": PLASMA_PRESETS["plasma-classic"].normal,
    pulsar: PULSAR_PRESETS["pulsar-classic"].normal,
  };
}

function defaultState(): AtelierState {
  return {
    motifId: "atom",
    styleId: "atom-classic",
    intensity: "normal",
    shared: { ...SHARED_DEFAULT },
    customPalette: { ...iridescent, id: "iridescent", label: "Custom" },
    configs: initialConfigs(),
  };
}

function reducer(state: AtelierState, action: Action): AtelierState {
  switch (action.type) {
    case "set-motif": {
      const styles = STYLES_BY_PARENT[action.motifId] ?? [];
      const styleId = styles[0]?.id ?? state.styleId;
      const preset = getPreset(action.motifId, styleId, state.intensity);
      return {
        ...state,
        motifId: action.motifId,
        styleId,
        configs: { ...state.configs, [action.motifId]: preset } as AtelierState["configs"],
      };
    }
    case "set-style": {
      const preset = getPreset(state.motifId, action.styleId, state.intensity);
      return {
        ...state,
        styleId: action.styleId,
        configs: { ...state.configs, [state.motifId]: preset } as AtelierState["configs"],
      };
    }
    case "set-intensity": {
      const preset = getPreset(state.motifId, state.styleId, action.intensity);
      return {
        ...state,
        intensity: action.intensity,
        configs: { ...state.configs, [state.motifId]: preset } as AtelierState["configs"],
      };
    }
    case "set-palette-id": {
      if (action.paletteId === "custom") {
        return { ...state, shared: { ...state.shared, paletteId: "iridescent", customPalette: state.customPalette }, customPalette: state.customPalette };
      }
      return { ...state, shared: { ...state.shared, paletteId: action.paletteId, customPalette: null } };
    }
    case "patch-custom-palette":
      return { ...state, customPalette: { ...state.customPalette, ...action.patch } };
    case "patch-shared":
      return { ...state, shared: { ...state.shared, ...action.patch } };
    case "patch-config":
      return {
        ...state,
        configs: {
          ...state.configs,
          [action.motifId]: { ...(state.configs[action.motifId] as object), ...action.patch },
        } as AtelierState["configs"],
      };
    case "reset":
      return defaultState();
    case "load":
      return action.state;
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Persistence — localStorage + URL hash (base64 JSON)
// ───────────────────────────────────────────────────────────────────────────────

const LS_KEY = "ai-button-atelier-v1";

function encodeHash(state: AtelierState): string {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
  } catch {
    return "";
  }
}

function decodeHash(hash: string): AtelierState | null {
  const m = hash.match(/^#atelier:([A-Za-z0-9+/=]+)/);
  if (!m) return null;
  try {
    const json = decodeURIComponent(escape(atob(m[1])));
    return JSON.parse(json) as AtelierState;
  } catch {
    return null;
  }
}

function loadFromLocalStorage(): AtelierState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as AtelierState) : null;
  } catch {
    return null;
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Main view
// ───────────────────────────────────────────────────────────────────────────────

export function AtelierView() {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const fromHash = typeof location !== "undefined" ? decodeHash(location.hash) : null;
    return fromHash ?? loadFromLocalStorage() ?? defaultState();
  });

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {
      /* quota / privacy mode */
    }
    const next = `#atelier:${encodeHash(state)}`;
    if (location.hash !== next) {
      history.replaceState(null, "", next);
    }
  }, [state]);

  const styles = STYLES_BY_PARENT[state.motifId] ?? [];
  const currentStyle = useMemo(
    () => styles.find((s) => s.id === state.styleId) ?? styles[0],
    [styles, state.styleId],
  );

  const activePalette: Palette = state.shared.customPalette ?? PALETTE_MAP[state.shared.paletteId];

  if (!currentStyle) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-8 py-8 sm:py-12 flex flex-col gap-8">
      {/* Motif sekme şeridi */}
      <MotifTabs value={state.motifId} onChange={(motifId) => dispatch({ type: "set-motif", motifId })} />

      {/* Sahne + üst aksiyonlar */}
      <Stage
        style={currentStyle}
        palette={activePalette}
        shared={state.shared}
        config={state.configs[state.motifId]}
        onReset={() => dispatch({ type: "reset" })}
        onShare={() => navigator.clipboard?.writeText(location.href).catch(() => {})}
        onCopyCode={() => copyCode(state, activePalette)}
        onTogglePause={() => dispatch({ type: "patch-shared", patch: { paused: !state.shared.paused } })}
        onToggleForceHover={() => dispatch({ type: "patch-shared", patch: { forceHover: !state.shared.forceHover } })}
      />

      {/* Stil + Yoğunluk preset chip'leri */}
      <PresetRow
        title="Stil"
        value={state.styleId}
        options={styles.map((s) => ({ id: s.id, label: s.label }))}
        onChange={(styleId) => dispatch({ type: "set-style", styleId })}
        hint={currentStyle.description}
      />
      <PresetRow
        title="Yoğunluk"
        value={state.intensity}
        options={INTENSITIES}
        onChange={(v) => dispatch({ type: "set-intensity", intensity: v as IntensityId })}
      />

      {/* Palet */}
      <PaletteSection
        paletteId={state.shared.customPalette ? "custom" : state.shared.paletteId}
        customPalette={state.customPalette}
        onPickPreset={(id) => dispatch({ type: "set-palette-id", paletteId: id })}
        onPatchCustom={(patch) => dispatch({ type: "patch-custom-palette", patch })}
      />

      {/* Customize grid */}
      <CustomizePanel
        motifId={state.motifId}
        config={state.configs[state.motifId]}
        onPatch={(patch) => dispatch({ type: "patch-config", motifId: state.motifId, patch })}
        shared={state.shared}
        onSharedPatch={(patch) => dispatch({ type: "patch-shared", patch })}
      />
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Motif tabs
// ───────────────────────────────────────────────────────────────────────────────

function MotifTabs({ value, onChange }: { value: AtelierMotifId; onChange: (id: AtelierMotifId) => void }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {(ATELIER_MOTIFS as AtelierMotifId[]).map((id) => {
        const entry = MOTIF_MAP[id];
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`font-serif text-sm sm:text-base px-4 py-2 rounded-full border transition-colors ${
              active
                ? "bg-page-panel text-page-ink border-fuchsia-200/30"
                : "bg-transparent text-page-mute border-white/10 hover:text-page-ink hover:border-white/20"
            }`}
          >
            {entry.label}
          </button>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Stage — büyük preview + aksiyonlar
// ───────────────────────────────────────────────────────────────────────────────

function Stage({
  style,
  palette,
  shared,
  config,
  onReset,
  onShare,
  onCopyCode,
  onTogglePause,
  onToggleForceHover,
}: {
  style: StyleVariant;
  palette: Palette;
  shared: SharedConfig;
  config: AnyMotifConfig;
  onReset: () => void;
  onShare: () => void;
  onCopyCode: () => void;
  onTogglePause: () => void;
  onToggleForceHover: () => void;
}) {
  const StyleComp = style.Component;
  const [hovered, setHovered] = useState(false);
  const effectiveHover = shared.forceHover || hovered;
  const [shareLabel, setShareLabel] = useState("Link'i kopyala");
  const [copyLabel, setCopyLabel] = useState("Kod'u kopyala");

  const bgStyle: React.CSSProperties =
    shared.background === "custom"
      ? { background: shared.backgroundCustom }
      : shared.background === "light"
        ? { background: "linear-gradient(180deg, #f8f5ff 0%, #eee6ff 100%)" }
        : {};

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative rounded-3xl border border-white/5 px-6 py-8 sm:px-10 sm:py-10 flex items-center justify-center w-full"
        style={bgStyle}
      >
        <div
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <GlassShell palette={palette} size={shared.size} label={style.label}>
            {!shared.paused && (
              <StyleComp
                palette={palette}
                hovered={effectiveHover}
                active={false}
                intensity="normal"
                config={config as unknown}
              />
            )}
          </GlassShell>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <ActionButton
          onClick={() => {
            onShare();
            setShareLabel("✓ Kopyalandı");
            window.setTimeout(() => setShareLabel("Link'i kopyala"), 1400);
          }}
        >
          {shareLabel}
        </ActionButton>
        <ActionButton
          onClick={() => {
            onCopyCode();
            setCopyLabel("✓ Kopyalandı");
            window.setTimeout(() => setCopyLabel("Kod'u kopyala"), 1400);
          }}
        >
          {copyLabel}
        </ActionButton>
        <ActionButton onClick={onTogglePause}>
          {shared.paused ? "▶ Devam" : "⏸ Duraklat"}
        </ActionButton>
        <ActionButton onClick={onToggleForceHover}>
          {shared.forceHover ? "Hover kilidi: AÇIK" : "Hover kilidi: KAPALI"}
        </ActionButton>
        <ActionButton onClick={onReset} variant="ghost">
          Reset
        </ActionButton>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Preset row (chip group) — stil + yoğunluk
// ───────────────────────────────────────────────────────────────────────────────

function PresetRow<T extends string>({
  title,
  value,
  options,
  onChange,
  hint,
}: {
  title: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-page-mute">
          {title}
        </span>
        {hint && (
          <span className="text-xs text-page-mute/80 leading-tight">{hint}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                active
                  ? "bg-page-panel text-page-ink border-fuchsia-200/30"
                  : "bg-transparent text-page-mute border-white/10 hover:text-page-ink hover:border-white/20"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Palette section — preset swatches + custom editor
// ───────────────────────────────────────────────────────────────────────────────

const PALETTE_KEYS: { key: keyof Palette; label: string }[] = [
  { key: "nucleusCore", label: "Nucleus Core" },
  { key: "nucleusMid", label: "Nucleus Mid" },
  { key: "nucleusDeep", label: "Nucleus Deep" },
  { key: "auraInner", label: "Aura Inner" },
  { key: "auraMid", label: "Aura Mid" },
  { key: "auraOuter", label: "Aura Outer" },
  { key: "orbitDeep", label: "Orbit Deep" },
  { key: "orbitMid", label: "Orbit Mid" },
  { key: "orbitHighlight", label: "Orbit Highlight" },
  { key: "electron", label: "Electron" },
  { key: "boltDeep", label: "Bolt Deep" },
  { key: "boltMid", label: "Bolt Mid" },
  { key: "boltBright", label: "Bolt Bright" },
];

function PaletteSection({
  paletteId,
  customPalette,
  onPickPreset,
  onPatchCustom,
}: {
  paletteId: PaletteId | "custom";
  customPalette: Palette;
  onPickPreset: (id: PaletteId | "custom") => void;
  onPatchCustom: (patch: Partial<Palette>) => void;
}) {
  const swatches: { id: PaletteId | "custom"; label: string; palette: Palette }[] = [
    ...PALETTES.map((p) => ({ id: p.id as PaletteId | "custom", label: p.label, palette: p })),
    { id: "custom" as const, label: "Custom", palette: customPalette },
  ];
  const isCustom = paletteId === "custom";

  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-page-ink/70">
        Palet
      </span>
      <div className="flex flex-wrap gap-3">
        {swatches.map((s) => {
          const active = s.id === paletteId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onPickPreset(s.id)}
              aria-label={s.label}
              className={`group flex flex-col items-center gap-1.5 ${active ? "" : "opacity-70 hover:opacity-100"}`}
            >
              <span
                className={`h-9 w-9 rounded-full border-2 transition-all ${active ? "border-page-ink scale-110" : "border-white/15 group-hover:border-white/40"}`}
                style={{
                  background: `linear-gradient(135deg, ${s.palette.nucleusCore} 0%, ${s.palette.nucleusMid} 35%, ${s.palette.auraMid} 65%, ${s.palette.nucleusDeep} 100%)`,
                }}
              />
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-page-mute">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {isCustom && (
        <div className="mt-2 rounded-2xl border border-white/10 bg-page-panel/40 p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3">
            {PALETTE_KEYS.map(({ key, label }) => {
              const value = (customPalette[key] as string) ?? "#000000";
              if (typeof value !== "string" || !/^#/.test(value)) return null;
              return (
                <ColorField
                  key={key}
                  label={label}
                  value={value}
                  onChange={(v) => onPatchCustom({ [key]: v } as Partial<Palette>)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Customize panel — motif başına dinamik slider grid
// ───────────────────────────────────────────────────────────────────────────────

function CustomizePanel({
  motifId,
  config,
  onPatch,
  shared,
  onSharedPatch,
}: {
  motifId: AtelierMotifId;
  config: AnyMotifConfig;
  onPatch: (patch: Partial<AnyMotifConfig>) => void;
  shared: SharedConfig;
  onSharedPatch: (patch: Partial<SharedConfig>) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-white/10 bg-page-panel/40 p-4 sm:p-5">
        <ControlGrid title="Customize · Motif">
          {motifId === "atom" && <AtomControls config={config as AtomConfig} onPatch={onPatch as (p: Partial<AtomConfig>) => void} />}
          {motifId === "vortex" && <VortexControls config={config as VortexConfig} onPatch={onPatch as (p: Partial<VortexConfig>) => void} />}
          {motifId === "plasma-ball" && <PlasmaControls config={config as PlasmaConfig} onPatch={onPatch as (p: Partial<PlasmaConfig>) => void} />}
          {motifId === "pulsar" && <PulsarControls config={config as PulsarConfig} onPatch={onPatch as (p: Partial<PulsarConfig>) => void} />}
        </ControlGrid>
      </div>

      <div className="rounded-2xl border border-white/10 bg-page-panel/40 p-4 sm:p-5">
        <ControlGrid title="Customize · Sahne">
          <Slider label="Buton boyutu" value={shared.size} min={64} max={280} step={4} suffix="px" onChange={(v) => onSharedPatch({ size: v })} />
          <Select<"dark" | "light" | "custom">
            label="Arka plan"
            value={shared.background}
            options={[
              { id: "dark", label: "Karanlık" },
              { id: "light", label: "Aydınlık" },
              { id: "custom", label: "Özel" },
            ]}
            onChange={(v) => onSharedPatch({ background: v })}
          />
          {shared.background === "custom" && (
            <ColorField label="Özel arka plan" value={shared.backgroundCustom} onChange={(v) => onSharedPatch({ backgroundCustom: v })} />
          )}
        </ControlGrid>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Per-motif control panels
// ───────────────────────────────────────────────────────────────────────────────

function AtomControls({ config, onPatch }: { config: AtomConfig; onPatch: (p: Partial<AtomConfig>) => void }) {
  return (
    <>
      <Slider label="Orbit Major (rx)" value={config.orbitRx} min={10} max={30} step={1} onChange={(v) => onPatch({ orbitRx: v })} />
      <Slider label="Orbit Minor (ry)" value={config.orbitRy} min={4} max={15} step={0.5} onChange={(v) => onPatch({ orbitRy: v })} />
      <Slider label="Orbit Period (s)" value={config.orbitPeriod} min={2} max={15} step={0.5} suffix="s" onChange={(v) => onPatch({ orbitPeriod: v })} />
      <Slider label="Düzlem Sayısı" value={config.orbitPlaneCount} min={1} max={5} step={1} onChange={(v) => onPatch({ orbitPlaneCount: Math.round(v) })} />
      <Slider label="Elektron (Quark için)" value={config.electronCount} min={1} max={7} step={1} onChange={(v) => onPatch({ electronCount: Math.round(v) })} />
      <Slider label="Nucleus Radius" value={config.nucleusRadius} min={2} max={8} step={0.2} onChange={(v) => onPatch({ nucleusRadius: v })} />
      <Slider label="Aura Pulse (s)" value={config.auraPulseDur} min={0.6} max={4} step={0.1} suffix="s" onChange={(v) => onPatch({ auraPulseDur: v })} />
      <Slider label="Aura Opacity" value={config.auraOpacity} min={0} max={1} step={0.05} onChange={(v) => onPatch({ auraOpacity: v })} />
      <Toggle label="Aura göster" value={config.showAura} onChange={(v) => onPatch({ showAura: v })} />
      <Select label="Bolt modu" value={config.boltMode} options={[
        { id: "none", label: "Yok" },
        { id: "hover", label: "Hover" },
        { id: "always", label: "Her zaman" },
      ]} onChange={(v) => onPatch({ boltMode: v })} />
      <Slider label="Bolt kalınlığı" value={config.boltThickness} min={0.5} max={4} step={0.1} onChange={(v) => onPatch({ boltThickness: v })} />
      <Slider label="Glow Strength" value={config.glowStrength} min={0} max={4} step={0.1} onChange={(v) => onPatch({ glowStrength: v })} />
      <Slider label="Hover Scale" value={config.hoverScale} min={1} max={1.5} step={0.01} onChange={(v) => onPatch({ hoverScale: v })} />
    </>
  );
}

function VortexControls({ config, onPatch }: { config: VortexConfig; onPatch: (p: Partial<VortexConfig>) => void }) {
  return (
    <>
      <Slider label="Ring Sayısı" value={config.ringCount} min={1} max={8} step={1} onChange={(v) => onPatch({ ringCount: Math.round(v) })} />
      <Slider label="Base Rotation (s)" value={config.baseRotation} min={2} max={30} step={0.5} suffix="s" onChange={(v) => onPatch({ baseRotation: v })} />
      <Slider label="Ring Falloff" value={config.ringFalloff} min={0.3} max={1} step={0.05} onChange={(v) => onPatch({ ringFalloff: v })} />
      <Slider label="Outer rx" value={config.outerRx} min={14} max={28} step={1} onChange={(v) => onPatch({ outerRx: v })} />
      <Slider label="Aspect (rx/ry)" value={config.aspect} min={1.5} max={6} step={0.1} onChange={(v) => onPatch({ aspect: v })} />
      <Slider label="Center Hole" value={config.centerHole} min={1} max={8} step={0.2} onChange={(v) => onPatch({ centerHole: v })} />
      <Slider label="Aura Strength" value={config.auraStrength} min={0} max={0.5} step={0.02} onChange={(v) => onPatch({ auraStrength: v })} />
      <Slider label="Stroke Width" value={config.strokeWidth} min={0.3} max={2} step={0.1} onChange={(v) => onPatch({ strokeWidth: v })} />
      <Slider label="Hover Speed Boost" value={config.hoverSpeedBoost} min={1} max={5} step={0.1} onChange={(v) => onPatch({ hoverSpeedBoost: v })} />
      <Select label="Rotation Direction" value={config.rotationDir} options={[
        { id: "cw", label: "Saat yönü" },
        { id: "ccw", label: "Ters saat" },
        { id: "alternate", label: "Alternatif" },
      ]} onChange={(v) => onPatch({ rotationDir: v })} />
    </>
  );
}

function PlasmaControls({ config, onPatch }: { config: PlasmaConfig; onPatch: (p: Partial<PlasmaConfig>) => void }) {
  return (
    <>
      <Slider label="Arc Sayısı" value={config.arcCount} min={0} max={12} step={1} onChange={(v) => onPatch({ arcCount: Math.round(v) })} />
      <Slider label="Arc Segments" value={config.arcSegments} min={4} max={16} step={1} onChange={(v) => onPatch({ arcSegments: Math.round(v) })} />
      <Slider label="Jitter" value={config.jitter} min={0} max={5} step={0.1} onChange={(v) => onPatch({ jitter: v })} />
      <Slider label="Speed" value={config.speed} min={0} max={3} step={0.05} onChange={(v) => onPatch({ speed: v })} />
      <Slider label="Hover Arc Bonus" value={config.hoverArcBonus} min={0} max={6} step={1} onChange={(v) => onPatch({ hoverArcBonus: Math.round(v) })} />
      <Slider label="Sphere Radius" value={config.sphereRadius} min={14} max={22} step={0.5} onChange={(v) => onPatch({ sphereRadius: v })} />
      <Slider label="Highlight Intensity" value={config.highlightIntensity} min={0} max={1} step={0.05} onChange={(v) => onPatch({ highlightIntensity: v })} />
      <Slider label="Core Radius" value={config.coreRadius} min={1} max={5} step={0.2} onChange={(v) => onPatch({ coreRadius: v })} />
      <Slider label="Arc Stroke Width" value={config.arcStrokeWidth} min={0.5} max={4} step={0.1} onChange={(v) => onPatch({ arcStrokeWidth: v })} />
      <Slider label="Aura Strength" value={config.auraStrength} min={0} max={0.5} step={0.02} onChange={(v) => onPatch({ auraStrength: v })} />
      <Toggle label="Cam highlight göster" value={config.showHighlight} onChange={(v) => onPatch({ showHighlight: v })} />
    </>
  );
}

function PulsarControls({ config, onPatch }: { config: PulsarConfig; onPatch: (p: Partial<PulsarConfig>) => void }) {
  return (
    <>
      <Slider label="Flare Sayısı" value={config.flareCount} min={0} max={24} step={1} onChange={(v) => onPatch({ flareCount: Math.round(v) })} />
      <Slider label="Flare Length" value={config.flareLength} min={16} max={28} step={0.5} onChange={(v) => onPatch({ flareLength: v })} />
      <Slider label="Rotation Duration (s)" value={config.rotationDuration} min={4} max={30} step={0.5} suffix="s" onChange={(v) => onPatch({ rotationDuration: v })} />
      <Slider label="Halka Sayısı" value={config.ringCount} min={0} max={5} step={1} onChange={(v) => onPatch({ ringCount: Math.round(v) })} />
      <Slider label="Halka Duration (s)" value={config.ringDuration} min={0.6} max={3} step={0.1} suffix="s" onChange={(v) => onPatch({ ringDuration: v })} />
      <Slider label="Aura Pulse (s)" value={config.auraPulse} min={0.5} max={3} step={0.1} suffix="s" onChange={(v) => onPatch({ auraPulse: v })} />
      <Slider label="Core Min Scale" value={config.coreMinScale} min={0.8} max={2} step={0.05} onChange={(v) => onPatch({ coreMinScale: v })} />
      <Slider label="Core Max Scale" value={config.coreMaxScale} min={1} max={3} step={0.05} onChange={(v) => onPatch({ coreMaxScale: v })} />
      <Slider label="Flare Stroke Width" value={config.flareStrokeWidth} min={0.2} max={1.5} step={0.05} onChange={(v) => onPatch({ flareStrokeWidth: v })} />
      <Slider label="Aura Intensity" value={config.auraIntensity} min={0} max={0.6} step={0.02} onChange={(v) => onPatch({ auraIntensity: v })} />
      <Slider label="Hover Speed Boost" value={config.hoverSpeedBoost} min={1} max={4} step={0.1} onChange={(v) => onPatch({ hoverSpeedBoost: v })} />
      <Toggle label="Flare Alternation" value={config.flareAlternation} onChange={(v) => onPatch({ flareAlternation: v })} />
    </>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Code copy helper
// ───────────────────────────────────────────────────────────────────────────────

function copyCode(state: AtelierState, palette: Palette) {
  const config = state.configs[state.motifId];
  const snippet = `<AIButton
  motif="${state.motifId}"
  palette={${JSON.stringify(palette, null, 2)
    .split("\n")
    .map((l, i) => (i === 0 ? l : "  " + l))
    .join("\n")}}
  size={${state.shared.size}}
  /* config (atelier preset) */
  // ${JSON.stringify(config)}
/>`;
  navigator.clipboard?.writeText(snippet).catch(() => {});
}
