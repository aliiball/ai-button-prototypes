import { useId } from "react";
import { SharedDefs, filterIds } from "../shared/filters";
import { useRafTime } from "../shared/use-raf-time";
import type { VariantProps } from "../shared/types";

const SLEEPING_SPEED = { calm: 0.18, normal: 0.32, intense: 0.55 } as const;
const SLEEPING_JITTER = { calm: 0.9, normal: 1.4, intense: 2.1 } as const;
const SLEEPING_ARCS = { calm: 1, normal: 2, intense: 3 } as const;

/**
 * Plasma · Sleeping — 1-3 ince arc, çok yavaş kıpırdar. Cam küre highlight'ı belirgin.
 * "Uykuda plasma" hissi: ana karakter cam küre + sakin titreşen iç.
 */
export function PlasmaSleepingStyle({ palette, hovered, intensity }: VariantProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const t = useRafTime();
  const sphereGrad = `ps-s-${id}`;
  const speed = SLEEPING_SPEED[intensity] * (hovered ? 1.8 : 1);
  const jitter = SLEEPING_JITTER[intensity];
  const arcCount = SLEEPING_ARCS[intensity] + (hovered ? 1 : 0);

  const buildArc = (angle: number, segCount: number, j: number, phaseSeed: number) => {
    const targetX = Math.cos(angle) * 15;
    const targetY = Math.sin(angle) * 15;
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

  const arcs = Array.from({ length: arcCount }, (_, i) => {
    const baseAngle = (i / arcCount) * Math.PI * 2 + t * speed;
    return buildArc(baseAngle, 6, jitter, i * 2.1);
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

      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.18} filter={F.halo} />
      <circle cx="0" cy="0" r="20" fill={`url(#${sphereGrad})`} stroke={palette.orbitHighlight} strokeWidth={0.4} strokeOpacity={0.45} />

      {arcs.map((p, i) => (
        <g key={i}>
          <path d={p} fill="none" stroke={palette.boltDeep} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} filter={F.halo} />
          <path d={p} fill="none" stroke={palette.boltMid} strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} filter={F.soft} />
          <path d={p} fill="none" stroke={palette.boltBright} strokeWidth={0.4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}

      {/* merkez */}
      <circle cx="0" cy="0" r="2.8" fill={palette.electron} filter={F.glow} opacity={0.85} />
      <circle cx="0" cy="0" r="1.2" fill={palette.nucleusCore} />

      {/* iri cam highlight */}
      <ellipse cx="-7" cy="-9" rx="5" ry="2.6" transform="rotate(-30 -7 -9)" fill={palette.nucleusCore} opacity={0.5} filter={F.soft} />
      <ellipse cx="-4" cy="-12" rx="1.6" ry="0.9" transform="rotate(-30 -4 -12)" fill={palette.nucleusCore} opacity={0.7} />
    </svg>
  );
}

const SYNC_PERIOD = { calm: 2.4, normal: 1.6, intense: 1.0 } as const;
const SYNC_ARCS = { calm: 4, normal: 6, intense: 8 } as const;

/**
 * Plasma · Pulse-sync — N arc, her arc nucleus pulse cycle'ının N-fazından birinde parlar.
 * "Senkronlu" plazma: arc'lar sırayla yanıp söner.
 */
export function PlasmaPulseSyncStyle({ palette, hovered, intensity }: VariantProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const t = useRafTime();
  const sphereGrad = `pps-s-${id}`;
  const period = SYNC_PERIOD[intensity] * (hovered ? 0.6 : 1);
  const arcCount = SYNC_ARCS[intensity];

  const buildArc = (angle: number, segCount: number, jitter: number, phaseSeed: number) => {
    const targetX = Math.cos(angle) * 16;
    const targetY = Math.sin(angle) * 16;
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
  const arcs = Array.from({ length: arcCount }, (_, i) => {
    const baseAngle = (i / arcCount) * Math.PI * 2;
    const myPhase = i / arcCount;
    const dist = Math.min(Math.abs(phase - myPhase), 1 - Math.abs(phase - myPhase));
    const opacity = Math.max(0.12, 1 - dist * arcCount * 0.9);
    return { d: buildArc(baseAngle, 8, 2.0, i * 1.7), opacity };
  });

  // nucleus pulse, aynı phase
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

      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.22} filter={F.halo} />
      <circle cx="0" cy="0" r="20" fill={`url(#${sphereGrad})`} stroke={palette.orbitHighlight} strokeWidth={0.4} strokeOpacity={0.4} />

      {arcs.map((a, i) => (
        <g key={i} opacity={a.opacity}>
          <path d={a.d} fill="none" stroke={palette.boltDeep} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} filter={F.halo} />
          <path d={a.d} fill="none" stroke={palette.boltMid} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} filter={F.soft} />
          <path d={a.d} fill="none" stroke={palette.boltBright} strokeWidth={0.5} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}

      <circle cx="0" cy="0" r={3.6 * coreScale} fill={palette.electron} filter={F.glow} />
      <circle cx="0" cy="0" r="1.6" fill={palette.nucleusCore} />

      <ellipse cx="-7" cy="-9" rx="4" ry="2" transform="rotate(-30 -7 -9)" fill={palette.nucleusCore} opacity={0.35} filter={F.soft} />
    </svg>
  );
}
