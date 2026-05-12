import { useEffect, useId, useRef, useState } from "react";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

const ARC_COUNT = { calm: 2, normal: 4, intense: 8 } as const;
const HOVER_ARC_BONUS = { calm: 0, normal: 2, intense: 2 } as const;
const SPEED = { calm: 0.4, normal: 1, intense: 2 } as const;
const JITTER = { calm: 1.4, normal: 2.4, intense: 3.2 } as const;

/**
 * Tesla / plazma topu — merkezden çepere zigzag arc'lar. Cam küre.
 * intensity: arc sayısı + jitter + hız değişir.
 */
export function PlasmaBallMotif({ palette, hovered, intensity = "normal" }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const sphereGrad = `pb-${id}`;
  const [t, setT] = useState(0);
  const startRef = useRef<number | null>(null);
  const hoveredRef = useRef(hovered);
  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      setT((now - startRef.current) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

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
      const j = (Math.sin(t * 6 + i * 1.3 + phaseSeed) + Math.sin(t * 9 + i * 0.7 + phaseSeed * 1.5)) * jitter * (1 - Math.abs(f - 0.5));
      p += ` L${(baseX + perpX * j).toFixed(2)},${(baseY + perpY * j).toFixed(2)}`;
    }
    return p;
  };

  const speedBase = SPEED[intensity];
  const speed = hoveredRef.current ? speedBase * 2 : speedBase;
  const baseArcCount = ARC_COUNT[intensity];
  const arcCount = baseArcCount + (hoveredRef.current ? HOVER_ARC_BONUS[intensity] : 0);
  const jitter = JITTER[intensity];
  const arcs = Array.from({ length: arcCount }, (_, i) => {
    const baseAngle = (i / arcCount) * Math.PI * 2 + t * speed * 0.3;
    return buildArc(baseAngle, 8, jitter, i * 1.7);
  });

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={sphereGrad} cx="40%" cy="40%" r="80%">
          <stop offset="0%" stopColor={palette.nucleusDeep} stopOpacity={0.7} />
          <stop offset="70%" stopColor={palette.auraOuter} stopOpacity={0.85} />
          <stop offset="100%" stopColor={palette.auraOuter} stopOpacity={1} />
        </radialGradient>
      </defs>

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.22} filter={F.halo} />

      {/* cam küre arka yüzü */}
      <circle cx="0" cy="0" r="20" fill={`url(#${sphereGrad})`} stroke={palette.orbitHighlight} strokeWidth={0.4} strokeOpacity={0.4} />

      {/* arc'lar */}
      {arcs.map((p, i) => (
        <g key={i}>
          <path d={p} fill="none" stroke={palette.boltDeep} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} filter={F.halo} />
          <path d={p} fill="none" stroke={palette.boltMid} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} filter={F.soft} />
          <path d={p} fill="none" stroke={palette.boltBright} strokeWidth={0.5} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}

      {/* merkez plazma çekirdeği */}
      <circle cx="0" cy="0" r="3.6" fill={palette.electron} filter={F.glow} />
      <circle cx="0" cy="0" r="1.6" fill={palette.nucleusCore} />

      {/* cam küre highlight */}
      <ellipse cx="-7" cy="-9" rx="4" ry="2" transform="rotate(-30 -7 -9)" fill={palette.nucleusCore} opacity={0.35} filter={F.soft} />
    </svg>
  );
}
