import { useEffect, useId, useRef, useState } from "react";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * 3 katmanlı akan S-eğrisi (Copilot-stil silk ribbon).
 * RAF ile control point y-osilasyonu.
 */
export function FlowingRibbonMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const ribbonGrad = `fr-${id}`;
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

  const speed = hoveredRef.current ? 1.4 : 0.7;
  const amp = hoveredRef.current ? 6 : 4;

  const buildPath = (phase: number) => {
    const sx = -24;
    const ex = 24;
    const c1x = -10;
    const c2x = 10;
    const c1y = -10 + Math.sin(t * speed + phase) * amp;
    const c2y = 10 + Math.cos(t * speed + phase) * amp;
    const sy = -2 + Math.sin(t * speed + phase + 0.7) * 3;
    const ey = 2 + Math.sin(t * speed + phase + 1.3) * 3;
    return `M${sx},${sy.toFixed(2)} C${c1x},${c1y.toFixed(2)} ${c2x},${c2y.toFixed(2)} ${ex},${ey.toFixed(2)}`;
  };

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={ribbonGrad} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor={palette.boltMid} />
          <stop offset="33%" stopColor={palette.electron} />
          <stop offset="66%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.auraMid} />
        </linearGradient>
      </defs>

      {/* back halo */}
      <path
        d={buildPath(0)}
        fill="none"
        stroke={palette.auraMid}
        strokeWidth={9}
        strokeLinecap="round"
        opacity={0.35}
        filter={F.halo}
      />

      {/* main ribbon */}
      <path
        d={buildPath(0)}
        fill="none"
        stroke={`url(#${ribbonGrad})`}
        strokeWidth={5}
        strokeLinecap="round"
        filter={F.glow}
      />

      {/* mid stroke */}
      <path
        d={buildPath(0)}
        fill="none"
        stroke={palette.orbitHighlight}
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.7}
      />

      {/* secondary thinner ribbon — out of phase */}
      <path
        d={buildPath(Math.PI * 0.7)}
        fill="none"
        stroke={palette.electron}
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity={0.55}
        filter={F.soft}
      />

      {/* third hairline */}
      <path
        d={buildPath(Math.PI * 1.4)}
        fill="none"
        stroke={palette.boltBright}
        strokeWidth={0.5}
        strokeLinecap="round"
        opacity={0.5}
      />
    </svg>
  );
}
