import { useId } from "react";
import { SharedDefs, filterIds } from "../shared/filters";
import { useRafTime } from "../shared/use-raf-time";
import type { VariantProps } from "../shared/types";
import type { PlasmaConfig } from "../../atelier/configs";

const ARC_COUNT_BY_INT = { calm: 2, normal: 4, intense: 8 } as const;
const SPEED_BY_INT = { calm: 0.4, normal: 1, intense: 2 } as const;
const JITTER_BY_INT = { calm: 1.4, normal: 2.4, intense: 3.2 } as const;

function resolveConfig(intensity: "calm" | "normal" | "intense", config?: unknown): PlasmaConfig {
  const def: PlasmaConfig = {
    arcCount: ARC_COUNT_BY_INT[intensity],
    arcSegments: 8,
    jitter: JITTER_BY_INT[intensity],
    speed: SPEED_BY_INT[intensity],
    hoverArcBonus: intensity === "calm" ? 0 : 2,
    sphereRadius: 20,
    highlightIntensity: 0.35,
    coreRadius: 3.6,
    arcStrokeWidth: 1.3,
    auraStrength: 0.22,
    showHighlight: true,
  };
  return { ...def, ...(config as Partial<PlasmaConfig> | undefined) };
}

/**
 * Plasma · Sleeping — yavaş arc'lar, belirgin glassy cam küre highlight'ı.
 */
export function PlasmaSleepingStyle({ palette, hovered, intensity, config }: VariantProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const c = resolveConfig(intensity, config);
  const t = useRafTime();
  const sphereGrad = `ps-s-${id}`;
  const speed = c.speed * 0.55 * (hovered ? 1.8 : 1);
  const arcCount = c.arcCount + (hovered ? c.hoverArcBonus : 0);
  const arcReach = c.sphereRadius - 5;

  const buildArc = (angle: number, segCount: number, j: number, phaseSeed: number) => {
    const targetX = Math.cos(angle) * arcReach;
    const targetY = Math.sin(angle) * arcReach;
    let p = "M0,0";
    for (let i = 1; i <= segCount; i++) {
      const f = i / segCount;
      const baseX = targetX * f;
      const baseY = targetY * f;
      const perpX = -Math.sin(angle);
      const perpY = Math.cos(angle);
      const jt = Math.sin(t * 2 + i * 0.9 + phaseSeed) * j * (1 - Math.abs(f - 0.5));
      p += ` L${(baseX + perpX * jt).toFixed(2)},${(baseY + perpY * jt).toFixed(2)}`;
    }
    return p;
  };

  const arcs = Array.from({ length: Math.max(arcCount, 0) }, (_, i) => {
    const baseAngle = (i / Math.max(arcCount, 1)) * Math.PI * 2 + t * speed;
    return buildArc(baseAngle, c.arcSegments, c.jitter, i * 2.1);
  });

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={sphereGrad} cx="40%" cy="40%" r="80%">
          <stop offset="0%" stopColor={palette.nucleusDeep} stopOpacity={0.55} />
          <stop offset="70%" stopColor={palette.auraOuter} stopOpacity={0.8} />
          <stop offset="100%" stopColor={palette.auraOuter} />
        </radialGradient>
      </defs>

      <circle cx="0" cy="0" r={c.sphereRadius + 2} fill={palette.auraMid} opacity={c.auraStrength * 0.82} filter={F.halo} />
      <circle cx="0" cy="0" r={c.sphereRadius} fill={`url(#${sphereGrad})`} stroke={palette.orbitHighlight} strokeWidth={0.4} strokeOpacity={0.45} />

      {arcs.map((p, i) => (
        <g key={i}>
          <path d={p} fill="none" stroke={palette.boltDeep} strokeWidth={c.arcStrokeWidth * 1.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} filter={F.halo} />
          <path d={p} fill="none" stroke={palette.boltMid} strokeWidth={c.arcStrokeWidth * 0.7} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} filter={F.soft} />
          <path d={p} fill="none" stroke={palette.boltBright} strokeWidth={c.arcStrokeWidth * 0.32} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}

      <circle cx="0" cy="0" r={c.coreRadius * 0.78} fill={palette.electron} filter={F.glow} opacity={0.85} />
      <circle cx="0" cy="0" r={c.coreRadius * 0.33} fill={palette.nucleusCore} />

      {c.showHighlight && (
        <>
          <ellipse cx="-7" cy="-9" rx="5" ry="2.6" transform="rotate(-30 -7 -9)" fill={palette.nucleusCore} opacity={c.highlightIntensity * 1.55} filter={F.soft} />
          <ellipse cx="-4" cy="-12" rx="1.6" ry="0.9" transform="rotate(-30 -4 -12)" fill={palette.nucleusCore} opacity={c.highlightIntensity * 2} />
        </>
      )}
    </svg>
  );
}

/**
 * Plasma · Pulse-sync — arc'lar nucleus pulse cycle'ında sırayla parlar.
 */
export function PlasmaPulseSyncStyle({ palette, hovered, intensity, config }: VariantProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const c = resolveConfig(intensity, config);
  const t = useRafTime();
  const sphereGrad = `pps-s-${id}`;
  const period = (1.6 / Math.max(c.speed, 0.1)) * (hovered ? 0.6 : 1);
  const arcCount = c.arcCount;
  const arcReach = c.sphereRadius - 4;

  const buildArc = (angle: number, segCount: number, jitter: number, phaseSeed: number) => {
    const targetX = Math.cos(angle) * arcReach;
    const targetY = Math.sin(angle) * arcReach;
    let p = "M0,0";
    for (let i = 1; i <= segCount; i++) {
      const f = i / segCount;
      const baseX = targetX * f;
      const baseY = targetY * f;
      const perpX = -Math.sin(angle);
      const perpY = Math.cos(angle);
      const j = Math.sin(t * 4 + i + phaseSeed) * jitter * (1 - Math.abs(f - 0.5));
      p += ` L${(baseX + perpX * j).toFixed(2)},${(baseY + perpY * j).toFixed(2)}`;
    }
    return p;
  };

  const phase = ((t / period) % 1 + 1) % 1;
  const arcs = Array.from({ length: Math.max(arcCount, 0) }, (_, i) => {
    const baseAngle = (i / Math.max(arcCount, 1)) * Math.PI * 2;
    const myPhase = i / Math.max(arcCount, 1);
    const dist = Math.min(Math.abs(phase - myPhase), 1 - Math.abs(phase - myPhase));
    const opacity = Math.max(0.12, 1 - dist * Math.max(arcCount, 1) * 0.9);
    return { d: buildArc(baseAngle, c.arcSegments, c.jitter * 0.85, i * 1.7), opacity };
  });

  const coreScale = 1 + Math.sin(phase * Math.PI * 2) * 0.25;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={sphereGrad} cx="40%" cy="40%" r="80%">
          <stop offset="0%" stopColor={palette.nucleusDeep} stopOpacity={0.65} />
          <stop offset="70%" stopColor={palette.auraOuter} stopOpacity={0.85} />
          <stop offset="100%" stopColor={palette.auraOuter} />
        </radialGradient>
      </defs>

      <circle cx="0" cy="0" r={c.sphereRadius + 2} fill={palette.auraMid} opacity={c.auraStrength} filter={F.halo} />
      <circle cx="0" cy="0" r={c.sphereRadius} fill={`url(#${sphereGrad})`} stroke={palette.orbitHighlight} strokeWidth={0.4} strokeOpacity={0.4} />

      {arcs.map((a, i) => (
        <g key={i} opacity={a.opacity}>
          <path d={a.d} fill="none" stroke={palette.boltDeep} strokeWidth={c.arcStrokeWidth * 1.85} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} filter={F.halo} />
          <path d={a.d} fill="none" stroke={palette.boltMid} strokeWidth={c.arcStrokeWidth * 0.92} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} filter={F.soft} />
          <path d={a.d} fill="none" stroke={palette.boltBright} strokeWidth={c.arcStrokeWidth * 0.38} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}

      <circle cx="0" cy="0" r={c.coreRadius * coreScale} fill={palette.electron} filter={F.glow} />
      <circle cx="0" cy="0" r={c.coreRadius * 0.45} fill={palette.nucleusCore} />

      {c.showHighlight && (
        <ellipse cx="-7" cy="-9" rx="4" ry="2" transform="rotate(-30 -7 -9)" fill={palette.nucleusCore} opacity={c.highlightIntensity} filter={F.soft} />
      )}
    </svg>
  );
}
