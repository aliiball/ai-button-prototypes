import { useEffect, useId, useRef, useState } from "react";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";
import type { PlasmaConfig } from "../../atelier/configs";

const ARC_COUNT = { calm: 2, normal: 4, intense: 8 } as const;
const SPEED = { calm: 0.4, normal: 1, intense: 2 } as const;
const JITTER = { calm: 1.4, normal: 2.4, intense: 3.2 } as const;

function resolveConfig(intensity: "calm" | "normal" | "intense", config?: unknown): PlasmaConfig {
  const def: PlasmaConfig = {
    arcCount: ARC_COUNT[intensity],
    arcSegments: 8,
    jitter: JITTER[intensity],
    speed: SPEED[intensity],
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

export function PlasmaBallMotif({ palette, hovered, intensity = "normal", config }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const c = resolveConfig(intensity, config);
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
      const j = (Math.sin(t * 6 + i * 1.3 + phaseSeed) + Math.sin(t * 9 + i * 0.7 + phaseSeed * 1.5)) * jitter * (1 - Math.abs(f - 0.5));
      p += ` L${(baseX + perpX * j).toFixed(2)},${(baseY + perpY * j).toFixed(2)}`;
    }
    return p;
  };

  const speedBase = c.speed;
  const speed = hoveredRef.current ? speedBase * 2 : speedBase;
  const arcCount = c.arcCount + (hoveredRef.current ? c.hoverArcBonus : 0);
  const arcs = Array.from({ length: Math.max(arcCount, 0) }, (_, i) => {
    const baseAngle = (i / Math.max(arcCount, 1)) * Math.PI * 2 + t * speed * 0.3;
    return buildArc(baseAngle, c.arcSegments, c.jitter, i * 1.7);
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

      <circle cx="0" cy="0" r={c.sphereRadius + 2} fill={palette.auraMid} opacity={c.auraStrength} filter={F.halo} />

      <circle cx="0" cy="0" r={c.sphereRadius} fill={`url(#${sphereGrad})`} stroke={palette.orbitHighlight} strokeWidth={0.4} strokeOpacity={0.4} />

      {arcs.map((p, i) => (
        <g key={i}>
          <path d={p} fill="none" stroke={palette.boltDeep} strokeWidth={c.arcStrokeWidth * 2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} filter={F.halo} />
          <path d={p} fill="none" stroke={palette.boltMid} strokeWidth={c.arcStrokeWidth} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} filter={F.soft} />
          <path d={p} fill="none" stroke={palette.boltBright} strokeWidth={c.arcStrokeWidth * 0.4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}

      <circle cx="0" cy="0" r={c.coreRadius} fill={palette.electron} filter={F.glow} />
      <circle cx="0" cy="0" r={c.coreRadius * 0.45} fill={palette.nucleusCore} />

      {c.showHighlight && (
        <>
          <ellipse cx="-7" cy="-9" rx="4" ry="2" transform="rotate(-30 -7 -9)" fill={palette.nucleusCore} opacity={c.highlightIntensity} filter={F.soft} />
          <ellipse cx="-4" cy="-12" rx="1.6" ry="0.9" transform="rotate(-30 -4 -12)" fill={palette.nucleusCore} opacity={c.highlightIntensity * 1.8} />
        </>
      )}
    </svg>
  );
}
