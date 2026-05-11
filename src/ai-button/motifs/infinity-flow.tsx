import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Lemniscate (∞) yolu üzerinde 3 ışık noktası akar.
 * Parametrik: x = a*cos(t) / (1 + sin^2 t), y = a*sin(t)*cos(t) / (1 + sin^2 t)
 */
const A = 22;
const lemniscate = (t: number) => {
  const denom = 1 + Math.sin(t) * Math.sin(t);
  return {
    x: (A * Math.cos(t)) / denom,
    y: (A * Math.sin(t) * Math.cos(t)) / denom,
  };
};

export function InfinityFlowMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const startRef = useRef<number | null>(null);
  const [points, setPoints] = useState([
    { x: A, y: 0 },
    { x: A, y: 0 },
    { x: A, y: 0 },
  ]);

  useEffect(() => {
    let raf = 0;
    const period = hovered ? 2.8 : 4.6;
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      const t = (now - startRef.current) / 1000;
      const out = [0, 1, 2].map((i) => {
        const phase = (t / period + i / 3) * Math.PI * 2;
        return lemniscate(phase);
      });
      setPoints(out);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hovered]);

  // ∞ path için SVG yolu (yaklaşık)
  const buildPath = () => {
    const segs: string[] = [];
    const N = 80;
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      const p = lemniscate(t);
      segs.push(`${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`);
    }
    return segs.join(" ");
  };
  const path = buildPath();

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* yol — halo ve çekirdek */}
      <path
        d={path}
        fill="none"
        stroke={palette.orbitDeep}
        strokeWidth={2.6}
        opacity={0.4}
        filter={F.halo}
      />
      <path
        d={path}
        fill="none"
        stroke={palette.orbitMid}
        strokeWidth={1}
        opacity={0.7}
        filter={F.soft}
      />
      <path
        d={path}
        fill="none"
        stroke={palette.orbitHighlight}
        strokeWidth={0.4}
        opacity={0.9}
      />

      {/* akan ışıklar */}
      {points.map((p, i) => (
        <g key={i}>
          <motion.circle
            cx={p.x}
            cy={p.y}
            r={3}
            fill={palette.electron}
            opacity={0.5}
            filter={F.halo}
          />
          <circle
            cx={p.x}
            cy={p.y}
            r={1.4}
            fill={palette.nucleusCore}
            filter={F.glow}
          />
        </g>
      ))}
    </svg>
  );
}
