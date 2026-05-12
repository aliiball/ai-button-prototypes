import { useEffect, useMemo, useState } from "react";
import { GlassShell } from "./ai-button/shared/glass-shell";
import { PALETTES, PALETTE_MAP } from "./ai-button/shared/palettes";
import {
  ATELIER_MOTIFS,
  STYLES_BY_PARENT,
  STYLE_MAP,
} from "./ai-button/styles";
import { MOTIF_MAP } from "./ai-button";
import type {
  IntensityId,
  MotifId,
  Palette,
  PaletteId,
  StyleVariant,
} from "./ai-button/shared/types";

const INTENSITIES: { id: IntensityId; label: string }[] = [
  { id: "calm", label: "Sakin" },
  { id: "normal", label: "Normal" },
  { id: "intense", label: "Yoğun" },
];

type AtelierState = {
  motifId: MotifId;
  styleId: string;
  intensity: IntensityId;
  paletteId: PaletteId;
};

function parseHash(): Partial<AtelierState> | null {
  const m = location.hash.match(
    /^#atelier\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)/,
  );
  if (!m) return null;
  return {
    motifId: m[1] as MotifId,
    styleId: m[2],
    intensity: m[3] as IntensityId,
    paletteId: m[4] as PaletteId,
  };
}

const isMotif = (id: string): id is MotifId =>
  (ATELIER_MOTIFS as string[]).includes(id);
const isIntensity = (id: string): id is IntensityId =>
  ["calm", "normal", "intense"].includes(id);
const isPaletteId = (id: string): id is PaletteId =>
  ["iridescent", "warm", "ocean", "cyber"].includes(id);

export function AtelierView() {
  const initial = parseHash();
  const [motifId, setMotifId] = useState<MotifId>(() =>
    initial?.motifId && isMotif(initial.motifId) ? initial.motifId : "atom",
  );
  const [styleId, setStyleId] = useState<string>(() => {
    const styles = STYLES_BY_PARENT[motifId] ?? [];
    if (initial?.styleId && STYLE_MAP[initial.styleId]?.parentId === motifId) {
      return initial.styleId;
    }
    return styles[0]?.id ?? "";
  });
  const [intensity, setIntensity] = useState<IntensityId>(() =>
    initial?.intensity && isIntensity(initial.intensity)
      ? initial.intensity
      : "normal",
  );
  const [paletteId, setPaletteId] = useState<PaletteId>(() =>
    initial?.paletteId && isPaletteId(initial.paletteId)
      ? initial.paletteId
      : "iridescent",
  );
  const [copied, setCopied] = useState(false);

  // Motif değişince styleId mevcut motife ait olmazsa ilkine düş.
  useEffect(() => {
    const styles = STYLES_BY_PARENT[motifId] ?? [];
    if (!styles.some((s) => s.id === styleId)) {
      setStyleId(styles[0]?.id ?? "");
    }
  }, [motifId, styleId]);

  // Hash sync — debounce'suz; intermediate state'leri history'ye boğmamak için replaceState.
  useEffect(() => {
    if (!styleId) return;
    const next = `#atelier/${motifId}/${styleId}/${intensity}/${paletteId}`;
    if (location.hash !== next) {
      history.replaceState(null, "", next);
    }
  }, [motifId, styleId, intensity, paletteId]);

  const styles = STYLES_BY_PARENT[motifId] ?? [];
  const currentStyle = useMemo(
    () => styles.find((s) => s.id === styleId) ?? styles[0],
    [styles, styleId],
  );
  const palette = PALETTE_MAP[paletteId];

  if (!currentStyle) return null;
  const StyleComp = currentStyle.Component;

  const copyHash = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard yetkisi yok — sessiz */
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-8 py-8 sm:py-12 flex flex-col gap-8">
      {/* Motif seçici */}
      <MotifTabs value={motifId} onChange={setMotifId} />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-center">
        {/* Sol: kontroller */}
        <div className="flex flex-col gap-5">
          <ChipGroup
            label="Stil"
            value={styleId}
            options={styles.map((s) => ({ id: s.id, label: s.label }))}
            onChange={setStyleId}
          />
          <ChipGroup
            label="Yoğunluk"
            value={intensity}
            options={INTENSITIES}
            onChange={(v) => setIntensity(v as IntensityId)}
          />
          <PaletteSwatches value={paletteId} onChange={setPaletteId} />

          <p className="text-sm text-page-mute leading-relaxed">
            {currentStyle.description}
          </p>

          <button
            type="button"
            onClick={copyHash}
            className="self-start font-mono text-[10px] uppercase tracking-[0.18em] text-page-mute hover:text-page-ink transition-colors border border-white/10 rounded-full px-3 py-1.5"
          >
            {copied ? "✓ Kopyalandı" : "Link'i kopyala"}
          </button>
        </div>

        {/* Sağ: büyük preview */}
        <div className="flex flex-col items-center gap-3 self-center">
          <GlassShell palette={palette} size={180} label={currentStyle.label}>
            <PreviewMotif Component={StyleComp} palette={palette} intensity={intensity} />
          </GlassShell>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-page-mute">
            {currentStyle.label} · {intensityLabel(intensity)} · {palette.label}
          </p>
        </div>
      </div>

      {/* Mini ızgara — 3 yoğunluk × 4 palet = 12 hücre */}
      <CombinationGrid
        style={currentStyle}
        selectedIntensity={intensity}
        selectedPalette={paletteId}
        onPick={(i, p) => {
          setIntensity(i);
          setPaletteId(p);
        }}
      />
    </section>
  );
}

function MotifTabs({
  value,
  onChange,
}: {
  value: MotifId;
  onChange: (id: MotifId) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {ATELIER_MOTIFS.map((id) => {
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

function ChipGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-page-mute">
        {label}
      </span>
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

function PaletteSwatches({
  value,
  onChange,
}: {
  value: PaletteId;
  onChange: (id: PaletteId) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-page-mute">
        Palet
      </span>
      <div className="flex flex-wrap gap-3">
        {PALETTES.map((p) => {
          const active = p.id === value;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id)}
              aria-label={p.label}
              className={`group flex flex-col items-center gap-1.5 ${active ? "" : "opacity-70 hover:opacity-100"}`}
            >
              <span
                className={`h-9 w-9 rounded-full border-2 transition-all ${
                  active
                    ? "border-page-ink scale-110"
                    : "border-white/15 group-hover:border-white/40"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${p.nucleusCore} 0%, ${p.nucleusMid} 35%, ${p.auraMid} 65%, ${p.nucleusDeep} 100%)`,
                }}
              />
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-page-mute">
                {p.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PreviewMotif({
  Component,
  palette,
  intensity,
}: {
  Component: StyleVariant["Component"];
  palette: Palette;
  intensity: IntensityId;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      className="relative flex items-center justify-center w-full h-full"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Component palette={palette} hovered={hovered} active={false} intensity={intensity} />
    </span>
  );
}

function intensityLabel(i: IntensityId): string {
  return i === "calm" ? "Sakin" : i === "intense" ? "Yoğun" : "Normal";
}

function CombinationGrid({
  style,
  selectedIntensity,
  selectedPalette,
  onPick,
}: {
  style: StyleVariant;
  selectedIntensity: IntensityId;
  selectedPalette: PaletteId;
  onPick: (i: IntensityId, p: PaletteId) => void;
}) {
  const StyleComp = style.Component;
  return (
    <div className="flex flex-col gap-3 mt-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-page-mute">
        Tüm kombinasyonlar · {style.label} stili
      </span>
      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-3 mx-auto">
          <thead>
            <tr>
              <th />
              {INTENSITIES.map((i) => (
                <th
                  key={i.id}
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-page-mute font-normal pb-1"
                >
                  {i.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PALETTES.map((p) => (
              <tr key={p.id}>
                <th
                  scope="row"
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-page-mute font-normal pr-2 text-right align-middle"
                >
                  {p.label}
                </th>
                {INTENSITIES.map((i) => {
                  const active =
                    selectedIntensity === i.id && selectedPalette === p.id;
                  return (
                    <td key={i.id} className="align-middle">
                      <button
                        type="button"
                        onClick={() => onPick(i.id, p.id)}
                        className={`block rounded-full transition-transform ${
                          active
                            ? "ring-2 ring-fuchsia-200/60 scale-105"
                            : "opacity-80 hover:opacity-100 hover:scale-105"
                        }`}
                      >
                        <GlassShell palette={p} size={56} label={`${p.label} · ${i.label}`}>
                          <PreviewMotif
                            Component={StyleComp}
                            palette={p}
                            intensity={i.id}
                          />
                        </GlassShell>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
